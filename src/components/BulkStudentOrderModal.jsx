import React, { useState } from 'react';
import { X, FileSpreadsheet, Upload, Check, Users, ShoppingBag, Sparkles, Download } from 'lucide-react';

export default function BulkStudentOrderModal({ onClose, addToCart }) {
  const [institution, setInstitution] = useState('Ho Technical University');
  const [department, setDepartment] = useState('Computer Science Dept (Class of 2027)');
  const [students, setStudents] = useState([
    { id: 1, name: 'Moses Mensah', course: 'BSc Computer Science', size: 'Standard Stole' },
    { id: 2, name: 'Ama Owusu', course: 'BSc Computer Science', size: 'Standard Stole' },
    { id: 3, name: 'Kofi Badu', course: 'BSc Computer Science', size: 'Standard Stole' },
    { id: 4, name: 'Esi Ampah', course: 'BSc Computer Science', size: 'Standard Stole' },
    { id: 5, name: 'Kwaku Frimpong', course: 'BSc Computer Science', size: 'Standard Stole' }
  ]);
  const [uploadedFileName, setUploadedFileName] = useState('HTU_CS_Graduates_2027.csv');

  const sashUnitPrice = 120;
  const rawSubtotal = students.length * sashUnitPrice;
  const bulkDiscountPercent = students.length >= 20 ? 15 : 10; // 10% or 15% discount
  const discountAmount = Math.round((rawSubtotal * bulkDiscountPercent) / 100);
  const finalTotal = rawSubtotal - discountAmount;

  const handleSimulateFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      // Add mock extra rows
      setStudents([
        ...students,
        { id: 6, name: 'Yaw Addo', course: department, size: 'Standard Stole' },
        { id: 7, name: 'Abena Mensah', course: department, size: 'Standard Stole' },
        { id: 8, name: 'Akosua Sarpong', course: department, size: 'Standard Stole' }
      ]);
    }
  };

  const handleAddBulkOrder = () => {
    const bulkItem = {
      id: 'bulk-' + Date.now(),
      name: `Class Bulk Order: ${institution} (${students.length} Students)`,
      pillar: 'BOLDDEE GRAD',
      category: 'Bulk Class Order',
      price: finalTotal,
      unit: `${students.length} Graduates`,
      image: '/images/hero_graduation.jpg',
      isBulkOrder: true,
      bulkDetails: {
        institution,
        department,
        studentCount: students.length,
        studentList: students,
        discountAmount
      }
    };
    addToCart(bulkItem);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-3xl p-6 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">BULK CLASS ORDER & CSV LIST UPLOAD</h2>
            <p className="text-xs text-slate-400">Order personalized sashes & medals for an entire graduating class or department.</p>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Details Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Institution / University</label>
              <input 
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Department / Class Year</label>
              <input 
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-emerald-500/40 rounded-2xl p-6 bg-slate-950 text-center relative hover:border-emerald-400 transition-colors">
            <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">Upload Class CSV / Excel File</p>
            <p className="text-xs text-slate-400 mt-1">Columns required: <code className="text-yellow-300">Student Name, Course, Sash Text</code></p>
            
            <input 
              type="file"
              accept=".csv, .xlsx"
              onChange={handleSimulateFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            {uploadedFileName && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40">
                <Check className="w-4 h-4 text-emerald-400" /> Uploaded: {uploadedFileName}
              </div>
            )}
          </div>

          {/* Student List Preview Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" /> Student List Preview ({students.length} Graduates)
              </h4>
              <button 
                onClick={() => setStudents([...students, { id: Date.now(), name: 'New Student', course: department, size: 'Standard Stole' }])}
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                + Add Student Manually
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-slate-950">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold sticky top-0 border-b border-white/10">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Course / Degree</th>
                    <th className="p-2.5">Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {students.map((st, idx) => (
                    <tr key={st.id} className="hover:bg-slate-900/50">
                      <td className="p-2.5 font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-white">{st.name}</td>
                      <td className="p-2.5">{st.course}</td>
                      <td className="p-2.5 text-yellow-400 font-semibold">{st.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing & Bulk Discount Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Standard Sash Rate ({students.length} × GH₵ 120):</span>
              <span className="font-bold text-white">GH₵ {rawSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Class Bulk Discount ({bulkDiscountPercent}% Off):
              </span>
              <span>- GH₵ {discountAmount.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-black text-white">
              <span>Class Order Total:</span>
              <span className="text-emerald-400">GH₵ {finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Add Bulk Order CTA */}
          <button
            onClick={handleAddBulkOrder}
            className="w-full btn-emerald justify-center text-sm py-3 shadow-xl"
          >
            <ShoppingBag className="w-4 h-4" /> Add Bulk Class Order to Cart
          </button>

        </div>

      </div>
    </div>
  );
}
