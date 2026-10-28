import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Truck,
  ExternalLink,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  Clock,
  Wrench,
  Users,
  FileText,
  Mail,
  Phone,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

export const Admin = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct, toggleFeatured, toggleInStock, resetToDefault } = useProducts();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'assets' | 'orders' | 'quotes' | 'customers'
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

  // Image Upload & Gallery State
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Live Backend Data States
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [ordersList, setOrdersList] = useState([]);
  const [assetsList, setAssetsList] = useState([]);
  const [quotesList, setQuotesList] = useState([]);
  const [inquiriesList, setInquiriesList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [loadingBackend, setLoadingBackend] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // Helper for Authorization Headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('bolddee_admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  // Ensure Admin Token
  const ensureAdminToken = async () => {
    let token = localStorage.getItem('bolddee_admin_token');
    if (!token) {
      try {
        const res = await fetch('/api/auth/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: 'bolddee2026' })
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('bolddee_admin_token', data.token);
          token = data.token;
        }
      } catch (err) {
        console.warn('Silent admin token fallback failed:', err);
      }
    }
    return token;
  };

  // Fetch Live Data Functions
  const fetchDashboard = async () => {
    await ensureAdminToken();
    try {
      const res = await fetch('/api/admin/dashboard', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setDashboardMetrics(data);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    }
  };

  const fetchOrders = async () => {
    await ensureAdminToken();
    try {
      const res = await fetch('/api/orders', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrdersList(data.orders || []);
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/rentals/assets');
      if (res.ok) {
        const data = await res.json();
        setAssetsList(data.assets || []);
      }
    } catch (err) {
      console.warn('Assets fetch error:', err);
    }
  };

  const fetchQuotesAndInquiries = async () => {
    await ensureAdminToken();
    try {
      const [qRes, inqRes] = await Promise.all([
        fetch('/api/quotes', { headers: getAuthHeaders() }),
        fetch('/api/inquiries', { headers: getAuthHeaders() })
      ]);
      if (qRes.ok) {
        const qData = await qRes.json();
        setQuotesList(qData.quotes || []);
      }
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiriesList(inqData.inquiries || []);
      }
    } catch (err) {
      console.warn('Quotes/inquiries fetch error:', err);
    }
  };

  const fetchCustomers = async () => {
    await ensureAdminToken();
    try {
      const res = await fetch('/api/admin/customers', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setCustomersList(data.customers || []);
      }
    } catch (err) {
      console.warn('Customers fetch error:', err);
    }
  };

  // Initial Load & Tab Switching
  useEffect(() => {
    const isAuthed = localStorage.getItem('bolddee_admin_session') === 'authenticated';
    if (!isAuthed) {
      navigate('/admin-login');
      return;
    }

    if (activeTab === 'overview') fetchDashboard();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'assets') fetchAssets();
    if (activeTab === 'quotes') fetchQuotesAndInquiries();
    if (activeTab === 'customers') fetchCustomers();
  }, [activeTab, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('bolddee_admin_session');
    localStorage.removeItem('bolddee_admin_token');
    localStorage.removeItem('bolddee_admin_user');
    navigate('/admin-login');
  };

  // State Machine Order Transition Handler
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newStatus, notes: `Status manually updated in Admin console to ${newStatus}` })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to update order status');
      } else {
        fetchOrders();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Maintenance Toggle Handler (FR-035)
  const handleToggleMaintenance = async (assetId, currentStatus) => {
    const newStatus = currentStatus === 'Maintenance' ? 'Available' : 'Maintenance';
    try {
      const res = await fetch(`/api/rentals/assets/${assetId}/maintenance`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus, notes: 'Status toggled from Admin Console' })
      });
      if (res.ok) {
        fetchAssets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Customer Status Toggle Handler (FR-045)
  const handleToggleCustomerStatus = async (customerId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/suspend`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchCustomers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quote Status Update Handler
  const handleUpdateQuoteStatus = async (quoteId, status) => {
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchQuotesAndInquiries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Client-side image compression & optimization
  const compressImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const maxWidth = 1200;
          const maxHeight = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressed);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    setUploading(true);
    try {
      const compressedList = await Promise.all(files.map((file) => compressImageFile(file)));
      setImageUrls((prev) => [...prev, ...compressedList]);
    } catch (err) {
      console.error('Error processing uploaded image:', err);
      alert('Could not process selected image file. Please try another image.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimary = (indexToPrimary) => {
    setImageUrls((prev) => {
      const item = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      return [item, ...rest];
    });
  };

  const handleAddUrlImage = () => {
    if (formData.image.trim()) {
      setImageUrls((prev) => [...prev, formData.image.trim()]);
      setFormData((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      alert('Please fill out all required fields.');
      return;
    }

    const priceNum = parseFloat(formData.price) || 0;
    const finalImages = imageUrls.length > 0
      ? imageUrls
      : (formData.image.trim() ? [formData.image.trim()] : ['/images/custom_sash.jpg']);
    const primaryImage = finalImages[0];

    const productPayload = {
      name: formData.name,
      description: formData.description,
      price: priceNum,
      unit: formData.unit,
      pillar: formData.pillar,
      category: formData.category,
      image: primaryImage,
      image_urls: finalImages,
      featured: formData.featured,
      in_stock: formData.in_stock,
    };

    if (editingId) {
      updateProduct(editingId, productPayload);
      setEditingId(null);
    } else {
      addProduct(productPayload);
    }

    setImageUrls([]);
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
    const existingImages = p.image_urls?.length
      ? p.image_urls
      : (p.image ? [p.image] : []);
    setImageUrls(existingImages);

    setFormData({
      name: p.name,
      description: p.description || '',
      price: p.price,
      unit: p.unit || 'piece',
      pillar: p.pillar || 'BOLDDEE GRAD',
      category: p.category || 'General',
      image: '',
      featured: p.featured || false,
      in_stock: p.in_stock !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setImageUrls([]);
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
    <div className="min-h-screen py-8 px-4 bg-[#051a10]">
      <div className="container mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-emerald-900/60 gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="BOLDDEE RENTALS" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Management Console</h1>
              <p className="text-xs text-emerald-300/80">Manage products, rental equipment & active bookings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 text-emerald-200 hover:text-amber-400"
              title="Return to customer website"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Storefront</span>
            </Link>
            <button
              onClick={resetToDefault}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              title="Reset products to default baseline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Catalog</span>
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

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-emerald-900/60 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>KPI Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
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
            <span>Orders & Bookings ({ordersList.length})</span>
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
            <span>Warehouse Assets ({assetsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'quotes'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quotes & CRM ({quotesList.length + inquiriesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'customers'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({customersList.length})</span>
          </button>
        </div>

        {/* TAB 0: KPI OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {dashboardMetrics ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-panel p-5 border border-emerald-800/60 rounded-xl">
                    <div className="flex items-center justify-between text-emerald-300 text-xs font-bold mb-2">
                      <span>Today's Cash Collected</span>
                      <DollarSign className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-black text-amber-400">
                      GH₵ {Number(dashboardMetrics.metrics.salesToday || 0).toLocaleString()}
                    </div>
                    <p className="text-[10px] text-emerald-400/80 mt-1">Verified deposit receipts today</p>
                  </div>

                  <div className="glass-panel p-5 border border-emerald-800/60 rounded-xl">
                    <div className="flex items-center justify-between text-emerald-300 text-xs font-bold mb-2">
                      <span>Total Revenue</span>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-white">
                      GH₵ {Number(dashboardMetrics.metrics.totalSales || 0).toLocaleString()}
                    </div>
                    <p className="text-[10px] text-emerald-400/80 mt-1">Cumulative bookings to date</p>
                  </div>

                  <div className="glass-panel p-5 border border-emerald-800/60 rounded-xl">
                    <div className="flex items-center justify-between text-emerald-300 text-xs font-bold mb-2">
                      <span>Active Rental Bookings</span>
                      <Calendar className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-black text-cyan-300">
                      {dashboardMetrics.metrics.activeRentals}
                    </div>
                    <p className="text-[10px] text-emerald-400/80 mt-1">Units deployed or reserved</p>
                  </div>

                  <div className="glass-panel p-5 border border-emerald-800/60 rounded-xl">
                    <div className="flex items-center justify-between text-emerald-300 text-xs font-bold mb-2">
                      <span>Outstanding Balances</span>
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="text-2xl font-black text-rose-400">
                      GH₵ {Number(dashboardMetrics.metrics.outstandingBalances || 0).toLocaleString()}
                    </div>
                    <p className="text-[10px] text-rose-300/80 mt-1">Pending 48h balance settlement</p>
                  </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#072416] p-4 rounded-xl border border-emerald-900/60 text-xs">
                    <span className="text-slate-400 block font-semibold">Orders in Production:</span>
                    <strong className="text-amber-400 text-lg font-bold">{dashboardMetrics.metrics.inProduction}</strong>
                  </div>
                  <div className="bg-[#072416] p-4 rounded-xl border border-emerald-900/60 text-xs">
                    <span className="text-slate-400 block font-semibold">Pending Quotes:</span>
                    <strong className="text-purple-400 text-lg font-bold">{dashboardMetrics.metrics.pendingQuotes}</strong>
                  </div>
                  <div className="bg-[#072416] p-4 rounded-xl border border-emerald-900/60 text-xs">
                    <span className="text-slate-400 block font-semibold">Items in Maintenance:</span>
                    <strong className="text-yellow-400 text-lg font-bold">{dashboardMetrics.metrics.maintenanceCount}</strong>
                  </div>
                  <div className="bg-[#072416] p-4 rounded-xl border border-emerald-900/60 text-xs">
                    <span className="text-slate-400 block font-semibold">Total Registered Customers:</span>
                    <strong className="text-white text-lg font-bold">{dashboardMetrics.metrics.totalCustomers}</strong>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="glass-panel p-6 border border-emerald-900/60 rounded-xl">
                  <h3 className="text-lg font-bold text-white mb-4">Latest Storefront Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-emerald-200">
                      <thead className="bg-[#072416] text-amber-400 uppercase font-bold tracking-wider">
                        <tr>
                          <th className="p-3">Order #</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Total Amount</th>
                          <th className="p-3">Deposit Paid</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-900/60">
                        {dashboardMetrics.recentOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-emerald-950/40">
                            <td className="p-3 font-mono font-bold text-amber-400">{ord.order_number}</td>
                            <td className="p-3 text-white font-semibold">{ord.customer_name}</td>
                            <td className="p-3 font-bold text-white">GH₵ {Number(ord.total_amount).toLocaleString()}</td>
                            <td className="p-3 text-emerald-300">GH₵ {Number(ord.deposit_paid).toLocaleString()}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                {ord.order_status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400">{new Date(ord.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 glass-panel rounded-xl">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-2" />
                <p className="text-slate-300 font-bold">Loading live operational KPIs...</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: PRODUCTS MANAGER */}
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
                    <label className="block text-xs font-bold text-emerald-200 mb-1">Pricing Unit</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="e.g. piece, day, event, set"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-200 mb-1">Pillar</label>
                    <select
                      value={formData.pillar}
                      onChange={(e) => setFormData({ ...formData, pillar: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                    >
                      <option value="BOLDDEE GRAD">BOLDDEE GRAD</option>
                      <option value="BOLDDEE RENTALS">BOLDDEE RENTALS</option>
                      <option value="BOLDDEE MOMENTS">BOLDDEE MOMENTS</option>
                      <option value="BOLDDEE EVENTS">BOLDDEE EVENTS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-200 mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Tents & Canopies"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* IMAGE UPLOAD & GALLERY MANAGER */}
                <div className="border border-emerald-800/60 rounded-xl p-4 bg-[#072416]/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-emerald-200">
                        Product Imagery & Gallery ({imageUrls.length} image{imageUrls.length !== 1 ? 's' : ''})
                      </label>
                      <p className="text-[11px] text-emerald-300/70">
                        Upload real photographs from your device or paste web URLs.
                      </p>
                    </div>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                      isDragging
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-emerald-800/80 bg-[#051a10] hover:border-amber-400/50'
                    }`}
                    onClick={() => document.getElementById('admin-image-file-input').click()}
                  >
                    <input
                      id="admin-image-file-input"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                        {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                      </div>
                      <span className="text-xs font-bold text-white">
                        {uploading ? 'Compressing and optimizing images...' : 'Click to Browse or Drag & Drop Product Photos'}
                      </span>
                      <span className="text-[10px] text-emerald-300/70">
                        PNG, JPG, WEBP • Auto-compressed for rapid customer loading
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Previews */}
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                      {imageUrls.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-emerald-700/60 bg-[#082215] aspect-square">
                          <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-amber-400 text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow">
                              PRIMARY
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(idx)}
                                className="p-1 rounded bg-amber-400 text-black text-[9px] font-bold"
                                title="Make Primary"
                              >
                                Top
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 rounded bg-red-600 text-white"
                              title="Delete"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* URL Input Fallback */}
                  <div className="pt-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Or paste an image web URL..."
                        className="flex-1 px-3 py-2 rounded-lg bg-[#051a10] border border-emerald-800/60 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddUrlImage}
                        className="btn-secondary text-xs py-2 px-3 shrink-0"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
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

        {/* TAB 2: LIVE ORDERS & BOOKINGS */}
        {activeTab === 'orders' && (
          <div className="glass-panel p-6 border border-emerald-900/60 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Live Customer Orders & Rental Bookings</h2>
                <p className="text-xs text-emerald-300/80">Manage dispatch lifecycle, payment milestones & design approvals</p>
              </div>
              <button
                onClick={fetchOrders}
                className="btn-secondary text-xs flex items-center gap-1.5 self-start"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh List
              </button>
            </div>

            {ordersList.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Truck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No customer orders placed yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ordersList.map((ord) => (
                  <div key={ord.id} className="p-5 rounded-xl border border-emerald-800/60 bg-[#072416] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-900/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-amber-400">Order: {ord.order_number}</span>
                          <span className="text-[10px] text-slate-400 font-mono">[{new Date(ord.created_at).toLocaleDateString()}]</span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-0.5">{ord.customer_name}</h4>
                        <p className="text-xs text-emerald-300/70">{ord.email} • {ord.phone}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded bg-amber-400/20 text-amber-400 font-bold border border-amber-400/30">
                          {ord.payment_status}
                        </span>
                        
                        {/* Status Transition Control (FR-025) */}
                        <select
                          value={ord.order_status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="text-xs px-2.5 py-1 rounded bg-emerald-950 border border-emerald-700 text-emerald-200 font-bold focus:border-amber-400 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="In Production">In Production</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-2 text-xs bg-[#051a10] p-3 rounded-lg border border-emerald-900/40">
                      <div>
                        <span className="text-slate-400 block font-semibold">Financial Breakdown:</span>
                        <span className="text-white font-bold">Total: GH₵ {Number(ord.total_amount).toLocaleString()}</span>
                        <div className="text-emerald-400 text-[11px]">Paid: GH₵ {Number(ord.deposit_paid).toLocaleString()}</div>
                        {ord.balance_due > 0 && (
                          <div className="text-rose-400 text-[11px] font-bold">Balance: GH₵ {Number(ord.balance_due).toLocaleString()}</div>
                        )}
                      </div>

                      <div>
                        <span className="text-slate-400 block font-semibold">Delivery Destination:</span>
                        <span className="text-slate-200">{ord.delivery_location}</span>
                        <div className="text-slate-400 text-[11px]">Zone: {ord.delivery_zone}</div>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-semibold">Event / Delivery Target:</span>
                        <span className="text-slate-200">
                          {ord.delivery_date ? new Date(ord.delivery_date).toLocaleDateString() : 'Immediate dispatch'}
                        </span>
                        {ord.notes && <div className="text-slate-400 text-[11px] mt-0.5 truncate">Notes: {ord.notes}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ASSET TRACKER */}
        {activeTab === 'assets' && (
          <div className="glass-panel p-6 border border-emerald-900/60 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Rental Equipment Asset Barcode Tracker</h2>
                <p className="text-xs text-emerald-300/80">Track individual inventory units, physical condition, and maintenance (FR-034, FR-035)</p>
              </div>
              <button
                onClick={fetchAssets}
                className="btn-secondary text-xs flex items-center gap-1.5 self-start"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Assets
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-emerald-200">
                <thead className="bg-[#072416] text-amber-400 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Asset Tag</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Physical Condition</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3">Assigned Location</th>
                    <th className="p-3 text-right">Maintenance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {assetsList.map((asset) => (
                    <tr key={asset.id} className="hover:bg-emerald-950/40">
                      <td className="p-3 font-mono font-bold text-white">{asset.asset_tag}</td>
                      <td className="p-3 text-white font-semibold">{asset.category}</td>
                      <td className="p-3">{asset.condition}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            asset.status === 'Available'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : asset.status === 'Rented'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td className="p-3">{asset.location}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleMaintenance(asset.id, asset.status)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                            asset.status === 'Maintenance'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                              : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                          }`}
                        >
                          {asset.status === 'Maintenance' ? 'Mark Available' : 'Set to Maintenance'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: QUOTES & CRM INQUIRIES */}
        {activeTab === 'quotes' && (
          <div className="space-y-8">
            {/* Quotations Box */}
            <div className="glass-panel p-6 border border-emerald-900/60 space-y-4">
              <h2 className="text-xl font-bold text-white mb-1">Bespoke Event Quotation Requests ({quotesList.length})</h2>
              <p className="text-xs text-emerald-300/80">Incoming inquiries for large ceremonies, marquee tents, and institutions</p>

              {quotesList.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">No quotation requests submitted yet.</div>
              ) : (
                <div className="space-y-3">
                  {quotesList.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl bg-[#072416] border border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-purple-400">{q.quote_number}</span>
                          <span className="text-[10px] text-slate-400">[{new Date(q.created_at).toLocaleDateString()}]</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-0.5">{q.customer_name} ({q.phone})</h4>
                        <p className="text-xs text-slate-300 mt-1">{q.requirements}</p>
                        {q.budget && <div className="text-xs text-amber-400 font-bold mt-1">Client Budget: GH₵ {Number(q.budget).toLocaleString()}</div>}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={q.status}
                          onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value)}
                          className="text-xs px-2.5 py-1.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-200 font-bold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Sent">Sent</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inquiries Box */}
            <div className="glass-panel p-6 border border-emerald-900/60 space-y-4">
              <h2 className="text-xl font-bold text-white mb-1">Contact Page Inquiries ({inquiriesList.length})</h2>
              {inquiriesList.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">No inquiries recorded yet.</div>
              ) : (
                <div className="space-y-3">
                  {inquiriesList.map((inq) => (
                    <div key={inq.id} className="p-4 rounded-xl bg-[#072416] border border-emerald-800/60">
                      <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-emerald-900/40">
                        <span className="font-bold text-white">{inq.name} ({inq.phone})</span>
                        <span className="font-mono">{new Date(inq.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-200 mt-2">{inq.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER CRM */}
        {activeTab === 'customers' && (
          <div className="glass-panel p-6 border border-emerald-900/60 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Registered Customers & Campus Clients</h2>
                <p className="text-xs text-emerald-300/80">Review graduation institution profiles, order history and account statuses (FR-045)</p>
              </div>
              <button
                onClick={fetchCustomers}
                className="btn-secondary text-xs flex items-center gap-1.5 self-start"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Customers
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-emerald-200">
                <thead className="bg-[#072416] text-amber-400 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Campus / University</th>
                    <th className="p-3">Orders Placed</th>
                    <th className="p-3">Total Spend</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {customersList.map((c) => (
                    <tr key={c.id} className="hover:bg-emerald-950/40">
                      <td className="p-3 font-bold text-white">{c.name}</td>
                      <td className="p-3">{c.phone || c.email}</td>
                      <td className="p-3">{c.university || 'General Public'}</td>
                      <td className="p-3 font-bold text-white">{c.order_count}</td>
                      <td className="p-3 font-bold text-amber-400">GH₵ {Number(c.total_spent || 0).toLocaleString()}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleCustomerStatus(c.id, c.status)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                            c.status === 'active'
                              ? 'bg-red-950/40 text-red-300 hover:bg-red-900/50 border border-red-800/40'
                              : 'bg-emerald-600 text-white hover:bg-emerald-500'
                          }`}
                        >
                          {c.status === 'active' ? 'Suspend Account' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
