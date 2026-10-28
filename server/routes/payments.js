import express from 'express';
import { verifyAndConfirmPayment, verifyWebhookSignature } from '../services/paymentGateway.js';

const router = express.Router();

/**
 * POST /api/payments/verify (BR-002: Verify & confirm payment)
 */
router.post('/verify', (req, res) => {
  const { reference } = req.body;
  if (!reference) {
    return res.status(400).json({ error: 'Payment reference is required' });
  }

  try {
    const result = verifyAndConfirmPayment(reference, { verified_via: 'API Call', timestamp: new Date().toISOString() });
    res.json({
      success: true,
      message: 'Payment verified and confirmed successfully',
      result
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Payment verification failed' });
  }
});

/**
 * POST /api/payments/webhook (Paystack Webhook listener)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const rawBody = req.body ? req.body.toString() : '';

  if (!verifyWebhookSignature(rawBody, signature)) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  try {
    const event = JSON.parse(rawBody);
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      verifyAndConfirmPayment(reference, event.data);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.sendStatus(500);
  }
});

export default router;
