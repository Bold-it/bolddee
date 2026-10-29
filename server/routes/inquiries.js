import express from 'express';
import { db } from '../db/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/inquiries (FR-020, Contact Page Inquiry)
 */
router.post('/', (req, res) => {
  const { name, email, phone, eventDate, subject, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, phone number, and message are required.' });
  }

  const id = `inq-${Date.now()}`;
  db.prepare(`
    INSERT INTO inquiries (id, name, email, phone, event_date, subject, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'New')
  `).run(id, name, email || '', phone, eventDate || null, subject || 'General Inquiry', message);

  res.status(201).json({
    message: 'Inquiry received successfully',
    id
  });
});

/**
 * GET /api/inquiries (Admin list)
 */
router.get('/', authenticate, requireRole(['super_admin', 'admin', 'sales_officer', 'operations_manager']), (req, res) => {
  const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
  res.json({ count: inquiries.length, inquiries });
});

/**
 * PUT /api/inquiries/:id/status
 */
router.put('/:id/status', authenticate, requireRole(['super_admin', 'admin', 'sales_officer']), (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: 'Inquiry status updated' });
});

export default router;
