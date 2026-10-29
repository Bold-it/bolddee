/**
 * BOLDDEE RENTALS — BACKGROUND WORKER & SCHEDULER
 * Conforms to: SRS §36, FR-029, BR-004, Phase 3 & 5 Reliability
 * 
 * Tasks:
 * 1. Expire unpaid checkout holds (30-min hold TTL) -> release inventory
 * 2. Flag overdue balance payments (48h deadline)
 * 3. Daily midnight hot database backup
 */

import { db, runTransaction } from '../db/database.js';
import { performBackup } from '../db/backup.js';

export function expireUnpaidCheckoutHolds() {
  const expiredHolds = db.prepare(`
    SELECT id, order_id, product_id, quantity
    FROM rental_reservations
    WHERE status = 'Hold' AND hold_expires_at IS NOT NULL AND hold_expires_at < CURRENT_TIMESTAMP
  `).all();

  if (expiredHolds.length > 0) {
    runTransaction(() => {
      const updateStmt = db.prepare("UPDATE rental_reservations SET status = 'Cancelled' WHERE id = ?");
      for (const h of expiredHolds) {
        updateStmt.run(h.id);
        db.prepare(`
          INSERT INTO order_events (id, order_id, event_type, description, actor_name)
          VALUES (?, ?, 'hold_expired', '30-minute unpaid checkout hold expired. Inventory released.', 'System Scheduler')
        `).run(`evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, h.order_id);
      }
    });
    console.log(`⏱️ [SCHEDULER] Released ${expiredHolds.length} expired checkout holds.`);
  }
}

export function flagOverdueBalances() {
  const overdueOrders = db.prepare(`
    SELECT id, order_number, customer_name, balance_due, balance_deadline
    FROM orders
    WHERE balance_due > 0 
      AND balance_deadline IS NOT NULL 
      AND balance_deadline < CURRENT_TIMESTAMP
      AND order_status NOT IN ('Cancelled', 'Completed')
  `).all();

  if (overdueOrders.length > 0) {
    for (const ord of overdueOrders) {
      // Check if already flagged today
      const alreadyFlagged = db.prepare(`
        SELECT COUNT(*) as count FROM order_events
        WHERE order_id = ? AND event_type = 'balance_overdue' AND DATE(created_at) = DATE('now')
      `).get(ord.id);

      if (alreadyFlagged.count === 0) {
        db.prepare(`
          INSERT INTO order_events (id, order_id, event_type, description, actor_name)
          VALUES (?, ?, 'balance_overdue', ?, 'System Scheduler')
        `).run(
          `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          ord.id,
          `WARNING: 40% balance of GH₵ ${Number(ord.balance_due).toLocaleString()} is past the 48-hour delivery deadline.`
        );
      }
    }
    console.log(`⚠️ [SCHEDULER] Flagged ${overdueOrders.length} orders with overdue balances.`);
  }
}

export function startScheduler(intervalMs = 60000) {
  console.log(`⏰ [SCHEDULER] Background worker initialized (interval: ${intervalMs / 1000}s)`);

  // Run initial pass
  expireUnpaidCheckoutHolds();
  flagOverdueBalances();

  const timer = setInterval(() => {
    try {
      expireUnpaidCheckoutHolds();
      flagOverdueBalances();
    } catch (err) {
      console.error('❌ [SCHEDULER] Error during scheduled pass:', err.message);
    }
  }, intervalMs);

  return timer;
}

// Standalone CLI execution
if (process.argv[1] && process.argv[1].includes('scheduler.js')) {
  console.log('🚀 Running standalone scheduler daemon...');
  startScheduler(30000); // 30s checks
}
