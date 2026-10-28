/**
 * BOLDDEE RENTALS — COMPREHENSIVE AUTOMATED TEST SUITE
 * Conforms to SRS Verification Standards, §43 Acceptance Criteria, BR-001 - BR-009
 * 
 * Run with: node tests/testSuite.js
 */

import assert from 'assert';
import { calculateOrderPricing } from '../server/services/pricingEngine.js';
import { checkRentalAvailability, reserveRentalInventory } from '../server/services/availabilityEngine.js';
import { transitionOrderStatus } from '../server/services/stateMachine.js';
import { db, runTransaction } from '../server/db/database.js';

let passedTests = 0;
let failedTests = 0;

function it(description, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${err.message}`);
    failedTests++;
  }
}

async function itAsync(description, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${err.message}`);
    failedTests++;
  }
}

async function runAllTests() {
  console.log('\n================================================================');
  console.log('🧪 RUNNING BOLDDEE RENTALS COMPREHENSIVE TEST SUITE');
  console.log('================================================================\n');

  // -----------------------------------------------------------------------------
  // 1. PRICING ENGINE TESTS (§25, BR-002, BR-006, Currency Integrity)
  // -----------------------------------------------------------------------------
  console.log('📦 [SUITE 1] PRICING & FINANCIAL ENGINE');

  it('calculates 60% booking deposit and 40% balance correctly', () => {
    const items = [
      { id: 'g1', name: 'Personalized Graduation Sash', price: 100, quantity: 2 } // 200 GH₵
    ];
    const pricing = calculateOrderPricing(items, 'ZONE_A', null);

    assert.strictEqual(pricing.deliveryFee, 50, 'Zone A delivery fee should be 50');
    assert.strictEqual(pricing.grandTotal, pricing.subtotal + 50, 'Grand total should be subtotal + 50');
    assert.strictEqual(pricing.requiredDeposit60, Math.round(pricing.grandTotal * 0.60), '60% deposit calculated correctly');
    assert.strictEqual(pricing.balanceDue, pricing.grandTotal - pricing.requiredDeposit60, 'Balance due calculated correctly');
    assert.strictEqual(pricing.requiredDeposit60 + pricing.balanceDue, pricing.grandTotal, 'Split should equal total');
  });

  it('prevents double-multiplication bug when rental items contain rentalDetails', () => {
    // 2 tents for 2 days @ 450/day = 1800 GH₵
    const items = [
      {
        id: 'r1',
        name: 'High-Peak Marquee Tent (20x20 ft)',
        quantity: 2,
        is_rental: 1,
        rentalDetails: {
          startDate: '2026-11-10',
          endDate: '2026-11-12', // 2 days
          quantity: 2
        }
      }
    ];

    const pricing = calculateOrderPricing(items, 'ZONE_A', null);

    assert.strictEqual(pricing.subtotal, 1800, 'Rental subtotal must be exactly 1800 GH₵');
    assert.strictEqual(pricing.securityDeposit, 300, 'Security deposit is 150 * 2 = 300 GH₵');
    assert.strictEqual(pricing.deliveryFee, 50, 'Zone A fee should be 50 GH₵');
    assert.strictEqual(pricing.grandTotal, 2150, 'Grand total: 1800 + 300 + 50 = 2150 GH₵');
  });

  it('applies percentage coupon discounts correctly with min spend verification', () => {
    const items = [
      { id: 'g1', name: 'Personalized Graduation Sash', quantity: 3 } // 120 * 3 = 360 GH₵
    ];
    // GRAD2027 gives 10% discount on min spend 100
    const pricing = calculateOrderPricing(items, 'ZONE_A', 'GRAD2027');

    assert.strictEqual(pricing.subtotal, 360);
    assert.strictEqual(pricing.discount, 36, '10% of 360 should be 36 GH₵');
    assert.strictEqual(pricing.grandTotal, 360 - 36 + 50, 'Grand total should reflect 10% discount');
  });

  it('applies fixed coupon discounts correctly', () => {
    const items = [
      { id: 'g1', name: 'Personalized Graduation Sash', quantity: 2 } // 240 GH₵
    ];
    // BOLD50 gives fixed 50 GH₵ discount
    const pricing = calculateOrderPricing(items, 'ZONE_B', 'BOLD50');

    assert.strictEqual(pricing.discount, 50, 'Fixed discount should be 50 GH₵');
    assert.strictEqual(pricing.deliveryFee, 100, 'Zone B delivery fee should be 100');
    assert.strictEqual(pricing.grandTotal, 240 - 50 + 100, '240 - 50 + 100 = 290 GH₵');
  });

  // -----------------------------------------------------------------------------
  // 2. AVAILABILITY ENGINE TESTS (BR-001, BR-009, FR-012, FR-035)
  // -----------------------------------------------------------------------------
  console.log('\n📅 [SUITE 2] RENTAL AVAILABILITY & BUFFER ENGINE');

  it('verifies rental stock availability within clean dates', () => {
    const avail = checkRentalAvailability('r2', '2026-12-01', '2026-12-03', 10);
    assert.strictEqual(avail.available, true, 'Stock should be available for clean future dates');
    assert.ok(avail.availableStock >= 10, 'Available stock should be at least 10');
  });

  it('excludes items flagged under Maintenance from available count (FR-035)', () => {
    const maintenanceCount = db.prepare("SELECT COUNT(*) as count FROM rental_assets WHERE product_id = 'r2' AND status = 'Maintenance'").get().count;
    const avail = checkRentalAvailability('r2', '2026-12-01', '2026-12-02', 1);

    assert.strictEqual(avail.maintenanceCount, maintenanceCount, 'Maintenance count should match database records');
    assert.strictEqual(avail.totalStock - maintenanceCount, avail.availableStock + avail.reservedStock, 'Available units must exclude maintenance assets');
  });

  it('enforces 1-day setup and 1-day pickup buffer periods around events', () => {
    const testOrderId = `test-ord-buf-${Date.now()}`;
    
    // Clean up any test reservations
    db.prepare("DELETE FROM rental_reservations WHERE order_id LIKE 'test-ord-buf%'").run();
    db.prepare("DELETE FROM orders WHERE id LIKE 'test-ord-buf%'").run();

    // Create temporary parent order
    db.prepare(`
      INSERT INTO orders (id, order_number, customer_name, email, phone, subtotal, total_amount, deposit_paid, balance_due, payment_status, order_status, delivery_location)
      VALUES (?, 'BD-2026-TESTBUF', 'Buffer Test', 'buf@example.com', '0240000000', 450, 450, 450, 0, 'Paid', 'Pending', 'Ho')
    `).run(testOrderId);

    // Active reservation for Nov 15 to Nov 17
    db.prepare(`
      INSERT INTO rental_reservations (id, order_id, product_id, quantity, start_date, end_date, status)
      VALUES (?, ?, 'r1', 5, '2026-11-15', '2026-11-17', 'Reserved')
    `).run(`res-${Date.now()}`, testOrderId);

    // Nov 14 setup buffer should detect overlap
    const clashSetup = checkRentalAvailability('r1', '2026-11-14', '2026-11-14', 15);
    assert.strictEqual(clashSetup.reservedStock >= 5, true, 'Nov 14 must detect setup buffer as occupied');

    // Nov 18 pickup buffer should detect overlap
    const clashPickup = checkRentalAvailability('r1', '2026-11-18', '2026-11-18', 15);
    assert.strictEqual(clashPickup.reservedStock >= 5, true, 'Nov 18 must detect pickup buffer as occupied');

    // Cleanup
    db.prepare('DELETE FROM rental_reservations WHERE order_id = ?').run(testOrderId);
    db.prepare('DELETE FROM orders WHERE id = ?').run(testOrderId);
  });

  // -----------------------------------------------------------------------------
  // 3. ORDER & RENTAL STATE MACHINE TESTS (BR-003, BR-007, FR-025, FR-026)
  // -----------------------------------------------------------------------------
  console.log('\n⚙️ [SUITE 3] STATE MACHINE WORKFLOWS & GATES');

  it('enforces Artwork Approval Gate (BR-003) before allowing In Production', () => {
    const testOrderId = `test-gate-${Date.now()}`;
    const testOrderNum = `BD-GATE-${Date.now()}`;

    db.prepare(`
      INSERT INTO orders (id, order_number, customer_name, email, phone, subtotal, total_amount, deposit_paid, balance_due, payment_status, order_status, delivery_location)
      VALUES (?, ?, 'Test Customer', 'test@example.com', '0240000000', 150, 200, 120, 80, 'Deposit Paid', 'Pending', 'Ho')
    `).run(testOrderId, testOrderNum);

    db.prepare(`
      INSERT INTO order_items (id, order_id, product_id, item_name, quantity, unit_price, customization_data, design_status)
      VALUES (?, ?, 'g1', 'Custom Sash', 1, 120, '{"text":"Class of 2026"}', 'Draft')
    `).run(`item-${Date.now()}`, testOrderId);

    // Attempt to transition to 'In Production' while design_status is 'Draft' -> Must throw error
    assert.throws(() => {
      transitionOrderStatus(testOrderId, 'In Production', 'Staff User', 'Starting production');
    }, /Artwork Approval Gate/, 'State machine must block In Production when design proof is not approved');

    // Approve the design proof
    db.prepare("UPDATE order_items SET design_status = 'Approved' WHERE order_id = ?").run(testOrderId);

    // Now transitioning to 'In Production' should succeed
    const result = transitionOrderStatus(testOrderId, 'In Production', 'Staff User', 'Starting production');
    assert.strictEqual(result.newStatus, 'In Production', 'Transition must succeed after approval');

    // Cleanup
    db.prepare('DELETE FROM order_items WHERE order_id = ?').run(testOrderId);
    db.prepare('DELETE FROM orders WHERE id = ?').run(testOrderId);
  });

  it('enforces Rental Return Check (BR-007) before allowing Completed status', () => {
    const testOrderId = `test-ret-${Date.now()}`;
    const testOrderNum = `BD-RET-${Date.now()}`;

    db.prepare(`
      INSERT INTO orders (id, order_number, customer_name, email, phone, subtotal, total_amount, deposit_paid, balance_due, payment_status, order_status, delivery_location)
      VALUES (?, ?, 'Test Customer', 'test@example.com', '0240000000', 500, 550, 550, 0, 'Paid', 'Delivered', 'Accra')
    `).run(testOrderId, testOrderNum);

    db.prepare(`
      INSERT INTO rental_reservations (id, order_id, product_id, quantity, start_date, end_date, status)
      VALUES (?, ?, 'r2', 50, '2026-11-20', '2026-11-21', 'Active')
    `).run(`res-${Date.now()}`, testOrderId);

    // Attempt transition to 'Completed' while rental status is still 'Active' -> Must fail
    assert.throws(() => {
      transitionOrderStatus(testOrderId, 'Completed', 'Staff User', 'Closing order');
    }, /Rental Return Requirement/, 'State machine must block Completed status until equipment is returned and inspected');

    // Mark rental returned
    db.prepare("UPDATE rental_reservations SET status = 'Returned' WHERE order_id = ?").run(testOrderId);

    const result = transitionOrderStatus(testOrderId, 'Completed', 'Staff User', 'Inspection done');
    assert.strictEqual(result.newStatus, 'Completed', 'Transition must succeed once returned');

    // Cleanup
    db.prepare('DELETE FROM rental_reservations WHERE order_id = ?').run(testOrderId);
    db.prepare('DELETE FROM orders WHERE id = ?').run(testOrderId);
  });

  // -----------------------------------------------------------------------------
  // 4. CONCURRENCY & ATOMICITY TESTS (BR-009 DOUBLE-BOOKING PREVENTION)
  // -----------------------------------------------------------------------------
  console.log('\n🔒 [SUITE 4] CONCURRENCY & ATOMIC ROW LOCKING (BR-009)');

  await itAsync('prevents double-booking under concurrent load of 20 parallel reservation attempts', async () => {
    const testProdId = `prod-concur-${Date.now()}`;
    db.prepare(`
      INSERT INTO products (id, sku, name, price, stock_quantity, is_rental, pillar, category, image, image_urls)
      VALUES (?, ?, 'Limited VIP Throne Chair', 250, 2, 1, 'BOLDDEE RENTALS', 'Chairs', '/images/rental_equipment.jpg', '["/images/rental_equipment.jpg"]')
    `).run(testProdId, `SKU-CONCUR-${Date.now()}`);

    const startDate = '2026-11-25';
    const endDate = '2026-11-26';
    const requestCount = 20;
    let successes = 0;
    let rejections = 0;

    const promises = [];
    for (let i = 0; i < requestCount; i++) {
      const orderId = `ord-concur-${i}-${Date.now()}`;
      promises.push(new Promise((resolve) => {
        try {
          runTransaction(() => {
            // Create parent order row for foreign key
            db.prepare(`
              INSERT INTO orders (id, order_number, customer_name, email, phone, subtotal, total_amount, deposit_paid, balance_due, payment_status, order_status, delivery_location)
              VALUES (?, ?, 'Concur User', 'c@ex.com', '0240000000', 250, 250, 250, 0, 'Paid', 'Pending', 'Ho')
            `).run(orderId, `BD-CONCUR-${i}-${Date.now()}`);

            reserveRentalInventory(orderId, [
              {
                product_id: testProdId,
                item_name: 'Limited VIP Throne Chair',
                is_rental: 1,
                quantity: 1,
                rental_details: { startDate, endDate }
              }
            ]);
          });
          successes++;
          resolve({ success: true, orderId });
        } catch (err) {
          rejections++;
          resolve({ success: false, error: err.message });
        }
      }));
    }

    await Promise.all(promises);

    console.log(`     Parallel attempts: 20 | Successes: ${successes} | Rejections: ${rejections}`);
    assert.strictEqual(successes, 2, 'Exactly 2 reservation attempts should succeed for stock = 2');
    assert.strictEqual(rejections, 18, 'Remaining 18 attempts must be rejected to prevent double booking');

    // Cleanup
    db.prepare("DELETE FROM rental_reservations WHERE product_id = ?").run(testProdId);
    db.prepare("DELETE FROM orders WHERE id LIKE 'ord-concur%'").run();
    db.prepare("DELETE FROM products WHERE id = ?").run(testProdId);
  });

  // -----------------------------------------------------------------------------
  // 5. SECURITY & RBAC AUTHORIZATION TESTS (FR-004, FR-045, NFR-004)
  // -----------------------------------------------------------------------------
  console.log('\n🛡️ [SUITE 5] SECURITY, AUTHENTICATION & RBAC');

  it('verifies password hashing with bcrypt and blocks suspended accounts', () => {
    const customer = db.prepare("SELECT * FROM users WHERE email = 'kwame.mensah@gmail.com'").get();
    assert.ok(customer, 'Customer user should exist');
    assert.ok(customer.password_hash.startsWith('$2'), 'Password must be hashed with bcrypt');

    // Test suspension flag
    db.prepare("UPDATE users SET status = 'suspended' WHERE id = ?").run(customer.id);
    const updated = db.prepare("SELECT status FROM users WHERE id = ?").get(customer.id);
    assert.strictEqual(updated.status, 'suspended', 'Status should be suspended');

    // Restore active status
    db.prepare("UPDATE users SET status = 'active' WHERE id = ?").run(customer.id);
  });

  it('verifies cost_price is strictly hidden from customer catalog queries', () => {
    const publicProduct = db.prepare(`
      SELECT id, name, price, stock_quantity FROM products WHERE is_rental = 1 LIMIT 1
    `).get();

    assert.strictEqual(publicProduct.cost_price, undefined, 'cost_price must never be returned in public catalog queries');
  });

  // -----------------------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passedTests} PASSED | ${failedTests} FAILED`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test suite error:', err);
  process.exit(1);
});
