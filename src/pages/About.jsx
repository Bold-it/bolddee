import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Truck, Users, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen py-16 px-4 bg-[#051a10]">
      <div className="container mx-auto max-w-5xl space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
            About BOLDDEE RENTALS & APPAREL
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            We Make Your Moments Worthwhile.
          </h1>
          <p className="text-emerald-200/80 text-sm md:text-base leading-relaxed">
            Founded with a vision to deliver unmatched elegance to Ghana’s academic, social, and corporate celebrations,
            BOLDDEE RENTALS combines premium event infrastructure with bespoke graduation craftsmanship.
          </p>
        </div>

        {/* Four Pillars Matrix (§2) */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white">Our Four Core Pillars of Service</h2>
            <p className="text-xs text-emerald-300/70 mt-1">Engineered to provide a complete, stress-free celebration experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border border-emerald-900/60 space-y-3">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">Pillar 1</span>
              <h3 className="text-xl font-bold text-white">BOLDDEE GRAD</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Ghana’s premier graduation apparel studio. We hand-weave and machine-embroider high-density bridal satin
                stoles, institutional sashes, medals, custom gowns, and caps for universities, nursing colleges, and polytechnics nationwide.
              </p>
            </div>

            <div className="glass-panel p-6 border border-emerald-900/60 space-y-3">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">Pillar 2</span>
              <h3 className="text-xl font-bold text-white">BOLDDEE RENTALS</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                High-capacity, weatherproof event infrastructure. Heavy-duty aluminum marquee canopies, gold Chiavari chairs,
                banquet tables, PA sound reinforcement, mobile stages, and red-carpet installations delivered and assembled on site.
              </p>
            </div>

            <div className="glass-panel p-6 border border-emerald-900/60 space-y-3">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">Pillar 3</span>
              <h3 className="text-xl font-bold text-white">BOLDDEE MOMENTS</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Capturing unforgettable milestones. Professional studio and on-campus graduation portraits, 360-degree video booths,
                and instant photobook printing preserving memory-rich celebrations.
              </p>
            </div>

            <div className="glass-panel p-6 border border-emerald-900/60 space-y-3">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">Pillar 4</span>
              <h3 className="text-xl font-bold text-white">BOLDDEE EVENTS</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Full-spectrum event coordination and floral styling. From intimate bridal dinners to 2,000-seat academic matriculations,
                we handle site planning, ambient lighting, backdrop decor, and on-the-day technical management.
              </p>
            </div>
          </div>
        </div>

        {/* Operational Hubs */}
        <div className="glass-panel p-8 border border-amber-400/30 rounded-2xl bg-gradient-to-r from-[#0d3b24] to-[#082215]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-black text-white mb-3">Our Operations & Distribution Network</h3>
              <p className="text-xs md:text-sm text-emerald-200/90 leading-relaxed mb-4">
                Operating primarily out of the Volta Region and Greater Accra, BOLDDEE maintains synchronized
                dispatch hubs in Ho (near Ho Technical University & UHAS campuses) and Accra to provide swift logistics,
                guaranteed setup buffers, and reliable field support.
              </p>
              <div className="space-y-2 text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Main Hub: Ho Technical University Campus & Central Warehouse, Ho, Volta Region</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Greater Accra Dispatch Hub: Serving Legon, UPSA, Central Accra & Tema</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-[#051a10] p-6 rounded-xl border border-emerald-800/60">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">The BOLDDEE Guarantee</h4>
              <ul className="space-y-2 text-xs text-emerald-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% On-Time Delivery with 24-Hour Setup Buffers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No Double-Booking: Synchronized ACID Real-Time Holds</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Refundable Rental Security Deposits Returned Promptly</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Official Registration: Bold-Services & Bull-Dee Enterprises</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-black text-white">Ready to Plan Your Next Ceremony?</h3>
          <div className="flex justify-center gap-4">
            <Link to="/shop" className="btn-gold text-sm py-3 px-8 shadow-xl">
              Explore Our Catalog
            </Link>
            <Link to="/contact" className="btn-secondary text-sm py-3 px-8">
              Speak with an Event Specialist
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
