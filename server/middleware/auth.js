import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bolddee_jwt_production_secret_key_2026';

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Authentication middleware checking JWT and account suspension (FR-045).
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user is still active in database
    const user = db.prepare('SELECT id, name, email, role, status FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User account no longer exists.' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Account has been suspended. Please contact management.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

/**
 * Granular Role-Based Access Control Middleware (§8).
 * Example: requireRole(['super_admin', 'admin', 'finance_officer'])
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // super_admin always has access
    if (req.user.role === 'super_admin' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      error: `Access denied. Role '${req.user.role}' is not authorized to perform this operation.`
    });
  };
}

/**
 * IDOR Protection: Checks that user is accessing their own data or is staff.
 */
export function requireSelfOrStaff(req, res, next) {
  const targetUserId = req.params.userId || req.body.userId;
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

  const isStaff = ['super_admin', 'admin', 'operations_manager', 'sales_officer'].includes(req.user.role);
  if (isStaff || req.user.id === targetUserId) {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden: You cannot access records belonging to another customer.' });
}
