import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  Calendar,
  LogOut,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { MOCK_ADMIN_ASSETS, MOCK_ORDERS } from '../data/mockData';

export const Admin = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct, toggleFeatured, toggleInStock, resetToDefault } = useProducts();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'assets' | 'orders'
  const [editingId, setEditingId] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'piece',
    pillar: 'BOLDDEE GRAD',
    category: 'Graduation Accessories',
    image: '',
    featured: false,
    in_stock: true,
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Authentication Guard
  useEffect(() => {
    const isAuthed = localStorage.getItem('bolddee_admin_session') === 'authenticated';
    if (!isAuthed) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('bolddee_admin_session');
    navigate('/admin-login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      alert('Please fill out all required fields.');
      return;
    }

    const priceNum = parseFloat(formData.price) || 0;
    const finalImage = formData.image.trim() || '/images/custom_sash.jpg';

    if (editingId) {
      updateProduct(editingId, {
        name: formData.name,
        description: formData.description,
        price: priceNum,
        unit: formData.unit,
        pillar: formData.pillar,
        category: formData.category,
        image: finalImage,
        image_urls: [finalImage],
        featured: formData.featured,
        in_stock: formData.in_stock,
      });
      setEditingId(null);
    } else {
      addProduct({
        name: formData.name,
        description: formData.description,
        price: priceNum,
        unit: formData.unit,
        pillar: formData.pillar,
        category: formData.category,
        image: finalImage,
        image_urls: [finalImage],
        featured: formData.featured,
        in_stock: formData.in_stock,
      });
    }

    // Reset Form
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'piece',
      pillar: 'BOLDDEE GRAD',
      category: 'Graduation Accessories',
      image: '',
      featured: false,
      in_stock: true,
    });
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      description: p.description || '',
      price: p.price,
      unit: p.unit || 'piece',
      pillar: p.pillar || 'BOLDDEE GRAD',
      category: p.category || 'General',
      image: p.image || p.image_urls?.[0] || '',
      featured: p.featured || false,
      in_stock: p.in_stock !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'piece',
      pillar: 'BOLDDEE GRAD',
      category: 'Graduation Accessories',
      image: '',
      featured: false,
      in_stock: true,
    });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pillar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-4 bg-[#051a10]">
      <div className="container mx-auto max-w-6xl">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-emerald-900/60 gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="BOLDDEE RENTALS" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Management Console</h1>
              <p className="text-xs text-emerald-300/80">Manage products, rental equipment & active bookings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefault}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              title="Reset products to default baseline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Default Catalog</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary text-xs py-2 px-3 text-red-300 hover:text-red-200 border-red-500/30 flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 mb-8 border-b border-emerald-900/60 pb-3">
          <button
            onClick={() => setActiveTab('products')}
            className={`text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Store Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'assets'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Rental Asset Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings & Orders</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGER (matches FAM'S Apple Hub Admin.tsx) */}
        {activeTab === 'products' && (
          <div className="space-y-10">
            {/* Add / Edit Form */}
            <div className="glass-panel p-6 border border-emerald-900/60 max-w-3xl">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>{editingId ? 'Edit Product Item' : 'Add New Equipment or Apparel Item'}</span>
              </h2>
              <p className="text-xs text-emerald-300/70 mb-5">
                Fill in details to instantly publish to the live storefront and catalog.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-emerald-200 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. VIP Custom Gold Sash"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-200 mb-1">Price (GH₵) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 150"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-emerald-200 mb-1">Pillar Category</label>
                    <select
                      value={formData.pillar}
                      onChange={(e) => setFormData({ ...formData, pillar: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                    >
                      <option value="BOLDDEE GRAD">BOLDDEE GRAD</option>
                      <option value="BOLDDEE RENTALS">BOLDDEE RENTALS</option>
                      <option value="BOLDDEE MOMENTS">BOLDDEE MOMENTS</option>
                      <option value="BOLDDEE EVENTS">BOLDDEE EVENTS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-200 mb-1">Pricing Unit</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="e.g. day, piece, setup"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-200 mb-1">Subcategory</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Canopies, Stoles"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Image URL / Path</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/custom_sash.jpg or https://..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-emerald-400/60 block mt-1">
                    Presets: <code>/images/custom_sash.jpg</code>, <code>/images/rental_equipment.jpg</code>, <code>/images/bolddee_moments.jpg</code>, <code>/images/hero_graduation.jpg</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the product or equipment..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded accent-amber-400"
                    />
                    <span>Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.in_stock}
                      onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                      className="rounded accent-amber-400"
                    />
                    <span>Available / In Stock</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-3">
                  <button type="submit" className="btn-gold text-sm py-2.5 px-6">
                    {editingId ? 'Save Changes' : 'Create Product'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn-secondary text-sm py-2.5 px-6"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Catalog List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white">Live Product Catalog ({products.length})</h3>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="glass-panel p-4 border border-emerald-900/60 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || p.image_urls?.[0] || '/images/custom_sash.jpg'}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-lg bg-[#082215] shrink-0 border border-emerald-800/40"
                        onError={(e) => {
                          e.currentTarget.src = '/images/rental_equipment.jpg';
                        }}
                      />
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          {p.pillar} • {p.category}
                        </span>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{p.name}</h4>
                        <p className="text-xs text-amber-400 font-extrabold mt-0.5">
                          GH₵{Number(p.price).toLocaleString()} <span className="text-[11px] text-emerald-300/70 font-normal">/ {p.unit || 'unit'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFeatured(p.id)}
                        className={`p-2 rounded-lg border transition-colors ${
                          p.featured
                            ? 'bg-amber-400/20 text-amber-400 border-amber-400/40'
                            : 'bg-emerald-950/40 text-emerald-500 border-emerald-800/40'
                        }`}
                        title={p.featured ? 'Featured on home' : 'Click to feature'}
                      >
                        <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => toggleInStock(p.id)}
                        className={`p-2 rounded-lg border transition-colors ${
                          p.in_stock
                            ? 'bg-emerald-400/20 text-emerald-400 border-emerald-400/40'
                            : 'bg-red-950/40 text-red-400 border-red-800/40'
                        }`}
                        title={p.in_stock ? 'In Stock' : 'Out of Stock'}
                      >
                        {p.in_stock ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 rounded-lg bg-emerald-900/40 border border-emerald-700/40 text-emerald-200 hover:text-white"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete "${p.name}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-red-950/30 border border-red-800/40 text-red-400 hover:text-red-300"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ASSET TRACKER */}
        {activeTab === 'assets' && (
          <div className="glass-panel p-6 border border-emerald-900/60 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Rental Asset Barcode & Status Tracker</h2>
              <p className="text-xs text-emerald-300/80">Track individualized physical inventory status across event locations</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-emerald-200">
                <thead className="bg-[#072416] text-amber-400 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Asset Tag</th>
                    <th className="p-3">Asset Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3">Assigned Location</th>
                    <th className="p-3">Last Inspected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {MOCK_ADMIN_ASSETS.map((asset) => (
                    <tr key={asset.id} className="hover:bg-emerald-950/40">
                      <td className="p-3 font-mono font-bold text-white">{asset.id}</td>
                      <td className="p-3 text-white font-semibold">{asset.name}</td>
                      <td className="p-3">{asset.category}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            asset.status === 'Available'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : asset.status.includes('Rented')
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td className="p-3">{asset.location}</td>
                      <td className="p-3 text-emerald-400/80">{asset.lastInspected}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="glass-panel p-6 border border-emerald-900/60 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Recent Customer Bookings & Sashes</h2>
              <p className="text-xs text-emerald-300/80">Review upcoming delivery deadlines and payments</p>
            </div>

            <div className="space-y-4">
              {MOCK_ORDERS.map((ord) => (
                <div key={ord.id} className="p-5 rounded-xl border border-emerald-800/60 bg-[#072416] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-900/60">
                    <div>
                      <span className="font-mono text-xs font-black text-amber-400">Order ID: #{ord.id}</span>
                      <h4 className="text-base font-bold text-white mt-0.5">{ord.customerName}</h4>
                      <p className="text-xs text-emerald-300/70">{ord.email} • {ord.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded bg-amber-400/20 text-amber-400 font-bold border border-amber-400/30">
                        {ord.paymentStatus}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                        {ord.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-emerald-200/90 leading-relaxed">
                    <strong>Items Booked:</strong> {ord.items}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-300/70 pt-1">
                    <div className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Delivery: {ord.deliveryLocation} ({ord.deliveryDate})</span>
                    </div>
                    <div className="text-sm font-black text-amber-400">
                      Total: GH₵{ord.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
