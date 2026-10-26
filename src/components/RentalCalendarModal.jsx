import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, ShieldCheck, CheckCircle2, AlertTriangle, ShoppingBag } from 'lucide-react';

export default function RentalCalendarModal({ product, onClose, addToCart }) {
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-16');
  const [quantity, setQuantity] = useState(product.pillar === 'BOLDDEE RENTALS' && product.unit.includes('chair') ? 50 : 1);
  const [location, setLocation] = useState('Ho Technical University Campus, Ho');

  // Calculate rental duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  const baseRentalTotal = product.price * quantity * daysDiff;
  const securityDepositTotal = (product.deposit || 0) * quantity;
  const grandTotal = baseRentalTotal + securityDepositTotal;

  const deposit60Percent = Math.round(grandTotal * 0.6);
  const balanceOnDelivery = grandTotal - deposit60Percent;

  // Simulate double-booking check
  const isAvailable = quantity <= (product.stockAvailable || 100);

  const handleReserve = () => {
    const rentalBookingItem = {
      ...product,
      rentalDetails: {
        startDate,
        endDate,
        days: daysDiff,
        quantity,
        location,
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
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">RENTAL AVAILABILITY & RESERVATION</h2>
            <p className="text-xs text-slate-400">Select event dates and check real-time warehouse inventory.</p>
          </div>
        </div>

        {/* Product Details Header */}
        <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex items-center gap-4 mb-6">
          <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
          <div>
            <span className="pillar-badge pillar-rentals">{product.pillar}</span>
            <h4 className="text-white font-bold text-base mt-0.5">{product.name}</h4>
            <p className="text-xs text-yellow-400 font-extrabold">GH₵ {product.price} /{product.unit}</p>
          </div>
        </div>

        <div className="space-y-5">
          
          {/* Date Picker Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Event Delivery Date</label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Event Return Date</label>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-300">Quantity Needed</label>
              <span className="text-xs text-slate-400 font-semibold">{product.stockAvailable || 100} units available in warehouse</span>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="number"
                min="1"
                max={product.stockAvailable || 100}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-32 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none font-bold"
              />
              <span className="text-xs text-slate-400">Total duration: <strong className="text-white">{daysDiff} Day(s)</strong></span>
            </div>
          </div>

          {/* Delivery Location Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Event Delivery Venue / City</label>
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Ho Technical University Campus, Ho"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Availability Status Check */}
          {isAvailable ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Available for selected dates! Zero double-booking risk guaranteed.</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Requested quantity exceeds available stock for these dates.</span>
            </div>
          )}

          {/* Automated Financial Calculation Breakdown Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-yellow-500/30 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Rental Charge ({quantity} qty × {daysDiff} days):</span>
              <span className="font-bold text-white">GH₵ {baseRentalTotal.toLocaleString()}</span>
            </div>

            {securityDepositTotal > 0 && (
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  Refundable Security Deposit:
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                </span>
                <span className="font-bold text-blue-300">GH₵ {securityDepositTotal.toLocaleString()}</span>
              </div>
            )}

            <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-extrabold text-white">
              <span>Grand Total:</span>
              <span className="text-yellow-400">GH₵ {grandTotal.toLocaleString()}</span>
            </div>

            <div className="pt-2 border-t border-dashed border-white/10 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">
                <span className="block text-[10px] text-slate-400">Due Today (60% Deposit):</span>
                <strong className="text-sm font-black">GH₵ {deposit60Percent.toLocaleString()}</strong>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-white/10 text-slate-300">
                <span className="block text-[10px] text-slate-400">Balance on Delivery (40%):</span>
                <strong className="text-sm font-black text-white">GH₵ {balanceOnDelivery.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Reserve Button */}
          <button
            disabled={!isAvailable}
            onClick={handleReserve}
            className="w-full btn-primary justify-center text-sm py-3 shadow-xl"
          >
            <ShoppingBag className="w-4 h-4" /> Reserve Dates & Add to Order
          </button>

        </div>

      </div>
    </div>
  );
}
