import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, ShieldCheck, MapPin, Package, AlertCircle } from 'lucide-react';
import { MOCK_ORDERS } from '../data/mockData';

export default function OrderTrackerModal({ recentOrder }) {
  const [searchId, setSearchId] = useState(recentOrder ? recentOrder.id : 'BD-9402');
  const [foundOrder, setFoundOrder] = useState(
    recentOrder || MOCK_ORDERS.find(o => o.id === searchId) || MOCK_ORDERS[0]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const result = MOCK_ORDERS.find(o => o.id.toUpperCase() === searchId.toUpperCase()) || recentOrder;
    if (result) {
      setFoundOrder(result);
    }
  };

  const steps = [
    { title: 'Order Placed & Deposit Paid', done: true, date: 'Sep 24, 2026' },
    { title: 'Design & Artwork Approved', done: foundOrder?.designApproved || true, date: 'Sep 25, 2026' },
    { title: 'Inventory Asset Tagged', done: true, date: 'Sep 26, 2026' },
    { title: 'Out For Delivery / Dispatch', done: foundOrder?.orderStatus?.includes('Delivery'), date: 'Oct 15, 2026' },
    { title: 'Delivered & Rental Inspected', done: false, date: 'Oct 16, 2026' }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-2">
          <Truck className="w-4 h-4" /> Live Operational Order Tracking
        </div>
        <h2 className="text-3xl font-black text-white">TRACK YOUR ORDER & RENTAL BOOKING</h2>
        <p className="text-slate-400 text-xs mt-1">Enter your BOLDDEE Order Tracking Code (e.g. BD-9402)</p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Order ID (e.g. BD-9402)"
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono uppercase focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <button 
          type="submit"
          className="btn-primary text-xs"
        >
          Track Now
        </button>
      </form>

      {/* Order Status Display Box */}
      {foundOrder ? (
        <div className="glass-panel p-6 rounded-2xl border border-yellow-500/30 space-y-6">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Order ID</span>
              <h3 className="text-2xl font-black text-yellow-400 font-mono">{foundOrder.id}</h3>
              <p className="text-xs text-slate-300 font-medium">{foundOrder.items}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="pillar-badge pillar-grad">{foundOrder.paymentStatus}</span>
              <div className="text-xs text-slate-400 mt-1">
                Target Delivery: <strong className="text-white">{foundOrder.deliveryDate}</strong>
              </div>
            </div>
          </div>

          {/* Location & Customer Info */}
          <div className="grid sm:grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-white/5">
            <div>
              <span className="text-slate-400 block font-semibold">Customer:</span>
              <span className="text-white font-bold">{foundOrder.customerName} ({foundOrder.phone})</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Delivery Venue:</span>
              <span className="text-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-yellow-400" /> {foundOrder.deliveryLocation}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Milestone Progress Timeline</h4>
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 relative z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    step.done 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                      : 'bg-slate-800 text-slate-400 border border-white/10'
                  }`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className={`text-sm font-bold ${step.done ? 'text-white' : 'text-slate-500'}`}>
                      {step.title}
                    </h5>
                    <p className="text-[11px] text-slate-400">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-12 glass-panel rounded-2xl">
          <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-slate-300 font-bold">No order found matching "{searchId}".</p>
          <p className="text-xs text-slate-400 mt-1">Please double check your reference code.</p>
        </div>
      )}

    </section>
  );
}
