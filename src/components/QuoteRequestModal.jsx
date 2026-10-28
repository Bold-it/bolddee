import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Send, Calendar, MapPin, Users, Phone, Mail, User, AlertCircle, RefreshCw } from 'lucide-react';

export default function QuoteRequestModal({ onClose }) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [eventType, setEventType] = useState('Graduation Celebration');
  const [guestCount, setGuestCount] = useState('200');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('Ho, Volta Region');
  const [budget, setBudget] = useState('');
  const [selectedItems, setSelectedItems] = useState(['Marquee Tents', 'Gold Chiavari Chairs', 'Banquet Tables']);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');

  const equipmentOptions = [
    'Marquee Tents', 'Gold Chiavari Chairs', 'Plastic Chairs', 'Banquet Tables',
    'PA Sound & Mics', 'Stage & Red Carpet', 'Lighting & Truss', 'Photo Booth',
    'Decoration & Floral', 'Catering Support'
  ];

  const toggleEquipment = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!customerName || !phone) {
      setError('Please provide your name and Ghana contact phone number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      customerName,
      phone,
      email,
      organization,
      eventDate,
      budget: budget ? parseFloat(budget) : null,
      requirements: `Event: ${eventType} | Guests: ${guestCount} | Venue: ${venue}. Notes: ${notes || 'None'}`,
      equipmentList: selectedItems
    };

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }
      setQuoteNumber(data.quoteNumber);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">BESPOKE EVENT QUOTATION REQUEST</h2>
                <p className="text-xs text-slate-400">Request a customized price quotation for large events, corporate & rentals.</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-500/30 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmitQuote} className="space-y-4">
              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+233 24 123 4567"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kwame@example.com"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Organization / School (Optional)</label>
                  <input 
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. UHAS / Evangelical Presbyterian"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Event Type</label>
                  <select 
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Graduation Celebration">Graduation Celebration</option>
                    <option value="Wedding / Engagement">Wedding / Engagement</option>
                    <option value="Corporate / Institutional">Corporate / Institutional</option>
                    <option value="Funeral Service">Funeral Service</option>
                    <option value="Private Party">Private Party</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Guest Count</label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      placeholder="e.g. 200"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Budget Target (GH₵)</label>
                  <input 
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Event Date</label>
                  <input 
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Event Venue & Town</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. Ho, Volta Region"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Equipment Multi-select checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Required Equipment & Services</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {equipmentOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleEquipment(item)}
                      className={`p-2 rounded-lg text-xs font-semibold text-left transition-colors border flex items-center justify-between ${
                        selectedItems.includes(item)
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      <span>{item}</span>
                      {selectedItems.includes(item) && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Additional Specifications / Setup Requests</label>
                <textarea 
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your vision, theme colors, setup time requirements..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary bg-gradient-to-r from-purple-500 to-indigo-600 text-white justify-center text-sm py-3 shadow-xl flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Submitting Request...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Quotation Request
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">QUOTATION SUBMITTED!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your quotation reference number is <strong className="text-yellow-400 font-mono text-base">{quoteNumber}</strong>. 
              A BOLDDEE EVENTS specialist will review your setup needs and contact you via WhatsApp or Call within 2 hours.
            </p>
            <button 
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
