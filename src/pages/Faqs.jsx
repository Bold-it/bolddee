import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Faqs = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How does the rental booking deposit and payment split work?',
      a: 'To secure your equipment reservation and date, an initial 60% booking deposit is paid at checkout via MTN Mobile Money, Telecel Cash, or Card. The remaining 40% balance is due 48 hours prior to your event delivery date.'
    },
    {
      q: 'Can I customize my graduation sash with my university crest and custom program?',
      a: 'Yes! Our BOLDDEE GRAD studio specializes in customized satin stoles. You can select your university, degree type, class year, and colors online. For custom crests and club emblems, our design team produces a digital artwork proof for your approval before physical embroidery begins.'
    },
    {
      q: 'How does BOLDDEE guarantee equipment will not be double-booked?',
      a: 'Our booking engine uses real-time transactional inventory tracking. When you pick dates on our calendar, the system checks specific asset barcodes (e.g. CHR-0001 to CHR-0100) and enforces a 1-day setup buffer before and a 1-day return buffer after every event. Once checked out, those units are physically locked.'
    },
    {
      q: 'What delivery locations and zones do you cover?',
      a: 'We operate synchronized hubs in the Volta Region and Greater Accra. Zone A covers Ho Municipal & Campus areas (GH₵ 50), Zone B covers surrounding Volta towns including Kpeve, Keta, and Sogakope (GH₵ 100), and Zone C covers Greater Accra and inter-regional destinations (GH₵ 150).'
    },
    {
      q: 'How and when is my rental security deposit refunded?',
      a: 'Rental security deposits are held as insurance against physical equipment damage or loss. Following your event, our field crew conducts a return inspection. If all items are returned clean and undamaged, 100% of the deposit is refunded to your Mobile Money account within 24 hours.'
    },
    {
      q: 'What is your cancellation and refund policy?',
      a: 'Cancellations requested 14 days or more prior to the event date receive a full refund minus a 10% administrative processing fee. Cancellations made between 7 and 13 days receive a 50% refund. Cancellations made under 7 days before event dispatch are non-refundable as equipment has already been dedicated.'
    },
    {
      q: 'How do Class Representatives submit bulk student sash orders?',
      a: 'Class reps can click "Class Bulk Orders" in the navigation bar to launch our dedicated bulk order tool. You can enter class details, upload or paste student names and index numbers, and receive a group discount with consolidated delivery.'
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 bg-[#051a10]">
      <div className="container mx-auto max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
            Got Questions? We Have Answers.
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-emerald-200/80 text-sm md:text-base">
            Everything you need to know about our rental booking engine, graduation stoles, delivery zones, and deposit returns.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass-panel border border-emerald-900/60 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-emerald-950/30 transition-colors"
                >
                  <span className="font-bold text-white text-sm md:text-base">{faq.q}</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-900/40 text-amber-400 flex items-center justify-center shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-emerald-200/90 leading-relaxed border-t border-emerald-900/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="glass-panel p-8 border border-amber-400/30 rounded-2xl text-center space-y-4 bg-gradient-to-r from-[#0d3b24] to-[#082215]">
          <h3 className="text-xl font-bold text-white">Have a Unique Requirement or Specific Question?</h3>
          <p className="text-xs text-emerald-200/80 max-w-md mx-auto">
            Our customer support specialists in Ho and Accra are available 7 days a week to assist with custom quotes and venue planning.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/233546996210"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-xs py-2.5 px-6 flex items-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Support (+233 546 996 210)
            </a>
            <Link to="/contact" className="btn-secondary text-xs py-2.5 px-6">
              View All Contact Channels
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Faqs;
