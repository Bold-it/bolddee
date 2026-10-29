import { db } from '../db/database.js';

/**
 * Server-side Pricing Engine for BOLDDEE RENTALS.
 * Fixes previous client-side double-multiplication bug.
 * Uses integer pesewas for financial accuracy.
 *
 * @param {Array} items - Cart items
 * @param {string} deliveryZone - 'ZONE_A', 'ZONE_B', 'ZONE_C'
 * @param {string} couponCode - Optional coupon code
 * @returns {object} Financial breakdown with exact pesewas and display values
 */
/**
 * Calculates tiered duration pricing for multi-day rentals.
 * Day 1: 100%
 * Day 2: 75% (25% off)
 * Day 3+: 60% (40% off)
 */
export function calculateTieredRentalTotal(unitPrice, days) {
  if (days <= 1) return unitPrice;
  if (days === 2) return unitPrice * 1.75;
  return unitPrice * 1.75 + (days - 2) * (unitPrice * 0.60);
}

export function calculateOrderPricing(items = [], deliveryZone = 'ZONE_A', couponCode = null) {
  let subtotalPesewas = 0;
  let securityDepositPesewas = 0;
  let setupFeePesewas = 0;
  let hasHeavyBulk = false;

  // 1. Process each item from database truth (never trusting client prices)
  const processedItems = items.map((item) => {
    const product = db.prepare('SELECT id, name, price, is_rental, deposit, pillar FROM products WHERE id = ?').get(item.product_id || item.id);
    const unitPrice = product ? product.price : (Number(item.price) || 0);
    const quantity = Math.max(1, parseInt(item.quantity) || 1);

    let itemTotalPesewas = 0;
    let itemDepositPesewas = 0;

    if (item.is_rental || item.rentalDetails) {
      const details = item.rentalDetails || {};
      const startDate = new Date(details.startDate || Date.now());
      const endDate = new Date(details.endDate || Date.now());
      const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));

      // Multi-day rental calculation: standard is unitPrice * quantity * days;
      // or calculateTieredRentalTotal if tieredPricing is specifically enabled
      const equipmentTotal = details.tieredPricing
        ? calculateTieredRentalTotal(unitPrice, days) * quantity
        : unitPrice * quantity * days;

      // Optional Operator / Engineer Add-on per day
      const operatorDailyRate = Number(details.operatorDailyRate || 0);
      const operatorTotal = operatorDailyRate * days;

      // Setup and teardown fee
      const itemSetupFee = Number(details.setupFee || 0);
      setupFeePesewas += Math.round(itemSetupFee * 100);

      itemTotalPesewas = Math.round((equipmentTotal + operatorTotal) * 100);

      const depositPerUnit = (product?.deposit || details.deposit || 0);
      itemDepositPesewas = Math.round(depositPerUnit * 100) * quantity;

      // Check for heavy haulage threshold (large bulk >= 40 or explicit heavy haulage flag)
      if (quantity >= 40 || details.heavyHaulage || details.requiresHaulage) {
        hasHeavyBulk = true;
      }
    } else {
      const unitPesewas = Math.round(unitPrice * 100);
      itemTotalPesewas = unitPesewas * quantity;
    }

    subtotalPesewas += itemTotalPesewas;
    securityDepositPesewas += itemDepositPesewas;

    return {
      product_id: product?.id || item.id,
      item_name: product?.name || item.name,
      quantity,
      unit_price: unitPrice,
      total_pesewas: itemTotalPesewas,
      deposit_pesewas: itemDepositPesewas,
      customization_data: item.customization || null,
      rental_details: item.rentalDetails || null,
      is_rental: product?.is_rental || (item.rentalDetails ? 1 : 0)
    };
  });

  // 2. Logistics & Delivery Zone Fee (FR-016)
  let deliveryFeePesewas = 5000; // Default Zone A: GH₵ 50.00
  if (deliveryZone === 'ZONE_B') deliveryFeePesewas = 10000; // GH₵ 100.00
  if (deliveryZone === 'ZONE_C') deliveryFeePesewas = 15000; // GH₵ 150.00

  // Bulk / Heavy Equipment Truck Haulage Surcharge (+GH₵ 50 if heavy bulk is present)
  if (hasHeavyBulk) {
    deliveryFeePesewas += 5000;
  }

  // 3. Coupon Discount (FR-040)
  let discountPesewas = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const promo = db.prepare(`
      SELECT * FROM promotions
      WHERE UPPER(code) = UPPER(?) AND active = 1 AND (expiry_date IS NULL OR expiry_date >= DATE('now'))
    `).get(couponCode.trim());

    if (promo) {
      const subtotalCedis = subtotalPesewas / 100;
      if (subtotalCedis >= (promo.min_spend || 0)) {
        if (promo.discount_type === 'percent') {
          discountPesewas = Math.round((subtotalPesewas * promo.discount_value) / 100);
          if (promo.max_discount) {
            discountPesewas = Math.min(discountPesewas, Math.round(promo.max_discount * 100));
          }
        } else {
          discountPesewas = Math.min(subtotalPesewas, Math.round(promo.discount_value * 100));
        }
        appliedCoupon = { code: promo.code, discount_type: promo.discount_type, value: promo.discount_value };
      }
    }
  }

  // 4. Grand Total Calculation
  const grandTotalPesewas = Math.max(0, subtotalPesewas - discountPesewas + deliveryFeePesewas + setupFeePesewas + securityDepositPesewas);

  // 5. 60% Deposit vs 40% Balance Split (FR-023)
  const depositPaidPesewas = Math.round(grandTotalPesewas * 0.60);
  const balanceDuePesewas = grandTotalPesewas - depositPaidPesewas;

  return {
    subtotal: subtotalPesewas / 100,
    discount: discountPesewas / 100,
    deliveryFee: deliveryFeePesewas / 100,
    setupFee: setupFeePesewas / 100,
    securityDeposit: securityDepositPesewas / 100,
    grandTotal: grandTotalPesewas / 100,
    requiredDeposit60: depositPaidPesewas / 100,
    balanceDue: balanceDuePesewas / 100,
    appliedCoupon,
    processedItems
  };
}
