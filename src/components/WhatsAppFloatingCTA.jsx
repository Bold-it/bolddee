import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';

export default function WhatsAppFloatingCTA() {
  const whatsappNumber = '233546996210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello BOLDDEE RENTALS! I would like to inquire about graduation sashes & event rentals.')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-emerald-500 text-slate-950 shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-transform flex items-center gap-2 group border border-emerald-400"
      title="Chat with BOLDDEE Support on WhatsApp"
    >
      <MessageSquare className="w-6 h-6 fill-slate-950" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs font-black uppercase tracking-wider pr-1">
        WhatsApp Us
      </span>
    </a>
  );
}
