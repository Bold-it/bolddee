import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CreditCard, Palette, Truck, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Select Equipment & Pick Dates',
      icon: Calendar,
      description: 'Choose your desired marquee canopies, Chiavari chairs, or graduation apparel. Our live calendar checks real-time warehouse inventory so you are never double-booked.'
    },
    {
      step: '02',
      title: 'Pay 60% Booking Deposit',
      icon: CreditCard,
      description: 'Lock in your equipment and dates immediately by paying an initial 60% deposit via MTN MoMo, Telecel Cash, or Card. The remaining 40% balance is settled 48 hours prior to dispatch.'
    },
    {
      step: '03',
      title: 'Artwork & Embroidery Proof Gate',
      icon: Palette,
      description: 'For customized graduation sashes and branded backdrops, our design team produces an exact visual draft. Physical embroidery begins only after you approve the digital proof.'
    },
    {
      step: '04',
      title: '24-Hour Setup & Delivery Buffer',
      icon: Truck,
      description: 'To guarantee peace of mind, we enforce a 1-day setup buffer before your ceremony starts. Our crew delivers, positions, and installs tents and seating early.'
    },
    {
      step: '05',
      title: 'Return Inspection & Deposit Refund',
      icon: ShieldCheck,
      description: 'Following the event, our crew conducts an on-site equipment inventory inspection. Your refundable rental security deposit is promptly released to your Mobile Money account.'
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 bg-[#051a10]">
      <div className="container mx-auto max-w-5xl space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
            Operational Blueprint & Customer Workflow
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            How BOLDDEE Works
          </h1>
          <p className="text-emerald-200/80 text-sm md:text-base leading-relaxed">
            From your first click to the final graduation applause, our transparent 5-step operational
            process ensures punctual delivery, professional setup, and zero surprise fees.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="glass-panel p-6 border border-emerald-900/60 rounded-2xl relative space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-amber-400/40 font-mono">{s.step}</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-xs text-emerald-200/80 leading-relaxed">{s.description}</p>
              </div>
            );
          })}

          {/* Guarantee Card */}
          <div className="glass-panel p-6 border border-amber-400/30 rounded-2xl bg-gradient-to-br from-amber-400/10 to-transparent flex flex-col justify-center space-y-3">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider">The BOLDDEE Promise</span>
            <h3 className="text-lg font-bold text-white">Guaranteed Availability</h3>
            <p className="text-xs text-emerald-200/80">
              Every confirmed order holds reserved physical asset IDs in our warehouse. Double booking is mathematically prevented by our transactional booking engine.
            </p>
            <Link to="/shop" className="btn-gold text-xs py-2 px-4 inline-block text-center mt-2">
              Start Booking Now
            </Link>
          </div>
        </div>

        {/* Financial Policy Overview */}
        <div className="glass-panel p-8 border border-emerald-900/60 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Payment Terms & Cancellation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-emerald-200/90 leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-bold text-amber-400 text-sm">Deposit Policy</h4>
              <p>A 60% deposit is required at checkout to confirm bookings and initiate sash personalization. Unpaid checkout holds expire automatically after 30 minutes.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-amber-400 text-sm">Balance Settlement</h4>
              <p>The remaining 40% balance must be settled at least 48 hours before scheduled delivery. Reminders are dispatched automatically via WhatsApp.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-amber-400 text-sm">Security Deposits</h4>
              <p>Rental equipment orders include a refundable security deposit. Returned items in good condition receive instant deposit refunds within 24 hours.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;
