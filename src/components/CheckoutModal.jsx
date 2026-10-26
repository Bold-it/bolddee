import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Phone, MapPin, Smartphone, ArrowRight, Copy, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutModal({ cartItems, onClose, clearCart, setRecentOrder }) {
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState('Kwame Mensah');
  const [email, setEmail] = useState('kwame.mensah@gmail.com');
  const [phone, setPhone] = useState('+233 24 987 6543');
  const [paymentMethod, setPaymentMethod] = useState('MTN Mobile Money');
  const [momoNumber, setMomoNumber] = useState('0249876543');
  const [address, setAddress] = useState('Ho Technical University Campus, Ho');
  const [ambassadorCode, setAmbassadorCode] = useState('BOLDDEE/HTU2027/MOSES');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Financial calculations
  const rawSubtotal = cartItems.reduce((acc, item) => {
    if (item.rentalDetails) return acc + item.rentalDetails.grandTotal;
    if (item.price) return acc + item.price;
    return acc;
  }, 0);

  // Delivery calculation based on location (FR-016 SRS baseline)
  const deliveryFee = 50; 
  const grandTotal = rawSubtotal + deliveryFee;

  // 60% Booking Deposit rule (FR-023)
  const requiredDeposit60 = Math.round(grandTotal * 0.6);
  const balanceOnDelivery = grandTotal - requiredDeposit60;

  const handlePayAndConfirm = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const orderId = 'BD-' + Math.floor(1000 + Math.random() * 9000);
      const newOrderObj = {
        id: orderId,
        customerName,
        email,
        phone,
        items: cartItems.map(i => i.name).join(', '),
        totalAmount: grandTotal,
        depositPaid: requiredDeposit60,
        balanceDue: balanceOnDelivery,
        paymentStatus: '60% Deposit Paid (MTN MoMo)',
        orderStatus: 'Confirmed & Processing',
        deliveryDate: '2026-10-15',
        deliveryLocation: address,
        datePlaced: new Date().toLocaleDateString()
      };

      setCompletedOrder(newOrderObj);
      setRecentOrder(newOrderObj);
      clearCart();
      setStep(3);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    }, 1800);
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

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">CHECKOUT & DELIVERY DETAILS</h2>
                <p className="text-xs text-slate-400">Step 1 of 2: Customer information & Delivery venue.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number (MoMo / WhatsApp)</label>
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Delivery Venue / GPS Digital Address</label>
                <input 
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Ho Technical University Campus, Ho"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Campus Ambassador Referral Code (Optional)</label>
                <input 
                  type="text"
                  value={ambassadorCode}
                  onChange={(e) => setAmbassadorCode(e.target.value)}
                  placeholder="e.g. BOLDDEE/HTU2027/MOSES"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-yellow-300 focus:border-yellow-500 focus:outline-none font-mono text-xs"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full btn-primary justify-center text-sm py-3 shadow-xl"
            >
              Continue to Payment Method <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">MOBILE MONEY & DIGITAL PAYMENT</h2>
                <p className="text-xs text-slate-400">Step 2 of 2: Authorize 60% booking deposit.</p>
              </div>
            </div>

            {/* Payment Options */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Select Payment Provider</label>
              <div className="grid grid-cols-3 gap-3">
                {['MTN Mobile Money', 'Telecel Cash', 'Visa / Mastercard'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-colors ${
                      paymentMethod === method
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                        : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod.includes('Money') && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Wallet Number</label>
                <input 
                  type="text"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none font-mono"
                />
              </div>
            )}

            {/* Financial Breakdown Summary Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-yellow-500/30 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Items Subtotal:</span>
                <span className="font-bold text-white">GH₵ {rawSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Logistics & Delivery Fee:</span>
                <span className="font-bold text-white">GH₵ {deliveryFee}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-black text-white">
                <span>Total Order Value:</span>
                <span className="text-yellow-400">GH₵ {grandTotal.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-dashed border-white/10 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Required 60% Booking Deposit Today:</span>
                  <span className="text-lg font-black text-yellow-400">GH₵ {requiredDeposit60.toLocaleString()}</span>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <span>Balance (40%) on Delivery:</span>
                  <span className="block font-bold text-white text-xs">GH₵ {balanceOnDelivery.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary text-xs"
              >
                Back
              </button>
              <button
                disabled={isProcessing}
                onClick={handlePayAndConfirm}
                className="flex-1 btn-primary justify-center text-sm py-3 shadow-xl"
              >
                {isProcessing ? 'Processing MoMo Prompt...' : `Pay GH₵ ${requiredDeposit60.toLocaleString()} Deposit Now`}
              </button>
            </div>
          </div>
        )}

        {step === 3 && completedOrder && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="pillar-badge pillar-grad">ORDER CONFIRMED</span>
              <h2 className="text-3xl font-black text-white mt-2">THANK YOU FOR YOUR ORDER!</h2>
              <p className="text-xs text-slate-300">
                Your deposit has been successfully received. We make your moments worthwhile!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Tracking Reference:</span>
                <span className="font-extrabold text-yellow-400 font-mono text-sm">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer Name:</span>
                <span className="font-bold text-white">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deposit Paid (60%):</span>
                <span className="font-bold text-emerald-400">GH₵ {completedOrder.depositPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Balance Due on Delivery:</span>
                <span className="font-bold text-white">GH₵ {completedOrder.balanceDue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Venue:</span>
                <span className="font-semibold text-slate-300">{completedOrder.deliveryLocation}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button 
                onClick={onClose}
                className="btn-secondary text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
