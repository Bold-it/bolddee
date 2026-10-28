import React, { useState, useEffect } from 'react';
import { Search, Truck, CheckCircle2, Clock, ShieldCheck, MapPin, Package, AlertCircle, Calendar, RefreshCw } from 'lucide-react';

export default function OrderTrackerModal({ recentOrder }) {
  const [searchId, setSearchId] = useState(recentOrder?.orderNumber || recentOrder?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const fetchOrder = async (query) => {
    if (!query || !query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to locate order');
      }
      setOrderData(data);
    } catch (err) {
      setError(err.message);
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recentOrder?.orderNumber || recentOrder?.id) {
      const query = recentOrder.orderNumber || recentOrder.id;
      setSearchId(query);
      fetchOrder(query);
    }
  }, [recentOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(searchId);
  };

  // Map order status to steps
  const getTimelineSteps = (order, timeline = []) => {
    const isPaid = order.payment_status === 'Paid' || order.payment_status === 'Deposit Paid';
    const isDispatched = ['Dispatched', 'Out for Delivery', 'Delivered', 'Completed'].includes(order.order_status);
    const isDelivered = ['Delivered', 'Completed'].includes(order.order_status);
    const isCompleted = order.order_status === 'Completed';

    return [
      {
        title: 'Order Placed & Hold Registered',
        done: true,
        date: order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Active',
        detail: `Order #${order.order_number} initialized`
      },
      {
        title: 'Deposit Payment Confirmed',
        done: isPaid,
        date: isPaid ? 'Verified' : 'Pending Payment',
        detail: isPaid ? `Deposit: GH₵ ${Number(order.deposit_paid || 0).toLocaleString()}` : `Balance/Deposit Due: GH₵ ${Number(order.balance_due || order.total_amount).toLocaleString()}`
      },
      {
        title: 'Design Approval & Asset Tagging',
        done: ['Approved', 'In Production', 'Dispatched', 'Delivered', 'Completed'].includes(order.order_status) || isPaid,
        date: 'Warehouse Ops',
        detail: 'Branding & equipment reservation'
      },
      {
        title: 'Out For Delivery / Dispatch',
        done: isDispatched,
        date: order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'Scheduled',
        detail: `Zone: ${order.delivery_zone} (${order.delivery_location})`
      },
      {
        title: 'Delivered & Post-Rental Inspection',
        done: isCompleted,
        date: isCompleted ? 'Completed' : 'Pending Return',
        detail: 'Damage verification & deposit refund'
      }
    ];
  };

  return (
    <section className="py-6 px-2 sm:px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-2">
          <Truck className="w-4 h-4" /> Live Operational Order Tracking
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">TRACK YOUR ORDER & RENTAL BOOKING</h2>
        <p className="text-slate-400 text-xs mt-1">Enter your BOLDDEE Order Reference (e.g. BD-2026-00001) or phone number</p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Order Code or Phone"
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono uppercase focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="btn-primary text-xs flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Track Now'}
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 glass-panel rounded-2xl">
          <RefreshCw className="w-8 h-8 text-yellow-400 animate-spin mx-auto mb-2" />
          <p className="text-slate-300 font-bold">Querying live warehouse database...</p>
        </div>
      )}

      {/* Error / Not Found */}
      {!loading && error && (
        <div className="text-center py-12 glass-panel rounded-2xl border border-red-500/20">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <p className="text-slate-200 font-bold">{error}</p>
          <p className="text-xs text-slate-400 mt-1">Please confirm your reference number from your SMS or checkout confirmation.</p>
        </div>
      )}

      {/* Order Status Display Box */}
      {!loading && orderData && (
        <div className="glass-panel p-6 rounded-2xl border border-yellow-500/30 space-y-6">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Official Order Reference</span>
              <h3 className="text-2xl font-black text-yellow-400 font-mono">{orderData.order.order_number}</h3>
              <p className="text-xs text-slate-300 font-medium mt-1">
                Status: <span className="text-emerald-400 font-bold">{orderData.order.order_status}</span> • Payment: <span className="text-amber-400 font-bold">{orderData.order.payment_status}</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block">Total Amount</span>
              <span className="text-xl font-black text-white">GH₵ {Number(orderData.order.total_amount).toLocaleString()}</span>
              {orderData.order.balance_due > 0 && (
                <div className="text-xs text-rose-400 mt-1 font-semibold">
                  Balance Due: GH₵ {Number(orderData.order.balance_due).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Location & Customer Info */}
          <div className="grid sm:grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-white/5">
            <div>
              <span className="text-slate-400 block font-semibold mb-1">Customer & Contact:</span>
              <span className="text-white font-bold block">{orderData.order.customer_name}</span>
              <span className="text-slate-300">{orderData.order.phone} • {orderData.order.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold mb-1">Delivery Destination:</span>
              <span className="text-slate-200 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" /> 
                {orderData.order.delivery_location} ({orderData.order.delivery_zone})
              </span>
              {orderData.order.delivery_date && (
                <span className="text-slate-400 flex items-center gap-1 mt-1 text-[11px]">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  Target Delivery: {new Date(orderData.order.delivery_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Items breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Order Items ({orderData.items.length})</h4>
            <div className="space-y-2">
              {orderData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs bg-slate-900/60 p-3 rounded-lg border border-white/5">
                  <div>
                    <span className="text-white font-bold">{item.item_name}</span>
                    <span className="text-slate-400 ml-2">× {item.quantity}</span>
                    {item.is_rental === 1 && (
                      <span className="ml-2 text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded font-bold">Rental</span>
                    )}
                  </div>
                  <span className="text-yellow-400 font-mono font-bold">GH₵ {Number(item.unit_price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Deposit Note */}
          {orderData.securityDeposit && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-emerald-300">Rental Security Deposit: GH₵ {Number(orderData.securityDeposit.total_deposit).toLocaleString()}</span>
                <p className="text-slate-300 text-[11px] mt-0.5">Status: <strong className="text-white">{orderData.securityDeposit.status}</strong>. Fully refundable post-event after inspection.</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Milestone Progress Timeline</h4>
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
              {getTimelineSteps(orderData.order, orderData.timeline).map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 relative z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    step.done 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                      : 'bg-slate-800 text-slate-400 border border-white/10'
                  }`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className={`text-sm font-bold ${step.done ? 'text-white' : 'text-slate-500'}`}>
                        {step.title}
                      </h5>
                      <span className="text-[11px] text-slate-400 font-mono">{step.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Log */}
          {orderData.timeline && orderData.timeline.length > 0 && (
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Audit Log Updates</h4>
              <div className="space-y-1.5 text-[11px] text-slate-400">
                {orderData.timeline.map((evt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-slate-500 font-mono">[{new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                    <span className="text-slate-300 font-medium">{evt.actor_name}:</span>
                    <span>{evt.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial state if no search performed yet */}
      {!loading && !error && !orderData && (
        <div className="text-center py-12 glass-panel rounded-2xl border border-white/5">
          <Truck className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-300 font-medium">Enter your Order Reference code above to view live dispatch & milestone status.</p>
        </div>
      )}
    </section>
  );
}
