import express from 'express';
import { db, runTransaction } from '../db/database.js';
import { calculateOrderPricing } from '../services/pricingEngine.js';
import { reserveRentalInventory } from '../services/availabilityEngine.js';
import { initializePayment } from '../services/paymentGateway.js';
import { transitionOrderStatus } from '../services/stateMachine.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate sequential order numbers (§26: format BD-YYYY-XXXXX)
function generateOrderNumber() {
  const year = new Date().getFullYear();
  const lastOrder = db.prepare(`
    SELECT order_number FROM orders
    WHERE order_number LIKE ?
    ORDER BY created_at DESC LIMIT 1
  `).get(`BD-${year}-%`);

  let nextSeq = 1;
  if (lastOrder && lastOrder.order_number) {
    const parts = lastOrder.order_number.split('-');
    const lastSeq = parseInt(parts[2], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }

  const paddedSeq = String(nextSeq).padStart(5, '0');
  return `BD-${year}-${paddedSeq}`;
}

/**
 * POST /api/orders (FR-021, §25 - Checkout & Order Creation)
 */
router.post('/', (req, res) => {
  const {
    customerName,
    email,
    phone,
    deliveryLocation,
    deliveryZone = 'ZONE_A',
    eventDate,
    deliveryDate,
    items,
    couponCode,
    ambassadorCode,
    notes,
    paymentMethod = 'MTN Mobile Money',
    termsAccepted
  } = req.body;

  if (!customerName || !email || !phone || !deliveryLocation) {
    return res.status(400).json({ error: 'Name, email, phone, and delivery venue are required.' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Shopping cart is empty.' });
  }

  try {
    const orderResult = runTransaction(() => {
      // 1. Calculate pricing server-side
      const pricing = calculateOrderPricing(items, deliveryZone, couponCode);

      const orderId = `ord-${Date.now()}`;
      const orderNumber = generateOrderNumber();

      // 2. Atomically reserve rental inventory holds (BR-009)
      reserveRentalInventory(orderId, pricing.processedItems);

      // 3. Set Balance payment deadline (48 hours before delivery / event date)
      let balanceDeadline = null;
      if (deliveryDate || eventDate) {
        const targetDate = new Date(deliveryDate || eventDate);
        targetDate.setHours(targetDate.getHours() - 48);
        balanceDeadline = targetDate.toISOString();
      }

      // 4. Create Order record
      db.prepare(`
        INSERT INTO orders (
          id, order_number, user_id, customer_name, email, phone,
          subtotal, discount, delivery_fee, setup_fee, security_deposit,
          total_amount, deposit_paid, balance_due, balance_deadline,
          payment_status, order_status, event_date, delivery_date,
          delivery_location, delivery_zone, ambassador_code, notes, terms_accepted_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, 0, ?, ?,
          'Awaiting Payment', 'Pending', ?, ?,
          ?, ?, ?, ?, CURRENT_TIMESTAMP
        )
      `).run(
        orderId, orderNumber, req.user?.id || null, customerName, email, phone,
        pricing.subtotal, pricing.discount, pricing.deliveryFee, pricing.setupFee, pricing.securityDeposit,
        pricing.grandTotal, pricing.grandTotal, balanceDeadline,
        eventDate || null, deliveryDate || null,
        deliveryLocation, deliveryZone, ambassadorCode || null, notes || null
      );

      // 5. Insert Order Items
      const insertItem = db.prepare(`
        INSERT INTO order_items (
          id, order_id, product_id, item_name, quantity, unit_price,
          customization_data, is_rental, rental_details, design_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of pricing.processedItems) {
        const itemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const hasCustomization = item.customization_data !== null;
        insertItem.run(
          itemId,
          orderId,
          item.product_id,
          item.item_name,
          item.quantity,
          item.unit_price,
          item.customization_data ? JSON.stringify(item.customization_data) : null,
          item.is_rental,
          item.rental_details ? JSON.stringify(item.rental_details) : null,
          hasCustomization ? 'Pending Draft' : 'None'
        );
      }

      // 6. Record Security Deposit if rentals are present (BR-006)
      if (pricing.securityDeposit > 0) {
        db.prepare(`
          INSERT INTO security_deposits (id, order_id, total_deposit, status)
          VALUES (?, ?, ?, 'Held')
        `).run(`dep-${Date.now()}`, orderId, pricing.securityDeposit);
      }

      // 7. Append Initial Timeline Event (§21)
      db.prepare(`
        INSERT INTO order_events (id, order_id, event_type, description, actor_name)
        VALUES (?, ?, 'order_created', ?, 'Customer')
      `).run(`evt-${Date.now()}`, orderId, `Order placed. 60% booking deposit of GH₵ ${pricing.requiredDeposit60.toLocaleString()} required.`);

      return { orderId, orderNumber, pricing };
    });

    // 8. Initialize Payment Session (MoMo / Card)
    initializePayment({
      orderId: orderResult.orderId,
      amount: orderResult.pricing.requiredDeposit60,
      email,
      phone,
      paymentMethod
    }).then((paymentSession) => {
      res.status(201).json({
        message: 'Order created successfully',
        orderId: orderResult.orderId,
        orderNumber: orderResult.orderNumber,
        pricing: orderResult.pricing,
        payment: paymentSession
      });
    });

  } catch (err) {
    console.error('Order creation error:', err);
    res.status(400).json({ error: err.message || 'Failed to process order' });
  }
});

/**
 * GET /api/orders/track/:orderNumber (FR-027 Live Tracking)
 */
router.get('/track/:query', (req, res) => {
  const { query } = req.params;
  const cleaned = query.trim().toUpperCase();

  const order = db.prepare(`
    SELECT * FROM orders
    WHERE UPPER(order_number) = ? OR id = ? OR phone = ?
    ORDER BY created_at DESC LIMIT 1
  `).get(cleaned, query, query);

  if (!order) {
    return res.status(404).json({ error: `No order found matching '${query}'. Please check your reference code.` });
  }

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  const events = db.prepare('SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at ASC').all(order.id);
  const deposit = db.prepare('SELECT * FROM security_deposits WHERE order_id = ?').get(order.id);

  res.json({
    order,
    items: items.map(i => ({
      ...i,
      customization_data: i.customization_data ? JSON.parse(i.customization_data) : null,
      rental_details: i.rental_details ? JSON.parse(i.rental_details) : null
    })),
    timeline: events,
    securityDeposit: deposit
  });
});

/**
 * GET /api/orders (Admin list with status filters)
 */
router.get('/', authenticate, requireRole(['super_admin', 'admin', 'operations_manager', 'sales_officer', 'finance_officer']), (req, res) => {
  const { status, payment_status, limit = 50 } = req.query;

  let sql = 'SELECT * FROM orders WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    sql += ' AND order_status = ?';
    params.push(status);
  }

  if (payment_status) {
    sql += ' AND payment_status = ?';
    params.push(payment_status);
  }

  sql += ' ORDER BY created_at DESC LIMIT ?';
  params.push(parseInt(limit) || 50);

  const orders = db.prepare(sql).all(...params);
  res.json({ count: orders.length, orders });
});

/**
 * PUT /api/orders/:id/status (FR-025 - State Machine Transition)
 */
router.put('/:id/status', authenticate, requireRole(['super_admin', 'admin', 'operations_manager']), (req, res) => {
  const { newStatus, notes } = req.body;
  if (!newStatus) return res.status(400).json({ error: 'newStatus is required' });

  try {
    const result = transitionOrderStatus(req.params.id, newStatus, req.user.name, notes);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
