import express from 'express';
import { db } from '../db/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protect all admin endpoints with RBAC middleware
router.use(authenticate);

/**
 * GET /api/admin/dashboard (FR-030, §16 - Real KPI metrics & charts)
 */
router.get('/dashboard', requireRole(['super_admin', 'admin', 'operations_manager', 'finance_officer']), (req, res) => {
  // 1. Total and Today's Sales
  const salesTodayRow = db.prepare(`
    SELECT COALESCE(SUM(deposit_paid), 0) as total
    FROM orders
    WHERE DATE(created_at) = DATE('now')
  `).get();

  const totalSalesRow = db.prepare(`
    SELECT COALESCE(SUM(deposit_paid), 0) as total
    FROM orders
  `).get();

  // 2. Orders and Bookings Counts
  const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'Pending'").get().count;
  const inProduction = db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'In Production'").get().count;
  const activeRentals = db.prepare("SELECT COUNT(*) as count FROM rental_reservations WHERE status IN ('Reserved', 'Active')").get().count;
  const pendingQuotes = db.prepare("SELECT COUNT(*) as count FROM quotes WHERE status = 'Pending'").get().count;

  // 3. Outstanding Balances & Low Stock
  const outstandingRow = db.prepare(`
    SELECT COALESCE(SUM(balance_due), 0) as total
    FROM orders
    WHERE balance_due > 0 AND order_status NOT IN ('Cancelled', 'Completed')
  `).get();

  const lowStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock_quantity <= 10').get().count;
  const itemsInMaintenance = db.prepare("SELECT COUNT(*) as count FROM rental_assets WHERE status = 'Maintenance'").get().count;
  const customerCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get().count;

  // 4. Category breakdown
  const categoryBreakdown = db.prepare(`
    SELECT pillar, COUNT(*) as count
    FROM products
    GROUP BY pillar
  `).all();

  // 5. Recent 5 Orders
  const recentOrders = db.prepare(`
    SELECT id, order_number, customer_name, total_amount, deposit_paid, balance_due, payment_status, order_status, created_at
    FROM orders
    ORDER BY created_at DESC LIMIT 5
  `).all();

  res.json({
    metrics: {
      salesToday: salesTodayRow.total,
      totalSales: totalSalesRow.total,
      pendingOrders,
      inProduction,
      activeRentals,
      pendingQuotes,
      outstandingBalances: outstandingRow.total,
      lowStockItems: lowStock,
      maintenanceCount: itemsInMaintenance,
      totalCustomers: customerCount
    },
    categoryBreakdown,
    recentOrders
  });
});

/**
 * GET /api/admin/customers (FR-045)
 */
router.get('/customers', requireRole(['super_admin', 'admin', 'sales_officer']), (req, res) => {
  const customers = db.prepare(`
    SELECT u.id, u.name, u.email, u.phone, u.status, u.created_at,
           c.university, c.programme, c.graduation_year,
           COUNT(o.id) as order_count,
           COALESCE(SUM(o.deposit_paid), 0) as total_spent
    FROM users u
    LEFT JOIN customers c ON u.id = c.user_id
    LEFT JOIN orders o ON u.email = o.email OR u.id = o.user_id
    WHERE u.role = 'customer'
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all();

  res.json({ count: customers.length, customers });
});

/**
 * PUT /api/admin/customers/:id/suspend (FR-045 - Account suspension)
 */
router.put('/customers/:id/suspend', requireRole(['super_admin', 'admin']), (req, res) => {
  const { status } = req.body; // 'active' or 'suspended'
  const newStatus = status === 'active' ? 'active' : 'suspended';

  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(newStatus, req.params.id);
  res.json({ message: `Customer account is now ${newStatus}` });
});

/**
 * GET & PUT /api/admin/settings (§46 System Settings)
 */
router.get('/settings', (req, res) => {
  const rows = db.prepare('SELECT * FROM settings').all();
  const settingsObj = {};
  for (const r of rows) {
    try {
      settingsObj[r.key] = JSON.parse(r.value);
    } catch {
      settingsObj[r.key] = r.value;
    }
  }
  res.json({ settings: settingsObj });
});

router.put('/settings', requireRole(['super_admin', 'admin']), (req, res) => {
  const updates = req.body;
  const updateStmt = db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `);

  for (const [key, val] of Object.entries(updates)) {
    const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
    updateStmt.run(key, valStr);
  }

  res.json({ message: 'Settings saved successfully' });
});

