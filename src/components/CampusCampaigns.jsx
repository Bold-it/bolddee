import React from 'react';
import { Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { CAMPAIGNS } from '../data/mockData';

export default function CampusCampaigns({ openBulkOrder }) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-yellow-400 mb-2">
          <Award className="w-4 h-4" /> Campus Specific Drives & Ambassador Referral Program
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white">UNIVERSITY GRADUATION CAMPAIGNS</h2>
        <p className="text-slate-400 text-sm mt-2">
          Special discounted class packages for Ghanaian tertiary institutions including Ho Technical University (HTU), 
          University of Ghana (UG Legon), and KNUST.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {CAMPAIGNS.map((campaign) => (
          <div 
            key={campaign.id}
            className="glass-panel rounded-2xl border border-yellow-500/30 overflow-hidden relative group hover:border-yellow-400 transition-all shadow-xl"
          >
            <div className="h-48 relative overflow-hidden">
              <img src={campaign.banner} alt={campaign.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="pillar-badge pillar-grad">{campaign.institution}</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-black text-white">{campaign.name}</h3>
                <p className="text-xs text-yellow-400 font-bold mt-1">Special Offer: {campaign.discount}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Drive Date Window:</span>
                  <span className="font-bold text-white">{campaign.dateRange}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Official Ambassador Referral Code:</span>
                  <span className="font-mono font-bold text-yellow-400">{campaign.ambassadorCode}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Enrolled Graduating Students:</span>
                  <span className="font-bold text-emerald-400">{campaign.activeStudents} Graduates</span>
                </div>
              </div>

              <button
                onClick={openBulkOrder}
                className="w-full btn-primary justify-center text-xs py-3"
              >
                Join Campus Bulk Order Drive <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
