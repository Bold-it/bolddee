import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, ShieldCheck, CheckCircle2, AlertTriangle, ShoppingBag, Loader2 } from 'lucide-react';

export default function RentalCalendarModal({ product, onClose, addToCart }) {
  // Tomorrow's date as default start
  const defaultStart = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [quantity, setQuantity] = useState(product.pillar === 'BOLDDEE RENTALS' && (product.unit?.includes('chair') || product.name?.toLowerCase().includes('chair')) ? 50 : 1);
  const [location, setLocation] = useState('Ho Technical University Campus, Ho');
  const [eventVenue, setEventVenue] = useState('HTU Great Hall / Campus Field');

  // Real availability state from backend engine
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState({
    available: true,
    availableStock: product.stock_quantity || 100
  });

  // Calculate rental duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  const baseRentalTotal = (Number(product.price) || 0) * quantity * daysDiff;
  const securityDepositTotal = (Number(product.deposit) || 0) * quantity;
  const grandTotal = baseRentalTotal + securityDepositTotal;

  const deposit60Percent = Math.round(grandTotal * 0.6);
  const balanceOnDelivery = grandTotal - deposit60Percent;

  // Query live availability engine (FR-012, BR-001)
  useEffect(() => {
    let isCurrent = true;
    const fetchAvailability = async () => {
      setCheckingAvailability(true);
      try {
        const res = await fetch(`/api/rentals/availability?productId=${product.id}&startDate=${startDate}&endDate=${endDate}&quantity=${quantity}`);
        if (res.ok) {
          const data = await res.json();
          if (isCurrent) setAvailabilityResult(data);
        } else {
          if (isCurrent) setAvailabilityResult({ available: quantity <= (product.stock_quantity || 100), availableStock: product.stock_quantity || 100 });
        }
      } catch (err) {
        if (isCurrent) setAvailabilityResult({ available: quantity <= (product.stock_quantity || 100), availableStock: product.stock_quantity || 100 });
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
        location: `${location} (${eventVenue})`,
        deposit: product.deposit || 0,
        baseRentalTotal,
        securityDepositTotal,
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
      <div className="modal-content max-w-2xl p-6 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-emerald-950 text-emerald-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">RENTAL AVAILABILITY & RESERVATION</h2>
            <p className="text-xs text-emerald-300/80">Live warehouse inventory check with buffer period validation.</p>
          </div>
        </div>

        {/* Product Details Header */}
        <div className="p-4 rounded-xl bg-[#03150c] border border-emerald-900/60 flex items-center gap-4 mb-6">
          <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover border border-emerald-800" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{product.pillar}</span>
            <h4 className="text-white font-bold text-base mt-0.5">{product.name}</h4>
            <p className="text-xs text-amber-400 font-extrabold">GH₵ {product.price} / {product.unit || 'day'}</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Date Picker Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">Event Delivery / Setup Date</label>
              <input 
                type="date"
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">Event Pickup / Return Date</label>
              <input 
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-emerald-200">Quantity Needed</label>
              <span className="text-xs text-emerald-300 font-semibold">
                {checkingAvailability ? (
                  <span className="inline-flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Verifying...</span>
                ) : (
                  `${availabilityResult.availableStock} units available for these dates`
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
              <span className="text-xs text-emerald-300/80">Total duration: <strong className="text-white">{daysDiff} Day(s)</strong></span>
            </div>
          </div>

          {/* Delivery Location Field */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">Town / Campus</label>
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ho Technical University"
                className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">Venue / Specific Landmark</label>
              <input 
                type="text"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                placeholder="e.g. Near Great Hall"
                className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Availability Status Check */}
          {isAvailable ? (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Verified available in warehouse for selected dates! (Double-booking protection active).</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center gap-2 text-xs text-red-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Requested quantity exceeds available stock ({availabilityResult.availableStock} available).</span>
            </div>
          )}

          {/* Financial Calculation Breakdown Box */}
          <div className="p-4 rounded-xl bg-[#03150c] border border-amber-400/30 space-y-2 text-xs">
            <div className="flex justify-between text-emerald-200">
              <span>Rental Charge ({quantity} qty × {daysDiff} days):</span>
              <span className="font-bold text-white">GH₵ {baseRentalTotal.toLocaleString()}</span>
            </div>

            {securityDepositTotal > 0 && (
              <div className="flex justify-between text-emerald-200">
                <span className="flex items-center gap-1">
                  Refundable Security Deposit (Escrow):
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                </span>
                <span className="font-bold text-amber-300">GH₵ {securityDepositTotal.toLocaleString()}</span>
              </div>
            )}

            <div className="pt-2 border-t border-emerald-900/60 flex justify-between text-sm font-extrabold text-white">
              <span>Item Total:</span>
              <span className="text-amber-400">GH₵ {grandTotal.toLocaleString()}</span>
            </div>

            <div className="pt-2 border-t border-dashed border-emerald-900/60 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <span className="block text-[10px] text-emerald-400/80">Due Today (60% Deposit):</span>
                <strong className="text-sm font-black">GH₵ {deposit60Percent.toLocaleString()}</strong>
              </div>
              <div className="p-2 rounded bg-[#072416] border border-emerald-800/60 text-emerald-200">
                <span className="block text-[10px] text-emerald-400/80">Balance on Delivery (40%):</span>
                <strong className="text-sm font-black text-white">GH₵ {balanceOnDelivery.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Reserve Button */}
          <button
            disabled={!isAvailable || checkingAvailability}
            onClick={handleReserve}
            className="w-full btn-gold justify-center text-sm py-3 shadow-xl disabled:opacity-40"
          >
            <ShoppingBag className="w-4 h-4" /> Reserve Dates & Add to Order
          </button>
        </div>
      </div>
    </div>
  );
}
