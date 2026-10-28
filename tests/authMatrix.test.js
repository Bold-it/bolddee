/**
 * BOLDDEE RENTALS — AUTHORISATION MATRIX TEST SUITE
 * Conforms to SRS §8 RBAC, Phase 3 Security, and Authorisation Matrix
 * 
 * Verifies role permissions across all 8 roles:
 * - Super Admin, Admin, Operations Manager, Sales Officer,
 *   Finance Officer, Inventory Officer, Content Manager, Customer
 */

import assert from 'assert';
import { db } from '../server/db/database.js';
import { signToken } from '../server/middleware/auth.js';

const API_URL = 'http://localhost:5000/api';

async function testAuthMatrix() {
  console.log('\n================================================================');
  console.log('🛡️ RUNNING RBAC & AUTHORISATION MATRIX TEST SUITE');
  console.log('================================================================\n');

  // Setup test users for all 8 roles in the database
  const roleUsers = [
    { id: 'usr-mat-superadmin', role: 'super_admin', name: 'Matrix SuperAdmin', email: 'mat-superadmin@bolddee.com' },
    { id: 'usr-mat-admin', role: 'admin', name: 'Matrix Admin', email: 'mat-admin@bolddee.com' },
    { id: 'usr-mat-ops', role: 'operations_manager', name: 'Matrix Ops', email: 'mat-ops@bolddee.com' },
    { id: 'usr-mat-sales', role: 'sales_officer', name: 'Matrix Sales', email: 'mat-sales@bolddee.com' },
    { id: 'usr-mat-finance', role: 'finance_officer', name: 'Matrix Finance', email: 'mat-finance@bolddee.com' },
    { id: 'usr-mat-inventory', role: 'inventory_officer', name: 'Matrix Inventory', email: 'mat-inv@bolddee.com' },
    { id: 'usr-mat-content', role: 'content_manager', name: 'Matrix Content', email: 'mat-content@bolddee.com' },
    { id: 'usr-mat-customer', role: 'customer', name: 'Matrix Customer', email: 'mat-cust@bolddee.com' }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, phone, password_hash, role, status)
    VALUES (?, ?, ?, '0240000000', 'hash', ?, 'active')
    ON CONFLICT(id) DO UPDATE SET role = excluded.role, status = 'active'
  `);

  for (const u of roleUsers) {
    insertUser.run(u.id, u.name, u.email, u.role);
  }

  let passed = 0;
  let failed = 0;

  async function checkRoute(endpoint, method, role, expectedAllowed) {
    const user = roleUsers.find(u => u.role === role);
    const token = signToken(user);

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const allowed = res.status !== 403 && res.status !== 401;

      if (allowed === expectedAllowed) {
        console.log(`  ✅ [${role.toUpperCase()}] ${method} ${endpoint} -> ${res.status} (Expected: ${expectedAllowed ? 'ALLOWED' : 'FORBIDDEN'})`);
        passed++;
      } else {
        console.error(`  ❌ [${role.toUpperCase()}] ${method} ${endpoint} -> ${res.status} (FAILED: Expected ${expectedAllowed ? 'ALLOWED' : 'FORBIDDEN'})`);
        failed++;
      }
    } catch (err) {
      console.error(`  ❌ Connection error on ${endpoint}:`, err.message);
      failed++;
    }
  }

  // 1. Dashboard KPI Access (super_admin, admin, operations_manager, finance_officer ALLOWED; others FORBIDDEN)
  console.log('📊 [MATRIX 1] Dashboard KPI Access (/api/admin/dashboard)');
  await checkRoute('/admin/dashboard', 'GET', 'super_admin', true);
  await checkRoute('/admin/dashboard', 'GET', 'admin', true);
  await checkRoute('/admin/dashboard', 'GET', 'operations_manager', true);
  await checkRoute('/admin/dashboard', 'GET', 'finance_officer', true);
  await checkRoute('/admin/dashboard', 'GET', 'content_manager', false);
  await checkRoute('/admin/dashboard', 'GET', 'customer', false);

  // 2. SRS Explicit Example: "Finance Officer can view payments but cannot delete products"
  console.log('\n🗑️ [MATRIX 2] Product Deletion Permission (/api/products/:id)');
  await checkRoute('/products/test-prod-del', 'DELETE', 'super_admin', true);
  await checkRoute('/products/test-prod-del', 'DELETE', 'admin', true);
  await checkRoute('/products/test-prod-del', 'DELETE', 'finance_officer', false); // MUST BE FORBIDDEN
  await checkRoute('/products/test-prod-del', 'DELETE', 'customer', false);

  // 3. Customer Management & Suspension (/api/admin/customers)
  console.log('\n👥 [MATRIX 3] Customer CRM Access (/api/admin/customers)');
  await checkRoute('/admin/customers', 'GET', 'super_admin', true);
  await checkRoute('/admin/customers', 'GET', 'admin', true);
  await checkRoute('/admin/customers', 'GET', 'sales_officer', true);
  await checkRoute('/admin/customers', 'GET', 'customer', false);

  // 4. Quotations Access (/api/quotes)
  console.log('\n📝 [MATRIX 4] Quotations List Access (/api/quotes)');
  await checkRoute('/quotes', 'GET', 'super_admin', true);
  await checkRoute('/quotes', 'GET', 'sales_officer', true);
  await checkRoute('/quotes', 'GET', 'customer', false);

  // Clean up test users
  db.prepare("DELETE FROM users WHERE id LIKE 'usr-mat-%'").run();

  console.log('\n================================================================');
  console.log(`📊 AUTHORISATION MATRIX RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

testAuthMatrix().catch((err) => {
  console.error('Fatal auth matrix error:', err);
  process.exit(1);
});
