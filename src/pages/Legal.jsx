import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Legal = () => {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' | 'rental' | 'privacy' | 'refund'

  return (
    <div className="min-h-screen py-16 px-4 bg-[#051a10]">
      <div className="container mx-auto max-w-5xl space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
            Legal & Regulatory Conformity
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white">
            Terms, Privacy & Rental Policies
          </h1>
          <p className="text-emerald-200/80 text-sm md:text-base">
            Conforming with the Laws of Ghana, the Data Protection Act, 2012 (Act 843), and commercial fair-trading standards.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-emerald-900/60 pb-4">
          <button
            onClick={() => setActiveTab('terms')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'terms'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('rental')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'rental'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            Rental Agreement & Buffers
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'privacy'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            Privacy Policy (Act 843)
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'refund'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            Refund & Cancellation Policy
          </button>
        </div>

        {/* Content Box */}
        <div className="glass-panel p-8 md:p-10 border border-emerald-900/60 rounded-2xl text-emerald-100 text-sm leading-relaxed space-y-6">
          
          {/* TAB 1: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="border-b border-emerald-900/60 pb-4">
                <h2 className="text-2xl font-bold text-white">General Terms of Service</h2>
                <p className="text-xs text-amber-400 mt-1">Effective Date: October 2026 • Bold-Services & Bull-Dee Enterprises</p>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">1. Scope of Agreement</h3>
                <p>
                  These Terms govern the purchase of graduation merchandise (stoles, sashes, medals, gowns) and the rental
                  of event infrastructure (canopies, chairs, sound systems, staging) provided by BOLDDEE RENTALS across the Republic of Ghana.
                  By completing an order or checking the agreement box at checkout, you enter into a legally binding contract.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">2. Pricing, Deposits & Integer Currency</h3>
                <p>
                  All catalog prices are stated in Ghana Cedis (GH₵). Transactions are settled in integer Ghanaian pesewas
                  through verified payment gateways (Paystack / Mobile Money). A 60% booking deposit is mandatory to lock in equipment
                  holds, with the 40% balance due no later than 48 hours before scheduled delivery.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">3. Custom Artwork & Design Gate (BR-003)</h3>
                <p>
                  For personalized graduation sashes and bespoke signage, BOLDDEE prepares a visual artwork proof. Physical production
                  or embroidery does not commence until the customer confirms proof approval via digital or WhatsApp channels. Customer-approved
                  proofs containing typographical errors provided by the client are exempt from full remanufacture refunds.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: RENTAL AGREEMENT */}
          {activeTab === 'rental' && (
            <div className="space-y-6">
              <div className="border-b border-emerald-900/60 pb-4">
                <h2 className="text-2xl font-bold text-white">Rental Equipment Terms & Buffer Policies</h2>
                <p className="text-xs text-amber-400 mt-1">Asset Care, Buffer Periods & Damage Liability</p>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">1. Buffer Periods (BR-001)</h3>
                <p>
                  To protect event timelines, BOLDDEE enforces a mandatory 1-day setup buffer prior to your event start date,
                  and a 1-day pickup/cleaning buffer following event conclusion. No equipment may be reserved by third parties during these buffer windows.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">2. Security Deposits & Inspection Protocol (BR-006, BR-007)</h3>
                <p>
                  Every rental order requires a refundable security deposit. Upon equipment retrieval or return, an authorized BOLDDEE
                  logistics officer conducts a physical check. Deductions are assessed solely for broken chair frames, burns, torn canvas,
                  or unreturned items at replacement cost. Undamaged equipment deposits are returned in full within 24 hours.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">3. Venue Access & Ground Clearance</h3>
                <p>
                  The hirer must ensure unhindered vehicular access to the event premises in Ho, Accra, or designated towns. BOLDDEE
                  is not liable for setup delays caused by restricted venue access, locked gates, or unauthorized site personnel.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-emerald-900/60 pb-4">
                <h2 className="text-2xl font-bold text-white">Privacy Notice & Data Protection</h2>
                <p className="text-xs text-amber-400 mt-1">Compliance with Data Protection Act, 2012 (Act 843)</p>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">1. Principles of Data Collection</h3>
                <p>
                  BOLDDEE RENTALS acts as a responsible Data Controller under Act 843. We collect personal identifiable information
                  (Full Name, WhatsApp Phone Number, Email, Delivery Venue, University, and Index Numbers for Bulk Orders) solely
                  for the lawful execution of event rentals, embroidery production, and delivery coordination.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">2. Payment Security</h3>
                <p>
                  We do not store customer debit card numbers, PINs, or Mobile Money wallets on our servers. All financial transactions
                  are handled directly via PCI-DSS certified Ghanaian payment processors (Paystack Ghana) using TLS 1.3 encryption.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">3. Data Subject Rights</h3>
                <p>
                  In accordance with Sections 35–43 of Act 843, customers possess the right to request access to, correction of,
                  or deletion of their stored customer record by writing to <strong>bolddeerentals@gmail.com</strong>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 4: REFUND & CANCELLATION */}
          {activeTab === 'refund' && (
            <div className="space-y-6">
              <div className="border-b border-emerald-900/60 pb-4">
                <h2 className="text-2xl font-bold text-white">Refund & Cancellation Policy</h2>
                <p className="text-xs text-amber-400 mt-1">Conforming with Business Rule BR-005</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#051a10] p-4 rounded-xl border border-emerald-800/60">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">14+ Days Notice</span>
                  <strong className="text-white text-base">Full Refund (Less 10%)</strong>
                  <p className="text-xs text-slate-300 mt-1">10% administrative processing fee deducted; balance returned.</p>
                </div>

                <div className="bg-[#051a10] p-4 rounded-xl border border-emerald-800/60">
                  <span className="text-xs font-bold text-amber-400 block mb-1">7 to 13 Days Notice</span>
                  <strong className="text-white text-base">50% Deposit Refund</strong>
                  <p className="text-xs text-slate-300 mt-1">Equipment reserved and removed from catalog circulation.</p>
                </div>

                <div className="bg-[#051a10] p-4 rounded-xl border border-emerald-800/60">
                  <span className="text-xs font-bold text-rose-400 block mb-1">Under 7 Days Notice</span>
                  <strong className="text-white text-base">Non-Refundable</strong>
                  <p className="text-xs text-slate-300 mt-1">Logistics, transport, and crew scheduling already committed.</p>
                </div>
              </div>

              <section className="space-y-2 pt-2">
                <h3 className="text-base font-bold text-white">Force Majeure & Inclement Weather</h3>
                <p>
                  In cases of severe national emergencies or campus closure directives from university governing councils,
                  orders may be rescheduled within 6 months at zero penalty fee.
                </p>
              </section>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Legal;
