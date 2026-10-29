import express from 'express';
import { db } from '../db/database.js';
import { checkRentalAvailability } from '../services/availabilityEngine.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/rentals/availability (FR-012, BR-001)
 * Query: productId, startDate, endDate, quantity
 */
router.get('/availability', (req, res) => {
  const { productId, startDate, endDate, quantity } = req.query;

  if (!productId || !startDate || !endDate) {
    return res.status(400).json({ error: 'productId, startDate, and endDate are required parameters.' });
  }

  const result = checkRentalAvailability(
    productId,
    startDate,
    endDate,
    parseInt(quantity) || 1
  );

  res.json(result);
});

/**
 * GET /api/rentals/assets (FR-034 - Reusable Asset units)
 */
router.get('/assets', (req, res) => {
  const assets = db.prepare(`
    SELECT ra.*, p.name as product_name
    FROM rental_assets ra
    LEFT JOIN products p ON ra.product_id = p.id
    ORDER BY ra.asset_code ASC
  `).all();

  res.json({ count: assets.length, assets });
});

/**
 * PUT /api/rentals/assets/:id/maintenance (FR-035)
 */
router.put('/assets/:id/maintenance', authenticate, requireRole(['super_admin', 'admin', 'inventory_officer']), (req, res) => {
  const { status, maintenance_reason } = req.body;
  const { id } = req.params;

  db.prepare(`
    UPDATE rental_assets
    SET status = ?, maintenance_reason = ?, last_inspected = CURRENT_TIMESTAMP
    WHERE id = ? OR asset_code = ?
  `).run(status || 'Maintenance', maintenance_reason || '', id, id);

  res.json({ message: 'Asset maintenance status updated' });
});

/**
 * GET /api/rentals/calendar (§30 Admin Rental Calendar)
 */
router.get('/calendar', authenticate, requireRole(['super_admin', 'admin', 'operations_manager']), (req, res) => {
  const reservations = db.prepare(`
    SELECT rr.*, o.order_number, o.customer_name, o.phone, o.delivery_location, p.name as product_name
    FROM rental_reservations rr
    JOIN orders o ON rr.order_id = o.id
    JOIN products p ON rr.product_id = p.id
    WHERE rr.status IN ('Reserved', 'Active')
    ORDER BY rr.start_date ASC
  `).all();

  res.json({ reservations });
});

export default router;
