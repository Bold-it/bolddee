import React, { useState } from 'react';
import { X, Sparkles, Check, ShoppingBag, Palette, Type, Award } from 'lucide-react';

export default function SashCustomizerModal({ product, onClose, addToCart }) {
  const [studentName, setStudentName] = useState('KWAME MENSAH');
  const [institution, setInstitution] = useState('HO TECHNICAL UNIVERSITY');
  const [degree, setDegree] = useState('BSc. COMPUTER SCIENCE');
  const [gradYear, setGradYear] = useState('2027');
  const [sashColor, setSashColor] = useState('#ffffff'); // White satin
  const [threadColor, setThreadColor] = useState('#d4af37'); // Gold thread
  const [includeKente, setIncludeKente] = useState(true);

  const handleSaveAndAdd = () => {
    const customizedProduct = {
      ...product,
      customization: {
        studentName,
        institution,
        degree,
        gradYear,
        sashColor,
        threadColor,
        includeKente
      },
      designApproved: false // Requires admin approval baseline in SRS FR-009
    };
    addToCart(customizedProduct);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-4xl p-6 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">INTERACTIVE SASH & STOLE CUSTOMIZER</h2>
            <p className="text-xs text-slate-400">Design your personalized graduation stole with real-time live preview.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Real-Time Visual Canvas Preview */}
          <div className="md:col-span-6 bg-slate-950 p-6 rounded-2xl border border-yellow-500/30 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden shadow-2xl">
            
            <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest mb-4 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Live Stole Artwork Render
            </div>

            {/* Simulated Graduation Stole Ribbon Visual */}
            <div 
              className="w-48 py-8 px-4 rounded-b-xl shadow-2xl border-x-4 border-b-8 flex flex-col items-center justify-between text-center transition-all duration-300 relative"
              style={{ 
                backgroundColor: sashColor, 
                borderColor: threadColor,
                color: threadColor
              }}
            >
              {/* Optional Kente Traditional Header Accent */}
              {includeKente && (
                <div className="w-full h-8 bg-gradient-to-r from-yellow-500 via-emerald-600 to-red-600 rounded-t-sm mb-3 flex items-center justify-center text-[9px] font-black text-white tracking-widest uppercase shadow-sm">
                  ★ GHANA KENTE ACCENT ★
                </div>
              )}

              {/* Institution Crest / Title */}
              <div className="space-y-1 my-2">
                <div className="text-xs font-black uppercase tracking-wider underline decoration-wavy">
                  {institution || 'YOUR UNIVERSITY'}
                </div>
                <div className="text-[10px] font-bold opacity-90 uppercase">
                  {degree || 'YOUR DEGREE'}
                </div>
              </div>

              {/* Central Divider Icon */}
              <div className="my-3 text-lg font-black opacity-80">
                🎓
              </div>

              {/* Student Name */}
              <div className="my-2 border-y py-2 border-current w-full">
                <div className="text-sm font-extrabold tracking-widest uppercase">
                  {studentName || 'STUDENT NAME'}
                </div>
                <div className="text-[10px] font-semibold tracking-wider">
                  CLASS OF {gradYear}
                </div>
              </div>

              {/* Bottom Fringe Decoration */}
              <div className="mt-4 flex gap-1 justify-center w-full">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1 h-4 rounded-b" style={{ backgroundColor: threadColor }} />
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 text-center">
              ✓ Embroidery proof generated. Artwork submitted for admin verification upon order.
            </p>
          </div>

          {/* Right Column: Customization Controls Form */}
          <div className="md:col-span-6 space-y-4">
            
            {/* Field: Student Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-yellow-400" /> Graduate Full Name (Embroidered)
              </label>
              <input 
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value.toUpperCase())}
                placeholder="e.g. KWAME MENSAH"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
              />
            </div>

            {/* Field: Institution */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Institution Name
              </label>
              <input 
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value.toUpperCase())}
                placeholder="e.g. HO TECHNICAL UNIVERSITY"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
              />
            </div>

            {/* Field: Degree & Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Degree / Course</label>
                <input 
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value.toUpperCase())}
                  placeholder="e.g. BSc. COMPUTER SCIENCE"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Graduation Year</label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
                >
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                  <option value="2028">2028</option>
                </select>
              </div>
            </div>

            {/* Field: Color Selections */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-yellow-400" /> Sash Satin Color
              </label>
              <div className="flex gap-3">
                {[
                  { name: 'White', hex: '#ffffff' },
                  { name: 'Gold', hex: '#d4af37' },
                  { name: 'Royal Blue', hex: '#1e40af' },
                  { name: 'Emerald', hex: '#065f46' },
                  { name: 'Black', hex: '#111827' }
                ].map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => setSashColor(col.hex)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      sashColor === col.hex ? 'scale-110 border-yellow-400 shadow-md' : 'border-slate-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Embroidery Thread Color</label>
              <div className="flex gap-3">
                {[
                  { name: 'Metallic Gold', hex: '#d4af37' },
                  { name: 'Silver', hex: '#94a3b8' },
                  { name: 'Black', hex: '#000000' },
                  { name: 'Pure White', hex: '#ffffff' }
                ].map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => setThreadColor(col.hex)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      threadColor === col.hex ? 'scale-110 border-yellow-400 shadow-md' : 'border-slate-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            {/* Kente Toggle */}
            <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10">
              <span className="text-xs font-bold text-slate-300">Include Ghanaian Kente Accent Header</span>
              <input 
                type="checkbox"
                checked={includeKente}
                onChange={(e) => setIncludeKente(e.target.checked)}
                className="w-4 h-4 accent-yellow-500 rounded cursor-pointer"
              />
            </div>

            {/* Add to Cart CTA */}
            <div className="pt-4">
              <button
                onClick={handleSaveAndAdd}
                className="w-full btn-primary justify-center text-sm py-3 shadow-xl"
              >
                <ShoppingBag className="w-4 h-4" /> Save Design & Add to Cart (GH₵ {product.price})
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
