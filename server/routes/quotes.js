import express from 'express';
import { db } from '../db/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/quotes (FR-018 - Customer Quote Request)
 */
router.post('/', (req, res) => {
  const { customerName, email, phone, organization, eventDate, budget, requirements, equipmentList } = req.body;

  if (!customerName || !phone || !requirements) {
    return res.status(400).json({ error: 'Customer name, phone, and requirements are required.' });
  }

  const quoteId = `qt-${Date.now()}`;
  const quoteNumber = `QT-${Math.floor(1000 + Math.random() * 9000)}`;
  const validUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 14 days validity

  db.prepare(`
    INSERT INTO quotes (
      id, quote_number, customer_name, email, phone, organization,
      event_date, budget, requirements, equipment_list, status, valid_until
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
  `).run(
    quoteId, quoteNumber, customerName, email || '', phone, organization || null,
    eventDate || null, parseFloat(budget) || null, requirements,
    Array.isArray(equipmentList) ? JSON.stringify(equipmentList) : (equipmentList || ''),
    validUntil
  );

  res.status(201).json({
    message: 'Quotation request submitted successfully',
    quoteId,
    quoteNumber
  });
});

/**
 * GET /api/quotes (Admin list quotes)
 */
router.get('/', authenticate, requireRole(['super_admin', 'admin', 'sales_officer']), (req, res) => {
  const quotes = db.prepare('SELECT * FROM quotes ORDER BY created_at DESC').all();
  res.json({ count: quotes.length, quotes });
});

/**
 * PUT /api/quotes/:id (Admin quote builder: line items, discount, total)
 */
router.put('/:id', authenticate, requireRole(['super_admin', 'admin', 'sales_officer']), (req, res) => {
  const { subtotal, discount, total, status, validUntil } = req.body;

  db.prepare(`
    UPDATE quotes
    SET subtotal = COALESCE(?, subtotal),
        discount = COALESCE(?, discount),
        total = COALESCE(?, total),
        status = COALESCE(?, status),
        valid_until = COALESCE(?, valid_until)
    WHERE id = ? OR quote_number = ?
  `).run(subtotal, discount, total, status, validUntil, req.params.id, req.params.id);

  res.json({ message: 'Quotation updated successfully' });
});

/**
 * POST /api/quotes/:id/accept (Customer accepts quote)
 */
router.post('/:id/accept', (req, res) => {
  const quote = db.prepare('SELECT * FROM quotes WHERE id = ? OR quote_number = ?').get(req.params.id, req.params.id);
  if (!quote) return res.status(404).json({ error: 'Quote not found' });

  if (quote.valid_until && new Date(quote.valid_until) < new Date()) {
    return res.status(400).json({ error: 'This quote has expired. Please request a new quote.' });
  }

  db.prepare("UPDATE quotes SET status = 'Accepted' WHERE id = ?").run(quote.id);
  res.json({ message: 'Quote accepted successfully. Proceed to checkout.' });
});

export default router;
