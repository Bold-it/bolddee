import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Smartphone,
  ArrowRight,
  Copy,
  ExternalLink,
  Calendar,
  AlertCircle,
  Loader2,
  Lock,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';

export default function CheckoutModal({ cartItems, onClose, clearCart, setRecentOrder }) {
  const {
    subtotal,
    deliveryFee,
    setupFee,
    heavyHaulageFee,
    securityDeposit,
    discount,
    total,
    requiredDeposit60,
    balanceDue,
    deliveryZone,
    setDeliveryZone,
    couponCode,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState('Kwame Mensah');
  const [email, setEmail] = useState('kwame.mensah@gmail.com');
  const [phone, setPhone] = useState('+233 24 987 6543');
  const [deliveryLocation, setDeliveryLocation] = useState('Ho Technical University Campus, Ho');
  const [landmark, setLandmark] = useState('SRC Hostel Block B / Near Great Hall');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [deliveryDate, setDeliveryDate] = useState('2026-11-19');
  const [paymentMethod, setPaymentMethod] = useState('MTN Mobile Money');
  const [momoNumber, setMomoNumber] = useState('0249876543');
  const [ambassadorCode, setAmbassadorCode] = useState('BOLDDEE/HTU2027/MOSES');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [enteredCoupon, setEnteredCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const res = applyCoupon(enteredCoupon);
    if (!res.success) {
      setCouponError(res.message);
    }
  };

  const handlePayAndConfirm = async () => {
    if (!termsAccepted) {
      setApiError('You must review and accept the BOLDDEE Terms & Rental Agreement to proceed.');
      return;
    }

    setIsProcessing(true);
    setApiError('');

    try {
      // 1. Submit Order to Backend API (creates order & locks inventory transactionally)
      const orderPayload = {
        customerName,
        email,
        phone,
        deliveryLocation: `${deliveryLocation} (Landmark: ${landmark})`,
        deliveryZone,
        eventDate,
        deliveryDate,
        items: cartItems,
        couponCode: appliedCoupon?.code || null,
        ambassadorCode: ambassadorCode || null,
        paymentMethod,
        termsAccepted: true
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to submit order');
      }

      // 2. Complete payment verification via payment gateway (BR-002)
      const paymentRef = orderData.payment?.data?.reference;
      if (paymentRef) {
        await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: paymentRef })
        });
      }

      // 3. Complete order and show confirmation
      const finalOrder = {
        id: orderData.orderId,
        orderNumber: orderData.orderNumber,
        customerName,
        email,
        phone,
        totalAmount: orderData.pricing?.grandTotal || total,
        depositPaid: orderData.pricing?.requiredDeposit60 || requiredDeposit60,
        balanceDue: orderData.pricing?.balanceDue || balanceDue,
        paymentStatus: '60% Deposit Paid (Confirmed)',
        orderStatus: 'Payment Confirmed',
        deliveryDate,
        deliveryLocation,
        datePlaced: new Date().toLocaleDateString()
      };

      setCompletedOrder(finalOrder);
      if (setRecentOrder) setRecentOrder(finalOrder);
      clearCart();
      setStep(3);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setApiError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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

        {apiError && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* STEP 1: CUSTOMER & DELIVERY VENUE */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">CHECKOUT & DELIVERY DETAILS</h2>
                <p className="text-xs text-emerald-300/80">Step 1 of 2: Customer information & Delivery venue.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">Full Name *</label>
                <input 
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Phone Number (MoMo / WhatsApp) *</label>
                  <input 
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Email Address *</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Delivery / Setup Date</label>
                  <input 
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Event Celebration Date</label>
                  <input 
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery Zone Selection (FR-016) */}
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">Select Delivery Zone</label>
                <select
                  value={deliveryZone}
                  onChange={(e) => setDeliveryZone(e.target.value)}
                  className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="ZONE_A">Zone A: Ho Central / HTU Campus (+GH₵ 50)</option>
                  <option value="ZONE_B">Zone B: Greater Ho & Surrounding Towns (+GH₵ 100)</option>
                  <option value="ZONE_C">Zone C: Inter-District / Accra Outstations (+GH₵ 150)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">Specific Venue / Full Address *</label>
                <input 
                  type="text"
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Ho Technical University Campus, Ho"
                  className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">Prominent Landmark / Room No.</label>
                <input 
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near HTU Great Hall / SRC Hostel Block B"
                  className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full btn-gold justify-center text-sm py-3 shadow-xl flex items-center gap-2"
            >
              <span>Continue to Payment Method</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: PAYMENT & FINANCIAL BREAKDOWN */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">MOBILE MONEY & DIGITAL PAYMENT</h2>
                <p className="text-xs text-emerald-300/80">Step 2 of 2: Authorize 60% booking deposit (Paystack Ghana).</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-2">Select Payment Provider</label>
              <div className="grid grid-cols-3 gap-3">
                {['MTN Mobile Money', 'Telecel Cash', 'Visa / Mastercard'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      paymentMethod === method
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400'
                        : 'bg-[#072416] text-emerald-200 border-emerald-800/80 hover:text-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod.includes('Money') && (
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">MoMo Wallet Number</label>
                <input 
                  type="text"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  className="w-full bg-[#072416] border border-emerald-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>
            )}

            {/* Coupon Code Input */}
            <div className="p-3 bg-[#072416] border border-emerald-800/80 rounded-xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={enteredCoupon}
                  onChange={(e) => setEnteredCoupon(e.target.value)}
                  placeholder="Promo Code (e.g. GRAD2027 or BOLD50)"
                  className="flex-1 bg-[#03150c] border border-emerald-800 rounded-lg px-3 py-1.5 text-xs text-white uppercase focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  <span>Apply</span>
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 text-xs text-emerald-400 flex items-center justify-between">
                  <span>✓ Applied: {appliedCoupon.code} ({appliedCoupon.label})</span>
                  <button type="button" onClick={removeCoupon} className="text-red-400 hover:underline">Remove</button>
                </div>
              )}
              {couponError && <p className="mt-1 text-xs text-red-400">{couponError}</p>}
            </div>

            {/* Financial Breakdown Summary Box */}
            <div className="p-4 rounded-xl bg-[#03150c] border border-amber-400/30 space-y-2 text-xs">
              <div className="flex justify-between text-emerald-200">
                <span>Items Subtotal:</span>
                <span className="font-bold text-white">GH₵ {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>- GH₵ {discount.toLocaleString()}</span>
                </div>
              )}
              {setupFee > 0 && (
                <div className="flex justify-between text-emerald-200">
                  <span>Canopy & Staging Setup Crew Fee:</span>
                  <span className="font-bold text-white">GH₵ {setupFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-200">
                <span>Logistics & Venue Delivery ({deliveryZone}):</span>
                <span className="font-bold text-white">GH₵ {deliveryFee}</span>
              </div>
              {heavyHaulageFee > 0 && (
                <div className="flex justify-between text-cyan-300">
                  <span>Heavy Equipment Bulk Haulage (Truck):</span>
                  <span className="font-bold text-cyan-300">GH₵ {heavyHaulageFee}</span>
                </div>
              )}
              {securityDeposit > 0 && (
                <div className="pt-1 border-t border-emerald-900/60">
                  <div className="flex justify-between text-amber-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Refundable Security Deposit (Escrow):
                    </span>
                    <span>GH₵ {securityDeposit.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-emerald-400/80 mt-0.5">
                    * 100% released and credited back to your MoMo wallet within 24h post-event after inspection.
                  </p>
                </div>
              )}
              <div className="pt-2 border-t border-emerald-900/60 flex justify-between text-sm font-black text-white">
                <span>Total Order Value:</span>
                <span className="text-amber-400">GH₵ {total.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-dashed border-emerald-900/60 p-3 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-300/80 block">Required 60% Booking Deposit Today:</span>
                  <span className="text-lg font-black text-amber-400">GH₵ {requiredDeposit60.toLocaleString()}</span>
                </div>
                <div className="text-right text-[10px] text-emerald-300/80">
                  <span>Balance (40%) on Delivery:</span>
                  <span className="block font-bold text-white text-xs">GH₵ {balanceDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Terms and Rental Agreement Checkbox (FR-021, §27) */}
            <label className="flex items-start gap-2.5 text-xs text-emerald-200 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded accent-amber-400 mt-0.5"
              />
              <span>
                I agree to the <strong className="text-amber-400">Rental Terms & Conditions</strong>, 60% deposit policy, and authorize BOLDDEE RENTALS to reserve inventory for my event.
              </span>
            </label>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary text-xs"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayAndConfirm}
                className="flex-1 btn-gold justify-center text-sm py-3 shadow-xl flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Ghana MoMo Prompt...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay GH₵ {requiredDeposit60.toLocaleString()} Deposit Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER CONFIRMED */}
        {step === 3 && completedOrder && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-400 text-black uppercase tracking-wider">
                ORDER CONFIRMED
              </span>
              <h2 className="text-3xl font-black text-white mt-3">THANK YOU FOR YOUR ORDER!</h2>
              <p className="text-xs text-emerald-200/80">
                Your 60% deposit has been confirmed. We make your moments worthwhile!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#03150c] border border-emerald-900/80 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-emerald-900/60 pb-2">
                <span className="text-emerald-400/80">Sequential Order No:</span>
                <span className="font-extrabold text-amber-400 font-mono text-sm">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400/80">Customer:</span>
                <span className="font-bold text-white">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400/80">Deposit Paid (60%):</span>
                <span className="font-bold text-emerald-400">GH₵ {completedOrder.depositPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400/80">Balance Due on Delivery:</span>
                <span className="font-bold text-white">GH₵ {completedOrder.balanceDue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400/80">Venue / Destination:</span>
                <span className="font-semibold text-emerald-200">{completedOrder.deliveryLocation}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button 
                type="button"
                onClick={onClose}
                className="btn-gold text-xs px-6 py-2.5"
              >
                Close & Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
