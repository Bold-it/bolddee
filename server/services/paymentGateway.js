import crypto from 'crypto';
import { db, runTransaction } from '../db/database.js';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || 'sk_test_bolddee_sandbox_secret';

/**
 * Initialize a Ghana digital payment session (MoMo / Card).
 * Conforms to SRS FR-022, FR-023, BR-002, NFR-005.
 */
export async function initializePayment({ orderId, amount, email, phone, paymentMethod, isBalancePayment = false }) {
  const reference = `BD-TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Record pending payment in database
  db.prepare(`
    INSERT INTO payments (id, order_id, reference, amount, method, status, provider)
    VALUES (?, ?, ?, ?, ?, 'Pending', 'Paystack-Ghana')
  `).run(
    `pay-${Date.now()}`,
    orderId,
    reference,
    amount,
    paymentMethod || 'MTN Mobile Money'
  );

  // In live production with API key: make request to https://api.paystack.co/transaction/initialize
  // Otherwise return sandbox simulation checkout
  return {
    status: true,
    message: 'Payment initialized successfully',
    data: {
      authorization_url: `/checkout/pay?ref=${reference}&orderId=${orderId}`,
      access_code: `acc_${reference}`,
      reference,
      amount,
      currency: 'GHS',
      channel: paymentMethod
    }
  };
}

/**
 * Confirms payment and updates order state idempotently (BR-002, BR-009).
 */
export function verifyAndConfirmPayment(reference, providerMetadata = {}) {
  return runTransaction(() => {
    const payment = db.prepare('SELECT * FROM payments WHERE reference = ?').get(reference);
    if (!payment) {
      throw new Error(`Payment reference ${reference} not found`);
    }

    if (payment.status === 'Paid') {
      return { alreadyConfirmed: true, orderId: payment.order_id };
    }

    // 1. Mark payment as Paid
    db.prepare(`
      UPDATE payments
      SET status = 'Paid', paid_at = CURRENT_TIMESTAMP, metadata = ?
      WHERE reference = ?
    `).run(JSON.stringify(providerMetadata), reference);

    // 2. Fetch Order
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(payment.order_id);
    if (!order) {
      throw new Error(`Order ${payment.order_id} not found`);
    }

    const newDepositPaid = (order.deposit_paid || 0) + payment.amount;
    const newBalanceDue = Math.max(0, order.total_amount - newDepositPaid);
    const isFullyPaid = newBalanceDue <= 0.01;

    const newPaymentStatus = isFullyPaid ? 'Paid Full' : 'Deposit Paid';
    const newOrderStatus = 'Payment Confirmed';

    // 3. Update Order Status
    db.prepare(`
      UPDATE orders
      SET deposit_paid = ?, balance_due = ?, payment_status = ?, order_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newDepositPaid, newBalanceDue, newPaymentStatus, newOrderStatus, order.id);

    // 4. Upgrade rental reservation holds to Confirmed 'Reserved' status (BR-009)
    db.prepare(`
      UPDATE rental_reservations
      SET status = 'Reserved', hold_expires_at = NULL
      WHERE order_id = ?
    `).run(order.id);

    // 5. Append Order Activity History (§21)
    db.prepare(`
      INSERT INTO order_events (id, order_id, event_type, description, actor_name)
      VALUES (?, ?, 'payment_confirmed', ?, 'Payment Gateway')
    `).run(
      `evt-${Date.now()}`,
      order.id,
      `Payment of GH₵ ${payment.amount.toLocaleString()} received via ${payment.method} (Ref: ${reference}). Status: ${newPaymentStatus}.`
    );

    return { success: true, orderId: order.id, orderNumber: order.order_number, newPaymentStatus };
  });
}

/**
 * Validates incoming Paystack webhook HMAC SHA512 signature.
 */
export function verifyWebhookSignature(rawBody, signatureHeader) {
  if (!signatureHeader) return false;
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET).update(rawBody).digest('hex');
  return hash === signatureHeader;
}