/**
 * Design Proofs Workflow (FR-009, BR-003)
 */
router.post('/design-proofs', requireRole(['super_admin', 'admin', 'operations_manager']), (req, res) => {
  const { orderId, orderItemId, proofImageUrl, notes } = req.body;

  const proofId = `prf-${Date.now()}`;
  db.prepare(`
    INSERT INTO design_proofs (id, order_id, order_item_id, proof_image_url, notes, status, uploaded_by)
    VALUES (?, ?, ?, ?, ?, 'Awaiting Approval', ?)
  `).run(proofId, orderId, orderItemId, proofImageUrl, notes || '', req.user.name);

  // Update order item status
  db.prepare("UPDATE order_items SET design_status = 'Under Review' WHERE id = ?").run(orderItemId);

  // Append Event Timeline (§21)
  db.prepare(`
    INSERT INTO order_events (id, order_id, event_type, description, actor_name)
    VALUES (?, ?, 'design_uploaded', 'Staff uploaded custom embroidery/print design proof for customer approval.', ?)
  `).run(`evt-${Date.now()}`, orderId, req.user.name);

  res.status(201).json({ message: 'Design proof uploaded and submitted for customer approval', proofId });
});

/**
 * Return Inspection & Deposit Settlement (FR-038, BR-007)
 */
router.post('/inspections', requireRole(['super_admin', 'admin', 'operations_manager']), (req, res) => {
  const { orderId, returnedQty, missingQty, damagedQty, condition, cleanliness, notes, suggestedDeduction } = req.body;

  const inspectionId = `insp-${Date.now()}`;
  const deduction = parseFloat(suggestedDeduction) || 0;

  db.prepare(`
    INSERT INTO return_inspections (
      id, order_id, inspected_by, returned_qty, missing_qty, damaged_qty,
      condition, cleanliness, notes, suggested_deduction
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    inspectionId, orderId, req.user.name, parseInt(returnedQty) || 0,
    parseInt(missingQty) || 0, parseInt(damagedQty) || 0, condition || 'Good',
    cleanliness || 'Clean', notes || '', deduction
  );

  // Update rental reservation status from Active to Returned
  db.prepare("UPDATE rental_reservations SET status = 'Returned' WHERE order_id = ?").run(orderId);

  // Settle security deposit
  const deposit = db.prepare('SELECT * FROM security_deposits WHERE order_id = ?').get(orderId);
  if (deposit) {
    const refundAmount = Math.max(0, deposit.total_deposit - deduction);
    const newStatus = deduction > 0 ? 'Partially Deducted' : 'Refunded';

    db.prepare(`
      UPDATE security_deposits
      SET deducted_amount = ?, refunded_amount = ?, status = ?, deduction_reasons = ?, settled_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(deduction, refundAmount, newStatus, notes || 'Post-event inspection completed', deposit.id);
  }

  // Append Event Timeline (§21)
  db.prepare(`
    INSERT INTO order_events (id, order_id, event_type, description, actor_name)
    VALUES (?, ?, 'inspection_completed', ?, ?)
  `).run(
    `evt-${Date.now()}`,
    orderId,
    `Rental return inspection completed by ${req.user.name}. Condition: ${condition}. Deduction: GH₵ ${deduction}.`,
    req.user.name
  );

  res.status(201).json({ message: 'Return inspection recorded and deposit settled' });
});

export default router;
