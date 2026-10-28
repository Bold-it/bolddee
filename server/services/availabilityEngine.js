import { db, runTransaction } from '../db/database.js';

/**
 * Calculates real-time rental inventory availability.
 * Conforms to SRS FR-012, BR-001, BR-008, BR-009.
 *
 * @param {string} productId - Product ID (e.g. 'r1', 'r2')
 * @param {string} startDate - Start Date 'YYYY-MM-DD'
 * @param {string} endDate   - End Date 'YYYY-MM-DD'
 * @param {number} requestedQty - Desired quantity
 * @returns {object} { available: boolean, availableStock: number, totalStock: number, reservedStock: number, maintenanceCount: number }
 */
export function checkRentalAvailability(productId, startDate, endDate, requestedQty = 1) {
  // 1. Fetch Product Stock
  const product = db.prepare('SELECT id, name, stock_quantity, is_rental FROM products WHERE id = ?').get(productId);
  if (!product) {
    return { available: false, error: 'Product not found', availableStock: 0 };
  }

  if (!product.is_rental) {
    return { available: product.stock_quantity >= requestedQty, availableStock: product.stock_quantity };
  }

  // 2. Fetch Assets in Maintenance (FR-035)
  const maintenance = db.prepare(`
    SELECT COUNT(*) as count FROM rental_assets
    WHERE product_id = ? AND status = 'Maintenance'
  `).get(productId);
  const maintenanceCount = maintenance?.count || 0;

  // 3. Calculate Operational Window with 1-day buffer (FR-012, ASSUMPTIONS.md)
  const startObj = new Date(startDate);
  startObj.setDate(startObj.getDate() - 1); // 1 day setup buffer
  const bufferedStart = startObj.toISOString().split('T')[0];

  const endObj = new Date(endDate);
  endObj.setDate(endObj.getDate() + 1); // 1 day return/cleaning buffer
  const bufferedEnd = endObj.toISOString().split('T')[0];

  // 4. Query Overlapping Confirmed Reservations + Active Unexpired Holds (BR-009)
  const reservationRow = db.prepare(`
    SELECT COALESCE(SUM(quantity), 0) as reserved_quantity
    FROM rental_reservations
    WHERE product_id = ?
      AND status IN ('Reserved', 'Active', 'Hold')
      AND NOT (end_date < ? OR start_date > ?)
      AND (status != 'Hold' OR hold_expires_at > CURRENT_TIMESTAMP)
  `).get(productId, bufferedStart, bufferedEnd);

  const reservedStock = reservationRow.reserved_quantity || 0;
  const effectiveTotal = Math.max(0, product.stock_quantity - maintenanceCount);
  const availableStock = Math.max(0, effectiveTotal - reservedStock);

  return {
    available: availableStock >= requestedQty,
    availableStock,
    totalStock: product.stock_quantity,
    reservedStock,
    maintenanceCount,
    bufferedStart,
    bufferedEnd
  };
}

/**
 * Atomically reserves inventory inside a transaction (BR-009).
 * Prevents race conditions and double-booking.
 */
export function reserveRentalInventory(orderId, items, holdMinutes = 30) {
  return runTransaction(() => {
    const holdExpiresAt = new Date(Date.now() + holdMinutes * 60 * 1000).toISOString();

    for (const item of items) {
      if (item.is_rental && item.rental_details) {
        const details = typeof item.rental_details === 'string'
          ? JSON.parse(item.rental_details)
          : item.rental_details;

        const check = checkRentalAvailability(
          item.product_id,
          details.startDate,
          details.endDate,
          item.quantity
        );

        if (!check.available) {
          throw new Error(
            `Inventory conflict: '${item.item_name}' only has ${check.availableStock} available for the requested dates (${details.startDate} to ${details.endDate}).`
          );
        }

        // Insert reservation hold
        db.prepare(`
          INSERT INTO rental_reservations (id, order_id, product_id, quantity, start_date, end_date, status, hold_expires_at)
          VALUES (?, ?, ?, ?, ?, ?, 'Hold', ?)
        `).run(
          `res-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          orderId,
          item.product_id,
          item.quantity,
          details.startDate,
          details.endDate,
          holdExpiresAt
        );

        // Record inventory movement (FR-033)
        db.prepare(`
          INSERT INTO inventory_movements (id, product_id, movement_type, quantity, reference, reason)
          VALUES (?, ?, 'Reserved', ?, ?, 'Checkout Reservation Hold')
        `).run(
          `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          item.product_id,
          item.quantity,
          orderId
        );
      }
    }
    return true;
  });
}
