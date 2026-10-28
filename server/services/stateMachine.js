import { db, runTransaction } from '../db/database.js';

/**
 * Validated Order Status Transitions (FR-025, §42)
 */
const VALID_ORDER_TRANSITIONS = {
  'Pending': ['Awaiting Payment', 'Payment Confirmed', 'Approved', 'In Production', 'Cancelled'],
  'Awaiting Payment': ['Payment Confirmed', 'Cancelled'],
  'Payment Confirmed': ['Approved', 'Awaiting Design', 'In Production', 'Ready', 'Cancelled'],
  'Approved': ['In Production', 'Cancelled'],
  'Awaiting Design': ['In Production', 'Cancelled'],
  'In Production': ['Ready', 'Cancelled'],
  'Ready': ['Dispatched', 'Cancelled'],
  'Dispatched': ['Delivered', 'Cancelled'],
  'Delivered': ['Completed', 'Refunded'],
  'Completed': ['Refunded'],
  'Cancelled': [],
  'Refunded': []
};

/**
 * Validated Rental Status Transitions (FR-026, BR-007)
 */
const VALID_RENTAL_TRANSITIONS = {
  'Requested': ['Pending Confirmation', 'Cancelled'],
  'Pending Confirmation': ['Reserved', 'Cancelled'],
  'Reserved': ['Preparing', 'Cancelled'],
  'Preparing': ['Ready for Dispatch', 'Cancelled'],
  'Ready for Dispatch': ['Out for Delivery', 'Cancelled'],
  'Out for Delivery': ['Setup', 'Active'],
  'Setup': ['Active'],
  'Active': ['Awaiting Pickup'],
  'Awaiting Pickup': ['Returned'],
  'Returned': ['Inspection'],
  'Inspection': ['Completed', 'Damaged'],
  'Damaged': ['Completed'],
  'Completed': [],
  'Cancelled': []
};

/**
 * Transitions order status with strict business rules enforcement.
 */
export function transitionOrderStatus(orderId, newStatus, actorName = 'Staff', notes = '') {
  return runTransaction(() => {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const currentStatus = order.order_status;
    const allowed = VALID_ORDER_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      throw new Error(`Illegal state transition: cannot jump from '${currentStatus}' to '${newStatus}'.`);
    }

    // BR-003 Enforcement: Cannot enter 'In Production' if design approval is pending
    if (newStatus === 'In Production') {
      const pendingItems = db.prepare(`
        SELECT COUNT(*) as count FROM order_items
        WHERE order_id = ? AND customization_data IS NOT NULL AND design_status NOT IN ('Approved', 'None')
      `).get(orderId);

      const pendingProof = db.prepare(`
        SELECT COUNT(*) as count FROM design_proofs
        WHERE order_id = ? AND status != 'Approved'
      `).get(orderId);

      if ((pendingItems?.count || 0) > 0 || (pendingProof?.count || 0) > 0) {
        throw new Error(`BR-003 Artwork Approval Gate: Cannot start production until customer approves design proofs.`);
      }
    }

    // BR-007 Enforcement: Cannot complete order with rental components unless returned
    if (newStatus === 'Completed') {
      const activeRental = db.prepare(`
        SELECT COUNT(*) as count FROM rental_reservations
        WHERE order_id = ? AND status IN ('Reserved', 'Active', 'Hold')
      `).get(orderId);
      if (activeRental?.count > 0) {
        throw new Error(`BR-007 Rental Return Requirement: Cannot complete order until rented equipment is returned and inspected.`);
      }
    }

    // Update status
    db.prepare('UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, orderId);

    // Record Event Timeline (§21)
    db.prepare(`
      INSERT INTO order_events (id, order_id, event_type, description, actor_name)
      VALUES (?, ?, 'status_change', ?, ?)
    `).run(
      `evt-${Date.now()}`,
      orderId,
      `Order status updated from '${currentStatus}' to '${newStatus}'. ${notes}`.trim(),
      actorName
    );

    return { success: true, orderId, oldStatus: currentStatus, newStatus };
  });
}
