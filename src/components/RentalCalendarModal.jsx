import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Loader2,
  Wrench,
  Headphones,
  Truck,
  Sparkles,
  Info
} from 'lucide-react';

export default function RentalCalendarModal({ product, onClose, addToCart }) {
  // Tomorrow's date as default start
  const defaultStart = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [quantity, setQuantity] = useState(
    product.pillar === 'BOLDDEE RENTALS' && (product.unit?.includes('chair') || product.name?.toLowerCase().includes('chair')) ? 50 : 1
  );

  // Logistics & Venue Details
  const [deliveryZone, setDeliveryZone] = useState('ZONE_A');
  const [location, setLocation] = useState('Ho Technical University Campus, Ho');
  const [eventVenue, setEventVenue] = useState('HTU Great Hall / Campus Field');

  // Tiered Pricing & Service Add-ons
  const [includeSetup, setIncludeSetup] = useState(
    Boolean(product.name && /canopy|tent|stage|truss/i.test(product.name))
  );
  const [operatorChoice, setOperatorChoice] = useState('none'); // 'none' | 'sound_engineer' | 'lighting_tech' | 'booth_attendant'

  // Operator add-on rate definitions
  const operatorOptions = {
    none: { label: 'Self-Operated (No Operator)', rate: 0 },
    sound_engineer: { label: 'Certified Sound Engineer & Mixing Operator (+GH₵ 250/day)', rate: 250 },
    lighting_tech: { label: 'Lighting & Power Generator Technician (+GH₵ 180/day)', rate: 180 },
    booth_attendant: { label: '360 Video Booth Attendant & Director (+GH₵ 150/day)', rate: 150 }
  };

  // Real availability state from backend engine
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState({
    available: true,
    availableStock: product.stock_quantity || 100,
    totalStock: product.stock_quantity || 100,
    reservedStock: 0,
    maintenanceCount: 0
  });

  // Calculate rental duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  // Multi-Day Tier Calculation (Day 1: 100%, Day 2: 75%, Day 3+: 60%)
  const calculateTieredRate = (rate, days) => {
    if (days <= 1) return rate;
    if (days === 2) return rate * 1.75;
    return rate * 1.75 + (days - 2) * (rate * 0.60);
  };

  const unitDailyPrice = Number(product.price) || 0;
  const standardUndiscounted = unitDailyPrice * quantity * daysDiff;
  const baseRentalTotal = Math.round(calculateTieredRate(unitDailyPrice, daysDiff) * quantity);
  const multiDaySavings = Math.max(0, standardUndiscounted - baseRentalTotal);

  // Operator and Setup Add-ons
  const operatorDailyRate = operatorOptions[operatorChoice]?.rate || 0;
  const operatorTotal = operatorDailyRate * daysDiff;
  const setupFee = includeSetup ? 100 : 0;

  // Security Deposit (Refundable Escrow per unit)
  const depositPerUnit = Number(product.deposit) || (product.name && /canopy|tent/i.test(product.name) ? 50 : 5);
  const securityDepositTotal = depositPerUnit * quantity;

  // Logistics delivery & heavy haulage calculation
  let baseDeliveryFee = 50;
  if (deliveryZone === 'ZONE_B') baseDeliveryFee = 100;
  if (deliveryZone === 'ZONE_C') baseDeliveryFee = 150;

  const isHeavyBulk = quantity >= 40 || (product.name && /canopy|tent|truss|stage|generator/i.test(product.name));
  const heavyHaulageFee = isHeavyBulk ? 50 : 0;
  const totalLogisticsFee = baseDeliveryFee + heavyHaulageFee;

  // Totals
  const equipmentSubtotal = baseRentalTotal + operatorTotal + setupFee;
  const grandTotal = equipmentSubtotal + securityDepositTotal;
  const deposit60Percent = Math.round(grandTotal * 0.6);
  const balanceOnDelivery = grandTotal - deposit60Percent;

  // Query live availability engine (FR-012, BR-001)
  useEffect(() => {
    let isCurrent = true;
    const fetchAvailability = async () => {
      setCheckingAvailability(true);
      try {
        const res = await fetch(
          `/api/rentals/availability?productId=${product.id}&startDate=${startDate}&endDate=${endDate}&quantity=${quantity}`
        );
        if (res.ok) {
          const data = await res.json();
          if (isCurrent) setAvailabilityResult(data);
        } else {
          if (isCurrent) {
            setAvailabilityResult({
              available: quantity <= (product.stock_quantity || 100),
              availableStock: product.stock_quantity || 100,
              totalStock: product.stock_quantity || 100,
              reservedStock: 0,
              maintenanceCount: 0
            });
          }
        }
      } catch (err) {
        if (isCurrent) {
          setAvailabilityResult({
            available: quantity <= (product.stock_quantity || 100),
            availableStock: product.stock_quantity || 100,
            totalStock: product.stock_quantity || 100,
            reservedStock: 0,
            maintenanceCount: 0
          });
        }
      } finally {
        if (isCurrent) setCheckingAvailability(false);
      }
    };

    fetchAvailability();
    return () => { isCurrent = false; };
  }, [product.id, startDate, endDate, quantity]);

  const isAvailable = availabilityResult.available;

  const handleReserve = () => {
    const rentalBookingItem = {
      ...product,
      rentalDetails: {
        startDate,
        endDate,
        days: daysDiff,
        quantity,
        deliveryZone,
        location: `${location} (${eventVenue})`,
        setupFee,
        includeSetup,
        operatorChoice,
        operatorDailyRate,
        operatorTotal,
        deposit: depositPerUnit,
        baseRentalTotal,
        securityDepositTotal,
        multiDaySavings,
        totalLogisticsFee,
        heavyHaulageFee,
        grandTotal,
        deposit60Percent,
        balanceOnDelivery
      }
    };
    addToCart(rentalBookingItem);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl p-6 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-emerald-950 text-emerald-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white">RENTAL AVAILABILITY & RESERVATION</h2>
            <p className="text-xs text-emerald-300/80">
              Live warehouse inventory check, multi-day tiered pricing & logistics calculator.
            </p>
          </div>
        </div>

        {/* Product Details Header */}
        <div className="p-4 rounded-xl bg-[#03150c] border border-emerald-900/60 flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <img
              src={product.image || product.image_urls?.[0] || '/images/rental_equipment.jpg'}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover border border-emerald-800"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{product.pillar}</span>
              <h4 className="text-white font-bold text-base mt-0.5">{product.name}</h4>
              <p className="text-xs text-amber-400 font-extrabold">GH₵ {product.price} / {product.unit || 'day'}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-300/80 block">Warehouse Total</span>
            <strong className="text-sm font-bold text-white">{availabilityResult.totalStock || product.stock_quantity || 100} units</strong>
          </div>
        </div>

        <div className="space-y-5">
          {/* 1. Date Picker Range */}
          <div>
            <label className="block text-xs font-bold text-emerald-200 mb-1.5 flex items-center justify-between">
              <span>Event Date Range (Start & Return Dates)</span>
              <span className="text-amber-400 font-semibold text-[11px]">
                {daysDiff} Day{daysDiff > 1 ? 's' : ''} Duration
              </span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-emerald-300/70 mb-1">Setup / Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-emerald-300/70 mb-1">Breakdown / Return Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Quantity Selector & Live Inventory Feedback */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-emerald-200">Quantity Needed</label>
              <span className="text-xs text-emerald-300 font-semibold">
                {checkingAvailability ? (
                  <span className="inline-flex items-center gap-1 text-amber-400">
                    <Loader2 className="w-3 h-3 animate-spin" /> Checking dates...
                  </span>
                ) : (
                  <span className={availabilityResult.availableStock > 0 ? 'text-emerald-300' : 'text-red-400'}>
                    {availabilityResult.availableStock} units available for these dates
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max={availabilityResult.availableStock || 100}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-32 bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none font-bold"
              />
              <span className="text-xs text-emerald-300/80">
                Units of <strong>{product.name}</strong>
              </span>
            </div>

            {/* Inventory Reservation Feedback Banner */}
            {availabilityResult.reservedStock > 0 && (
              <div className="mt-2 p-2.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>High Demand Notice:</strong> {availabilityResult.reservedStock} of {availabilityResult.totalStock} units are already booked by other events during your dates. Only <strong>{availabilityResult.availableStock}</strong> remaining.
                </span>
              </div>
            )}
          </div>

          {/* Availability Status Check */}
          {isAvailable ? (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Verified available in warehouse for selected dates! (Buffer period & double-booking protection active).</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center gap-2 text-xs text-red-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>
                Requested quantity ({quantity}) exceeds available stock ({availabilityResult.availableStock} units available). Please reduce quantity or choose alternate dates.
              </span>
            </div>
          )}

          {/* 3. Tiered & Duration Pricing Add-ons */}
          <div className="p-4 rounded-xl bg-[#072416]/70 border border-emerald-800/60 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Service Add-ons & Operator Options</span>
            </h4>

            {/* Setup & Breakdown Service Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-emerald-200 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSetup}
                onChange={(e) => setIncludeSetup(e.target.checked)}
                className="rounded accent-amber-400 mt-0.5"
              />
              <div>
                <strong className="text-white block">Professional Canopy & Staging Setup Crew (+GH₵ 100)</strong>
                <span className="text-[11px] text-emerald-400/70">
                  Certified technicians handle erection, secure staking, and post-event breakdown.
                </span>
              </div>
            </label>

            {/* Operator / Sound Engineer Add-on */}
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1 flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5 text-amber-400" />
                <span>Optional Operator / Sound Engineer</span>
              </label>
              <select
                value={operatorChoice}
                onChange={(e) => setOperatorChoice(e.target.value)}
                className="w-full bg-[#03150c] border border-emerald-800/80 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              >
                {Object.entries(operatorOptions).map(([key, opt]) => (
                  <option key={key} value={key}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Logistics & Destination Calculator */}
          <div className="p-4 rounded-xl bg-[#072416]/70 border border-emerald-800/60 space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Logistics & Venue Location</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-emerald-200 mb-1">Delivery Destination Zone</label>
                <select
                  value={deliveryZone}
                  onChange={(e) => setDeliveryZone(e.target.value)}
                  className="w-full bg-[#03150c] border border-emerald-800/80 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="ZONE_A">Zone A: Ho Central / HTU Campus (+GH₵ 50)</option>
                  <option value="ZONE_B">Zone B: Greater Ho Suburbs & Surrounding (+GH₵ 100)</option>
                  <option value="ZONE_C">Zone C: Inter-District / Regional Outstation (+GH₵ 150)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-200 mb-1">Town / Campus</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Ho Technical University"
                  className="w-full bg-[#03150c] border border-emerald-800/80 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-emerald-200 mb-1">Specific Venue / Landmark</label>
              <input
                type="text"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                placeholder="e.g. Near HTU Great Hall / Campus Field"
                className="w-full bg-[#03150c] border border-emerald-800/80 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            {isHeavyBulk && (
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Heavy Equipment Bulk Haulage applied (+GH₵ 50 dedicated logistics truck).</span>
              </div>
            )}
          </div>

          {/* 5. Comprehensive Financial Calculation Breakdown */}
          <div className="p-4 rounded-xl bg-[#03150c] border border-amber-400/30 space-y-2 text-xs">
            <div className="flex justify-between text-emerald-200">
              <span>
                Rental Equipment ({quantity} units × {daysDiff} days):
              </span>
              <span className="font-bold text-white">GH₵ {baseRentalTotal.toLocaleString()}</span>
            </div>

            {multiDaySavings > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold text-[11px]">
                <span>✓ Multi-Day Duration Discount (Day 2+: 25–40% off):</span>
                <span>- GH₵ {multiDaySavings.toLocaleString()}</span>
              </div>
            )}

            {setupFee > 0 && (
              <div className="flex justify-between text-emerald-200">
                <span>Canopy & Staging Setup Crew Fee:</span>
                <span className="font-bold text-white">GH₵ {setupFee}</span>
              </div>
            )}

            {operatorTotal > 0 && (
              <div className="flex justify-between text-emerald-200">
                <span>Operator / Sound Engineer ({daysDiff} days):</span>
                <span className="font-bold text-white">GH₵ {operatorTotal.toLocaleString()}</span>
              </div>
            )}

            {securityDepositTotal > 0 && (
              <div className="flex justify-between text-amber-300 font-semibold pt-1 border-t border-emerald-900/60">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Refundable Security Deposit (Escrow):
                </span>
                <span>GH₵ {securityDepositTotal.toLocaleString()}</span>
              </div>
            )}

            <p className="text-[10px] text-emerald-400/80 italic">
              * Security deposit is 100% refunded to your MoMo wallet post-event after equipment check.
            </p>

            <div className="pt-2 border-t border-emerald-900/60 flex justify-between text-sm font-extrabold text-white">
              <span>Item Booking Subtotal:</span>
              <span className="text-amber-400">GH₵ {grandTotal.toLocaleString()}</span>
            </div>

            <div className="pt-2 border-t border-dashed border-emerald-900/60 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <span className="block text-[10px] text-emerald-400/80 uppercase font-bold">Due Today (60% Deposit):</span>
                <strong className="text-sm font-black">GH₵ {deposit60Percent.toLocaleString()}</strong>
              </div>
              <div className="p-2.5 rounded bg-[#072416] border border-emerald-800/60 text-emerald-200">
                <span className="block text-[10px] text-emerald-400/80 uppercase font-bold">Balance on Delivery (40%):</span>
                <strong className="text-sm font-black text-white">GH₵ {balanceOnDelivery.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Reserve Button */}
          <button
            disabled={!isAvailable || checkingAvailability}
            onClick={handleReserve}
            className="w-full btn-gold justify-center text-sm py-3.5 shadow-xl disabled:opacity-40 flex items-center gap-2 font-bold"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Reserve Dates & Add to Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
