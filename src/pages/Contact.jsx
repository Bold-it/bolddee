import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Users
} from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventDate: formData.eventDate,
          subject: 'Website Rental / Sash Inquiry',
          message: formData.message
        })
      });
    } catch (err) {
      console.warn('Backend inquiry logging non-blocking error:', err);
    } finally {
      setLoading(false);
      const whatsappMessage = `*NEW WEBSITE INQUIRY — BOLDDEE RENTALS*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Event Date:* ${formData.eventDate || 'Not specified'}\n*Message:* ${formData.message}`;
      const whatsappUrl = `https://wa.me/233546996210?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-[#051a10]">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-2">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Contact BOLDDEE RENTALS
          </h1>
          <p className="text-emerald-200/80 text-sm md:text-base">
            Have questions about equipment rental schedules, custom graduation sash designs, or class packages? We are ready to assist!
          </p>
        </div>

        {/* Contact Cards Grid (matches FAM'S Apple Hub layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* WhatsApp & Call Numbers */}
          <div className="glass-panel p-6 border border-emerald-900/60 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-amber-400/20 text-amber-400 rounded-xl flex items-center justify-center">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Call or WhatsApp</h2>
                <p className="text-xs text-emerald-300/70">Instant support available 7 days a week</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-emerald-100">
              <a
                href="https://wa.me/233546996210"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-amber-400 transition-colors font-semibold"
              >
                +233 546 996 210 (Main Line & WhatsApp)
              </a>
              <a
                href="https://wa.me/233244163901"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-amber-400 transition-colors font-semibold"
              >
                +233 24 416 3901 (Field Rentals Dispatch)
              </a>
              <a
                href="https://wa.me/233595308678"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-amber-400 transition-colors font-semibold"
              >
                +233 059 530 8678 (Campus Ambassador Line)
              </a>
            </div>
          </div>

          {/* Email & Location */}
          <div className="glass-panel p-6 border border-emerald-900/60 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-amber-400/20 text-amber-400 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Email & Physical Hub</h2>
                <p className="text-xs text-emerald-300/70">Official correspondence & pickup hub</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-emerald-100">
              <a
                href="mailto:bolddeerentals@gmail.com"
                className="block hover:text-amber-400 transition-colors font-semibold"
              >
                bolddeerentals@gmail.com
              </a>
              <div className="flex items-start gap-2 text-emerald-300/80 text-xs">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Ho Technical University Campus / Main Warehouse, Volta Region & Greater Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300/80 text-xs">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Monday – Sunday: 7:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Group Card (matches FAM'S Apple Hub layout) */}
        <div className="glass-panel p-6 md:p-8 border border-amber-400/40 mb-12 bg-gradient-to-r from-[#0d3b24] to-[#082215]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-400/20 text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Join Our VIP Campus & Event Community</h2>
                <p className="text-xs md:text-sm text-emerald-200/80 mt-1">
                  Get exclusive access to graduation promo codes, early canopy reservations, and bulk sash discounts.
                </p>
              </div>
            </div>
            <a
              href="https://chat.whatsapp.com/DjhZ8zyDvHt3ut6E1fhTH0"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <button className="btn-gold text-sm py-3 px-6 shadow-md">
                Join WhatsApp Group
              </button>
            </a>
          </div>
        </div>

        {/* Direct Inquiry Form */}
        <div className="glass-panel p-8 border border-emerald-900/60 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Send Us an Inquiry</h2>
          <p className="text-xs text-emerald-300/80 mb-6">
            Fill in your requirements below to instantly route your message to our event team on WhatsApp.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-900/30 border border-emerald-500/40 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Inquiry Forwarded!</h3>
              <p className="text-xs text-emerald-200/80">
                Your message has been formatted and opened on WhatsApp. Our representative will respond immediately.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kwame Mensah"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+233 24 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="kwame@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Proposed Event / Graduation Date</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">Message / Items Required</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your event needs (e.g. 50 Chiavari chairs, 1x 20x20 tent, 25 class graduation sashes for HTU...)"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gold text-base py-3 flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="h-4 w-4" />
                <span>Send via WhatsApp</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
