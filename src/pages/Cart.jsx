import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  CreditCard,
  FileText,
  ShieldCheck,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart = ({ onOpenCheckoutModal, onOpenQuoteModal }) => {
  const { items, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const itemsList = items
      .map((item) => {
        let details = '';
        if (item.customization) {
          details = ` [Sash: ${item.customization.university || 'General'} - ${item.customization.graduateName || 'Custom'}]`;
        } else if (item.rentalDetails) {
          details = ` [Rental: ${item.rentalDetails.days || 1} day(s) from ${item.rentalDetails.startDate || 'TBD'}]`;
        }
        const unitPrice = item.rentalDetails?.grandTotal || item.price;
        return `• ${item.name}${details} — GH₵${Number(unitPrice).toLocaleString()} x ${item.quantity}`;
      })
      .join('\n');

    const message = `*NEW ORDER / BOOKING REQUEST — BOLDDEE RENTALS*\n\nItems Requested:\n${itemsList}\n\n*Total Amount:* GH₵${total.toLocaleString()}\n\nHello, I would like to place this order. Please confirm delivery/rental schedule and payment details!`;

    const whatsappUrl = `https://wa.me/233546996210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-[#051a10]">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-black text-white">Your Cart is Empty</h1>
          <p className="text-sm text-emerald-200/70">
            You haven't added any event equipment, canopies, or graduation sashes yet.
          </p>
          <Link to="/shop">
            <button className="btn-gold text-base py-3 px-8 shadow-md">
              Browse Store Catalog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-[#051a10]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-900/60">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white">Shopping Cart</h1>
            <p className="text-xs text-emerald-300/80 mt-1">
              Review your rental booking and apparel selections
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-400 hover:text-red-300 font-semibold underline"
          >
            Clear All Items
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemPrice = item.rentalDetails?.grandTotal || item.price;
              const lineTotal = Number(itemPrice) * item.quantity;
              const cartKey = item.cartKey || item.id;

              return (
                <div
                  key={cartKey}
                  className="glass-panel p-4 md:p-5 border border-emerald-900/60 flex flex-col sm:flex-row gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.image || item.image_urls?.[0] || '/images/custom_sash.jpg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl bg-[#082215] shrink-0 border border-emerald-800/40"
                      onError={(e) => {
                        e.currentTarget.src = '/images/rental_equipment.jpg';
                      }}
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        {item.pillar || item.category || 'BOLDDEE'}
                      </span>
                      <h3 className="font-bold text-white text-base leading-tight">
                        {item.name}
                      </h3>

                      {/* Customization Details */}
                      {item.customization && (
                        <div className="text-xs text-amber-300/90 bg-amber-950/40 px-2 py-1 rounded inline-block">
                          <span className="font-semibold">Sash: </span>
                          {item.customization.university || 'General'} • {item.customization.graduateName || 'Custom'} ({item.customization.year || '2027'})
                        </div>
                      )}

                      {/* Rental Details */}
                      {item.rentalDetails && (
                        <div className="text-xs text-cyan-300/90 bg-cyan-950/40 px-2 py-1 rounded inline-block">
                          <span className="font-semibold">Rental: </span>
                          {item.rentalDetails.days || 1} day(s) • Dep: GH₵{item.rentalDetails.securityDeposit || 0}
                        </div>
                      )}

                      <p className="text-xs text-emerald-300/70">
                        Unit Price: GH₵{Number(itemPrice).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-emerald-900/60">
                    <div className="flex items-center space-x-2 border border-emerald-800/80 rounded-lg p-1 bg-[#072416]">
                      <button
                        onClick={() => updateQuantity(cartKey, item.quantity - 1)}
                        className="p-1.5 text-emerald-300 hover:text-white rounded hover:bg-emerald-800"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(cartKey, item.quantity + 1)}
                        className="p-1.5 text-emerald-300 hover:text-white rounded hover:bg-emerald-800"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-amber-400">
                        GH₵{lineTotal.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(cartKey)}
                      className="p-2 text-red-400 hover:text-red-300 rounded hover:bg-red-950/40"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Order Summary (matches FAM'S layout) */}
          <div>
            <div className="glass-panel p-6 border border-emerald-900/60 sticky top-28 space-y-5">
              <h2 className="text-xl font-bold text-white pb-3 border-b border-emerald-900/60">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-emerald-200/80">
                  <span>Total Items</span>
                  <span className="font-bold text-white">{itemCount} units</span>
                </div>
                <div className="flex justify-between text-emerald-200/80">
                  <span>Delivery Estimate</span>
                  <span className="text-xs text-amber-400 font-semibold">Calculated at Checkout</span>
                </div>
                <div className="border-t border-emerald-900/60 pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold text-white">Grand Total</span>
                    <span className="text-2xl font-black text-amber-400">
                      GH₵{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full btn-gold text-base py-3.5 flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Checkout via WhatsApp</span>
                </button>

                {onOpenCheckoutModal && (
                  <button
                    onClick={onOpenCheckoutModal}
                    className="w-full btn-emerald text-sm py-3 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Pay Online with MoMo / Card</span>
                  </button>
                )}

                {onOpenQuoteModal && (
                  <button
                    onClick={onOpenQuoteModal}
                    className="w-full btn-secondary text-xs py-2.5 flex items-center justify-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-amber-400" />
                    <span>Generate Official Quote PDF</span>
                  </button>
                )}
              </div>

              <div className="pt-2 text-center text-xs text-emerald-300/60 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Instant dispatch & order tracking provided</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
