import React, { useState } from 'react';
import { 
  BarChart3, Package, Users, Truck, ShieldCheck, CheckCircle2, XCircle, 
  AlertTriangle, DollarSign, Calendar, FileText, Check, Award
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_ADMIN_ASSETS, CAMPAIGNS } from '../data/mockData';

export default function AdminDashboard() {
  const [activeAdminTab, setActiveAdminTab] = useState('orders');
  const [ordersList, setOrdersList] = useState(MOCK_ORDERS);
  const [assetsList, setAssetsList] = useState(MOCK_ADMIN_ASSETS);

  // Approve design artwork action
  const handleApproveDesign = (orderId) => {
    setOrdersList(ordersList.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, designApproved: true, orderStatus: 'Artwork Approved - In Production' };
      }
      return ord;
    }));
  };

  // Inspect asset action
  const handleInspectAsset = (assetId, newStatus) => {
    setAssetsList(assetsList.map(ast => {
      if (ast.id === assetId) {
        return { ...ast, status: newStatus, lastInspected: new Date().toISOString().split('T')[0] };
      }
      return ast;
    }));
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-purple-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4" /> BOLDDEE RENTALS INTERNAL BACKEND
          </div>
          <h2 className="text-3xl font-black text-white">OPERATIONS & INVENTORY ADMIN</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-extrabold text-emerald-400">SUPER ADMIN SESSION ACTIVE</span>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-xl border border-yellow-500/30">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Sales Revenue</div>
          <div className="text-2xl font-black text-yellow-400 mt-1">GH₵ 42,850</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ +18% vs last month</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-blue-500/30">
          <div className="text-xs font-bold text-slate-400 uppercase">Active Rentals Dispatched</div>
          <div className="text-2xl font-black text-blue-400 mt-1">182 Equipment</div>
          <div className="text-[10px] text-slate-300 mt-1">HTU Campus / Legon</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/30">
          <div className="text-xs font-bold text-slate-400 uppercase">Pending Artwork Approvals</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {ordersList.filter(o => !o.designApproved).length} Orders
          </div>
          <div className="text-[10px] text-yellow-300 mt-1">Needs Admin Review</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-purple-500/30">
          <div className="text-xs font-bold text-slate-400 uppercase">Active Campus Drives</div>
          <div className="text-2xl font-black text-purple-400 mt-1">3 Universities</div>
          <div className="text-[10px] text-purple-300 mt-1">HTU 2027 Featured</div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'orders', label: 'Orders & Artwork Approvals' },
          { id: 'assets', label: 'Rental Inventory & Asset IDs' },
          { id: 'campaigns', label: 'Campus Ambassadors & Drives' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === tab.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Orders & Artwork Approvals */}
      {activeAdminTab === 'orders' && (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 bg-slate-900 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-yellow-400" /> Customer Orders & Customization Approval Queue
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-white/10">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items Purchased</th>
                  <th className="p-3">Total Value</th>
                  <th className="p-3">Deposit Paid</th>
                  <th className="p-3">Design Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ordersList.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold text-yellow-400">{ord.id}</td>
                    <td className="p-3 font-semibold text-white">{ord.customerName} <span className="text-[10px] text-slate-400 block">{ord.phone}</span></td>
                    <td className="p-3 text-slate-300 max-w-xs">{ord.items}</td>
                    <td className="p-3 font-bold text-white">GH₵ {ord.totalAmount.toLocaleString()}</td>
                    <td className="p-3 font-bold text-emerald-400">GH₵ {ord.depositPaid.toLocaleString()}</td>
                    <td className="p-3">
                      {ord.designApproved ? (
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/30 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Approval Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {!ord.designApproved && (
                        <button
                          onClick={() => handleApproveDesign(ord.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 transition-colors"
                        >
                          Approve Design
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory & Asset IDs */}
      {activeAdminTab === 'assets' && (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 bg-slate-900 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" /> Equipment Asset ID Tagging & Return Inspections
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-white/10">
                <tr>
                  <th className="p-3">Asset Code</th>
                  <th className="p-3">Equipment Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3">Warehouse / Venue</th>
                  <th className="p-3">Last Inspected</th>
                  <th className="p-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {assetsList.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold text-blue-400">{ast.id}</td>
                    <td className="p-3 font-bold text-white">{ast.name}</td>
                    <td className="p-3 text-slate-400">{ast.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        ast.status.includes('Available') 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : ast.status.includes('Rented')
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {ast.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{ast.location}</td>
                    <td className="p-3 text-slate-400">{ast.lastInspected}</td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => handleInspectAsset(ast.id, 'Available')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-bold"
                      >
                        Set Available
                      </button>
                      <button
                        onClick={() => handleInspectAsset(ast.id, 'Maintenance')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-red-400 text-[10px] font-bold"
                      >
                        Set Repair
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Campus Campaigns */}
      {activeAdminTab === 'campaigns' && (
        <div className="grid md:grid-cols-2 gap-6">
          {CAMPAIGNS.map((camp) => (
            <div key={camp.id} className="glass-panel p-5 rounded-2xl border border-yellow-500/30 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="pillar-badge pillar-grad">{camp.institution}</span>
                  <h3 className="text-xl font-black text-white mt-1">{camp.name}</h3>
                </div>
                <Award className="w-6 h-6 text-yellow-400" />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Referral Code:</span>
                  <strong className="text-yellow-400 font-mono">{camp.ambassadorCode}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Campaign Drive Dates:</span>
                  <strong className="text-white">{camp.dateRange}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Enrolled Graduates:</span>
                  <strong className="text-emerald-400">{camp.activeStudents} Students</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}
