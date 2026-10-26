import React from 'react';
import { Sparkles, Calendar, ShieldCheck, ArrowRight, Award, CheckCircle2, FileSpreadsheet } from 'lucide-react';

export default function HeroSection({ openCustomizer, openRentalCalendar, openQuote, openBulkOrder }) {
  return (
    <div className="relative overflow-hidden bg-slate-950 py-12 lg:py-20 border-b border-yellow-500/20">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-yellow-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Ghana's Premier Event & Graduation Ecosystem
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              WE MAKE YOUR <br />
              <span className="gold-gradient-text">MOMENTS WORTHWHILE.</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal">
              One centralized platform for Ghanaian graduating students, event planners, and institutions. 
              Order custom embroidered stoles, rent marquee tents & gold chiavari chairs, book 4K photography, 
              and manage full event staging with guaranteed delivery.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={openCustomizer}
                className="btn-primary shadow-xl shadow-yellow-500/20"
              >
                <Sparkles className="w-4 h-4" /> Design Custom Sash
              </button>

              <button
                onClick={openRentalCalendar}
                className="btn-secondary text-blue-300 border-blue-500/30 hover:bg-blue-500/10"
              >
                <Calendar className="w-4 h-4 text-blue-400" /> Check Rental Dates
              </button>

              <button
                onClick={openBulkOrder}
                className="btn-secondary text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Bulk Class Order
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-slate-300 text-xs sm:text-sm font-medium max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>60% Deposit Booking</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Double-Booking</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>MoMo & Card Accepted</span>
              </div>
            </div>

          </div>

          {/* Hero Right Visual Feature Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-yellow-500/30 shadow-2xl shadow-yellow-500/10 bg-slate-900 group">
              <img 
                src="/images/hero_graduation.jpg" 
                alt="BOLDDEE Graduation Celebration" 
                className="w-full h-[380px] sm:h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Overlay Stat Floating Box */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-panel border border-white/15 bg-slate-950/80 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="pillar-badge pillar-grad">BOLDDEE GRAD</span>
                    <h4 className="text-white font-bold text-sm mt-1">HTU Graduation 2027 Drive</h4>
                    <p className="text-xs text-slate-400">Class of 2027 Stoles & Medals Baseline</p>
                  </div>
                  <button 
                    onClick={openQuote}
                    className="p-2 rounded-lg bg-yellow-500 text-slate-950 hover:bg-yellow-400 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stat Badge Float */}
            <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-yellow-500/40 shadow-xl text-xs text-white">
              <Award className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="font-extrabold text-sm text-yellow-400">5,000+</p>
                <p className="text-[10px] text-slate-400">Graduates Served</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
