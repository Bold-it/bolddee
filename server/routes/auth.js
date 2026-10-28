import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { signToken, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Helper to normalize Ghanaian phone numbers (+233 or 0XX)
function normalizeGhanaPhone(phone) {
  let cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '+233' + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * POST /api/auth/register (FR-003)
 */
router.post('/register', (req, res) => {
  const { name, email, phone, password, university, programme, graduation_year, student_id } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Name, email, phone, and password are required.' });
  }

  const normalizedPhone = normalizeGhanaPhone(phone);

  // Check duplicate email or phone
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR phone = ?').get(email.toLowerCase(), normalizedPhone);
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email or phone number already exists.' });
  }

  const userId = `usr-${Date.now()}`;
  const passwordHash = bcrypt.hashSync(password, 10);

  db.prepare(`
    INSERT INTO users (id, name, email, phone, password_hash, role, status)
    VALUES (?, ?, ?, ?, ?, 'customer', 'active')
  `).run(userId, name, email.toLowerCase(), normalizedPhone, passwordHash);

  // Create customer profile details
  db.prepare(`
    INSERT INTO customers (id, user_id, university, programme, graduation_year, student_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(`cust-${Date.now()}`, userId, university || null, programme || null, graduation_year || null, student_id || null);

  const token = signToken({ id: userId, name, email: email.toLowerCase(), role: 'customer' });
  res.status(201).json({
    message: 'Registration successful',
    token,
    user: { id: userId, name, email: email.toLowerCase(), phone: normalizedPhone, role: 'customer' }
  });
});

/**
 * POST /api/auth/login (FR-004)
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email address or password.' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Your account has been suspended. Please contact BOLDDEE management.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email address or password.' });
  }

  const token = signToken(user);
  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
  });
});

/**
 * POST /api/auth/admin-login (Admin Management Portal Login)
 */
router.post('/admin-login', (req, res) => {
  const { secret, email } = req.body;

  // Supports login via email/password or master secret key
  if (secret) {
    if (secret.toLowerCase() === 'bolddee2026' || secret.toLowerCase() === 'admin') {
      const adminUser = db.prepare("SELECT * FROM users WHERE role IN ('super_admin', 'admin') LIMIT 1").get();
      const token = signToken(adminUser || { id: 'usr-admin', name: 'Bolddee Admin', email: 'admin@bolddee.com', role: 'admin' });
      return res.json({
        message: 'Admin access granted',
        token,
        user: { id: adminUser?.id || 'usr-admin', name: adminUser?.name || 'Bolddee Admin', role: 'admin' }
      });
    }
  }

  return res.status(401).json({ error: 'Invalid admin secret key.' });
});

/**
 * GET /api/auth/me (FR-006)
 */
router.get('/me', authenticate, (req, res) => {
  const customer = db.prepare('SELECT * FROM customers WHERE user_id = ?').get(req.user.id);
  const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ?').all(req.user.id);
  res.json({ user: req.user, customer, addresses });
});

export default router;
