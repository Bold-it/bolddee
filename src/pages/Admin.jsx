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
  RefreshCw,
  Sparkles,
  Tag,
  ShoppingBag,
  Eye,
  Percent,
  ShieldAlert
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
    original_price: '',
    cost_price: '',
    unit: 'piece',
    pillar: 'BOLDDEE GRAD',
    category: 'Graduation Accessories',
    stock_quantity: 100,
    min_order_qty: 1,
    deposit: '',
    asset_prefix: '',
    badge: '',
    is_customizable: false,
    is_rental: false,
    is_service: false,
    inclusions: '',
    variants: '',
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
  const [depositsList, setDepositsList] = useState([]);
  const [loadingBackend, setLoadingBackend] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // Helper for Authorization Headers
  const getAuthHeaders = (tokenOverride) => {
    const token = tokenOverride || localStorage.getItem('bolddee_admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  // Ensure Admin Token with forced refresh capability
  const ensureAdminToken = async (forceRefresh = false) => {
    let token = localStorage.getItem('bolddee_admin_token');
    if (!token || forceRefresh) {
      try {
        const res = await fetch('/api/auth/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: 'bolddee2026' })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('bolddee_admin_token', data.token);
            token = data.token;
          }
        }
      } catch (err) {
        console.warn('Silent admin token fallback failed:', err);
      }
    }
    return token;
  };

  // Fetch Live Data Functions
  const fetchDashboard = async () => {
    setLoadingBackend(true);
    setBackendError(null);
    try {
      let token = await ensureAdminToken();
      let res = await fetch('/api/admin/dashboard', { headers: getAuthHeaders(token) });

      // If token expired or invalid, force refresh once and retry
      if (res.status === 401 || res.status === 403) {
        token = await ensureAdminToken(true);
        res = await fetch('/api/admin/dashboard', { headers: getAuthHeaders(token) });
      }

      if (res.ok) {
        const data = await res.json();
        setDashboardMetrics(data);
        setBackendError(null);
      } else {
        const errJson = await res.json().catch(() => ({}));
        setBackendError(errJson.error || `Server returned HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
      setBackendError(
        'Unable to connect to backend API server (http://localhost:5000). Please make sure the backend is running (`npm run server`).'
      );
    } finally {
      setLoadingBackend(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingBackend(true);
    try {
      let token = await ensureAdminToken();
      let res = await fetch('/api/orders', { headers: getAuthHeaders(token) });
      if (res.status === 401 || res.status === 403) {
        token = await ensureAdminToken(true);
        res = await fetch('/api/orders', { headers: getAuthHeaders(token) });
      }
      if (res.ok) {
        const data = await res.json();
        setOrdersList(data.orders || []);
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
    } finally {
      setLoadingBackend(false);
    }
  };

  const fetchAssets = async () => {
    setLoadingBackend(true);
    try {
      const res = await fetch('/api/rentals/assets');
      if (res.ok) {
        const data = await res.json();
        setAssetsList(data.assets || []);
      }
    } catch (err) {
      console.warn('Assets fetch error:', err);
    } finally {
      setLoadingBackend(false);
    }
  };

  const fetchQuotesAndInquiries = async () => {
    setLoadingBackend(true);
    try {
      let token = await ensureAdminToken();
      let [qRes, inqRes] = await Promise.all([
        fetch('/api/quotes', { headers: getAuthHeaders(token) }),
        fetch('/api/inquiries', { headers: getAuthHeaders(token) })
      ]);
      if (qRes.status === 401 || inqRes.status === 401) {
        token = await ensureAdminToken(true);
        [qRes, inqRes] = await Promise.all([
          fetch('/api/quotes', { headers: getAuthHeaders(token) }),
          fetch('/api/inquiries', { headers: getAuthHeaders(token) })
        ]);
      }
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
    } finally {
      setLoadingBackend(false);
    }
  };

  const fetchCustomers = async () => {
    setLoadingBackend(true);
    try {
      let token = await ensureAdminToken();
      let res = await fetch('/api/admin/customers', { headers: getAuthHeaders(token) });
      if (res.status === 401 || res.status === 403) {
        token = await ensureAdminToken(true);
        res = await fetch('/api/admin/customers', { headers: getAuthHeaders(token) });
      }
      if (res.ok) {
        const data = await res.json();
        setCustomersList(data.customers || []);
      }
    } catch (err) {
      console.warn('Customers fetch error:', err);
    } finally {
      setLoadingBackend(false);
    }
  };

  const fetchDeposits = async () => {
    setLoadingBackend(true);
    try {
      let token = await ensureAdminToken();
      let res = await fetch('/api/admin/deposits', { headers: getAuthHeaders(token) });
      if (res.status === 401 || res.status === 403) {
        token = await ensureAdminToken(true);
        res = await fetch('/api/admin/deposits', { headers: getAuthHeaders(token) });
      }
      if (res.ok) {
        const data = await res.json();
        setDepositsList(data.deposits || []);
      }
    } catch (err) {
      console.warn('Deposits fetch error:', err);
    } finally {
      setLoadingBackend(false);
    }
  };

  const handleSettleDeposit = async (orderId, deduction = 0, reason = '') => {
    try {
      let token = await ensureAdminToken();
      const res = await fetch(`/api/admin/deposits/${orderId}/release`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ deduction, reason })
      });
      if (res.ok) {
        fetchDeposits();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to settle security deposit');
      }
    } catch (err) {
      alert(err.message);
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
    if (activeTab === 'deposits') fetchDeposits();
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
    const origPriceNum = parseFloat(formData.original_price) || 0;
    const costPriceNum = parseFloat(formData.cost_price) || 0;
    const stockQtyNum = parseInt(formData.stock_quantity) || 100;
    const minOrderQtyNum = parseInt(formData.min_order_qty) || 1;
    const depositNum = parseFloat(formData.deposit) || 0;

    const finalImages = imageUrls.length > 0
      ? imageUrls
      : (formData.image.trim() ? [formData.image.trim()] : ['/images/custom_sash.jpg']);
    const primaryImage = finalImages[0];

    const isRentalAuto = formData.pillar === 'BOLDDEE RENTALS' || Boolean(formData.is_rental);
    const isServiceAuto = formData.pillar === 'BOLDDEE MOMENTS' || formData.pillar === 'BOLDDEE EVENTS' || Boolean(formData.is_service);
    const isCustomizableAuto = formData.pillar === 'BOLDDEE GRAD' && Boolean(formData.is_customizable);

    const productPayload = {
      name: formData.name,
      description: formData.description,
      price: priceNum,
      original_price: origPriceNum,
      cost_price: costPriceNum,
      unit: formData.unit,
      pillar: formData.pillar,
      category: formData.category,
      stock_quantity: stockQtyNum,
      min_order_qty: minOrderQtyNum,
      deposit: depositNum,
      asset_prefix: formData.asset_prefix ? formData.asset_prefix.trim().toUpperCase() : null,
      badge: formData.badge ? formData.badge.trim() : null,
      inclusions: formData.inclusions ? formData.inclusions.trim() : null,
      variants: formData.variants ? formData.variants.trim() : null,
      is_customizable: isCustomizableAuto,
      is_rental: isRentalAuto,
      is_service: isServiceAuto,
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
      original_price: '',
      cost_price: '',
      unit: 'piece',
      pillar: 'BOLDDEE GRAD',
      category: 'Graduation Accessories',
      stock_quantity: 100,
      min_order_qty: 1,
      deposit: '',
      asset_prefix: '',
      badge: '',
      is_customizable: false,
      is_rental: false,
      is_service: false,
      inclusions: '',
      variants: '',
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
      name: p.name || '',
      description: p.description || '',
      price: p.price ?? '',
      original_price: p.original_price ?? '',
      cost_price: p.cost_price ?? '',
      unit: p.unit || 'piece',
      pillar: p.pillar || 'BOLDDEE GRAD',
      category: p.category || 'General',
      stock_quantity: p.stock_quantity ?? 100,
      min_order_qty: p.min_order_qty ?? 1,
      deposit: p.deposit ?? '',
      asset_prefix: p.asset_prefix || '',
      badge: p.badge || '',
      is_customizable: Boolean(p.is_customizable || p.isCustomizable),
      is_rental: Boolean(p.is_rental || p.isRental),
      is_service: Boolean(p.is_service || p.isService),
      inclusions: p.inclusions || '',
      variants: typeof p.variants === 'object' ? JSON.stringify(p.variants) : (p.variants || ''),
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
      original_price: '',
      cost_price: '',
      unit: 'piece',
      pillar: 'BOLDDEE GRAD',
      category: 'Graduation Accessories',
      stock_quantity: 100,
      min_order_qty: 1,
      deposit: '',
      asset_prefix: '',
      badge: '',
      is_customizable: false,
      is_rental: false,
      is_service: false,
      inclusions: '',
      variants: '',
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

          <button
            onClick={() => setActiveTab('deposits')}
            className={`text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'deposits'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#082919] text-emerald-200 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security Deposits ({depositsList.length})</span>
          </button>
        </div>

        {/* TAB 0: KPI OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-emerald-900/40">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Live Operational Performance</span>
                  {dashboardMetrics && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Feed Active
                    </span>
                  )}
                </h2>
                <p className="text-xs text-emerald-300/70">
                  Real-time transaction volumes, cash collections, and equipment utilization.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDashboard}
                  disabled={loadingBackend}
                  className="text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 bg-[#082919] hover:bg-emerald-900/60 text-emerald-200 hover:text-white border border-emerald-800/80 transition-all disabled:opacity-50 font-semibold"
                  title="Refresh KPI Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingBackend ? 'animate-spin text-amber-400' : 'text-amber-400'}`} />
                  <span>{loadingBackend ? 'Refreshing...' : 'Refresh KPIs'}</span>
                </button>
              </div>
            </div>

            {loadingBackend && !dashboardMetrics && (
              <div className="text-center py-16 glass-panel rounded-xl border border-emerald-900/60">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
                <p className="text-slate-200 font-bold text-base">Loading live operational KPIs...</p>
                <p className="text-xs text-emerald-400/80 mt-1">Connecting to backend service on port 5000...</p>
              </div>
            )}

            {backendError && !dashboardMetrics && (
              <div className="glass-panel p-6 border border-rose-500/40 rounded-xl bg-rose-950/20 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-rose-200">Backend Connection Error</h3>
                    <p className="text-xs text-rose-300/90 mt-1">{backendError}</p>
                    <p className="text-xs text-slate-300 mt-2">
                      The backend API service must be running. If the server is offline, run:
                      <code className="ml-1.5 px-2 py-0.5 rounded bg-black/60 font-mono text-amber-400 text-xs">npm run server</code>
                      <span className="text-slate-400 ml-1">or run</span>
                      <code className="ml-1.5 px-2 py-0.5 rounded bg-black/60 font-mono text-amber-400 text-xs">npm run dev:all</code>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-rose-500/20">
                  <button
                    onClick={fetchDashboard}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Connection</span>
                  </button>
                  <button
                    onClick={() => {
                      setDashboardMetrics({
                        metrics: {
                          salesToday: 0,
                          totalSales: 2010,
                          pendingOrders: 2,
                          inProduction: 1,
                          activeRentals: 1,
                          pendingQuotes: 0,
                          outstandingBalances: 240,
                          lowStockItems: 4,
                          maintenanceCount: 1,
                          totalCustomers: 1
                        },
                        categoryBreakdown: [
                          { pillar: 'BOLDDEE EVENTS', count: 1 },
                          { pillar: 'BOLDDEE GRAD', count: 4 },
                          { pillar: 'BOLDDEE MOMENTS', count: 3 },
                          { pillar: 'BOLDDEE RENTALS', count: 5 }
                        ],
                        recentOrders: [
                          {
                            id: 'sample-gate-1',
                            order_number: 'BD-SAMPLE-001',
                            customer_name: 'Sample Customer',
                            total_amount: 350,
                            deposit_paid: 200,
                            balance_due: 150,
                            payment_status: 'Deposit Paid',
                            order_status: 'In Production',
                            created_at: new Date().toISOString()
                          }
                        ]
                      });
                      setBackendError(null);
                    }}
                    className="btn-secondary text-xs py-2 px-3 border-emerald-700/60 text-emerald-300 hover:text-white"
                  >
                    View Sample Preview
                  </button>
                </div>
              </div>
            )}

            {dashboardMetrics && (
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
            )}
          </div>
        )}

        {/* TAB 1: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-10">
            {/* Add / Edit Form + Live Storefront Preview (Split Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: UPGRADED PRODUCT CREATION / EDIT FORM */}
              <div className="lg:col-span-7 xl:col-span-8 glass-panel p-6 border border-emerald-900/60 rounded-xl space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-amber-400" />
                    <span>{editingId ? 'Edit Product Item' : 'Create & Publish New Product'}</span>
                  </h2>
                  <p className="text-xs text-emerald-300/70">
                    Configure warehouse inventory, context-aware pillar rules, pricing tiers, and merchandising variants.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* SECTION 1: BASIC INFORMATION */}
                  <div className="border border-emerald-900/40 rounded-xl p-4 bg-[#072416]/40 space-y-4">
                    <h3 className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>1. Core Identification & Category</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-emerald-200 mb-1">Product Title *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. VIP Custom Gold Sash or 20x40 High-Peak Canopy"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-emerald-200 mb-1">Operational Pillar</label>
                        <select
                          value={formData.pillar}
                          onChange={(e) => {
                            const newPillar = e.target.value;
                            let defaultCategory = formData.category;
                            if (newPillar === 'BOLDDEE GRAD') defaultCategory = 'Graduation Accessories';
                            else if (newPillar === 'BOLDDEE RENTALS') defaultCategory = 'Tents & Canopies';
                            else if (newPillar === 'BOLDDEE MOMENTS') defaultCategory = 'Portrait & Studio';
                            else if (newPillar === 'BOLDDEE EVENTS') defaultCategory = 'Audio & Staging';

                            setFormData({
                              ...formData,
                              pillar: newPillar,
                              category: defaultCategory,
                              is_customizable: newPillar === 'BOLDDEE GRAD',
                              is_rental: newPillar === 'BOLDDEE RENTALS',
                              is_service: newPillar === 'BOLDDEE MOMENTS' || newPillar === 'BOLDDEE EVENTS',
                              unit: newPillar === 'BOLDDEE RENTALS' ? 'day' : (newPillar === 'BOLDDEE GRAD' ? 'piece' : 'event')
                            });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none font-semibold"
                        >
                          <option value="BOLDDEE GRAD">BOLDDEE GRAD (Apparel & Custom Sashes)</option>
                          <option value="BOLDDEE RENTALS">BOLDDEE RENTALS (Heavy Equipment & Canopies)</option>
                          <option value="BOLDDEE MOMENTS">BOLDDEE MOMENTS (Photography & Videography)</option>
                          <option value="BOLDDEE EVENTS">BOLDDEE EVENTS (Audio, Staging & Full Production)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-emerald-200 mb-1">Catalog Category</label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="e.g. Chairs, Canopies, Sound Systems, Sashes"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-emerald-200 mb-1">Pricing Unit</label>
                        <input
                          type="text"
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          placeholder="e.g. piece, day, event, set, hour"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: PRICING, MARGINS & INVENTORY CONTROLS */}
                  <div className="border border-emerald-900/40 rounded-xl p-4 bg-[#072416]/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>2. Warehouse Inventory & Financial Controls</span>
                      </h3>
                      {formData.price && formData.cost_price && Number(formData.price) > 0 && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Estimated Profit: GH₵{(Number(formData.price) - Number(formData.cost_price)).toFixed(2)} (
                          {(((Number(formData.price) - Number(formData.cost_price)) / Number(formData.price)) * 100).toFixed(0)}% margin)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-emerald-200 mb-1">Selling Price (GH₵) *</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="e.g. 150.00"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none font-bold text-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-emerald-200 mb-1">
                          Was Price (GH₵) <span className="text-slate-400 font-normal">(Strikethrough)</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.original_price}
                          onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                          placeholder="e.g. 195.00"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-emerald-200 mb-1">
                          Internal Cost (GH₵) <span className="text-slate-400 font-normal">(Admin Only)</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.cost_price}
                          onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                          placeholder="e.g. 65.00"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-emerald-200 mb-1">
                          Total Warehouse Stock Quantity
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stock_quantity}
                          onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                          placeholder="100"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                        <p className="text-[10px] text-emerald-400/70 mt-1">
                          Total physical units ready to book or sell
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-emerald-200 mb-1">
                          Minimum Order Quantity (MOQ)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.min_order_qty}
                          onChange={(e) => setFormData({ ...formData, min_order_qty: e.target.value })}
                          placeholder="1"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                        <p className="text-[10px] text-emerald-400/70 mt-1">
                          Minimum quantity a customer can add to cart
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: CONTEXT-AWARE DYNAMIC PILLAR SETTINGS */}
                  <div className="border border-emerald-800/60 rounded-xl p-4 bg-[#082819] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>3. Dynamic Pillar Settings: {formData.pillar}</span>
                      </h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                        Context-Adaptive
                      </span>
                    </div>

                    {/* PILLAR: BOLDDEE RENTALS */}
                    {formData.pillar === 'BOLDDEE RENTALS' && (
                      <div className="space-y-4 bg-[#051a10] p-3.5 rounded-lg border border-emerald-700/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-emerald-200 mb-1">
                              Refundable Security Deposit (GH₵ / Unit)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.deposit}
                              onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                              placeholder="e.g. 50.00"
                              className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-cyan-400 focus:outline-none font-bold text-cyan-300"
                            />
                            <p className="text-[10px] text-slate-300 mt-1">
                              Held in escrow at checkout; released post-event inspection.
                            </p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-emerald-200 mb-1">
                              Asset Code Prefix (Serial Tracking)
                            </label>
                            <input
                              type="text"
                              maxLength="5"
                              value={formData.asset_prefix}
                              onChange={(e) => setFormData({ ...formData, asset_prefix: e.target.value.toUpperCase() })}
                              placeholder="e.g. CHR, TNT, AUD, STG"
                              className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-cyan-400 focus:outline-none uppercase font-mono font-bold tracking-wider"
                            />
                            <p className="text-[10px] text-slate-300 mt-1">
                              Auto-generates individual barcode units in Rental Assets registry!
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.is_rental}
                              onChange={(e) => setFormData({ ...formData, is_rental: e.target.checked })}
                              className="rounded accent-cyan-400"
                            />
                            <span>Enable Real-Time Calendar Date Picker & Availability Gate</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* PILLAR: BOLDDEE GRAD */}
                    {formData.pillar === 'BOLDDEE GRAD' && (
                      <div className="space-y-4 bg-[#051a10] p-3.5 rounded-lg border border-emerald-700/50">
                        <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.is_customizable}
                            onChange={(e) => setFormData({ ...formData, is_customizable: e.target.checked })}
                            className="rounded accent-amber-400"
                          />
                          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            Enable Interactive Visual Sash Customizer (Font, Trims, Crest & Text)
                          </span>
                        </label>
                        <p className="text-[11px] text-emerald-300/80">
                          When checked, storefront displays "Customize" button and launches the 3D/canvas sash designer for graduation clients.
                        </p>
                      </div>
                    )}

                    {/* PILLAR: BOLDDEE MOMENTS or EVENTS */}
                    {(formData.pillar === 'BOLDDEE MOMENTS' || formData.pillar === 'BOLDDEE EVENTS') && (
                      <div className="space-y-4 bg-[#051a10] p-3.5 rounded-lg border border-emerald-700/50">
                        <div>
                          <label className="block text-xs font-bold text-emerald-200 mb-1">
                            Package Deliverables & Inclusions
                          </label>
                          <textarea
                            rows={2}
                            value={formData.inclusions}
                            onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                            placeholder="e.g. 2 Professional Sound Technicians, 4 Wireless Microphones, Setup & Teardown, 8 Hours Active Coverage"
                            className="w-full px-3.5 py-2 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-xs focus:border-amber-400 focus:outline-none"
                          />
                          <p className="text-[10px] text-slate-300 mt-1">
                            Displayed on product details as bulleted features.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 4: MERCHANDISING & BADGES */}
                  <div className="border border-emerald-900/40 rounded-xl p-4 bg-[#072416]/40 space-y-4">
                    <h3 className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>4. Merchandising, Badges & Variants</span>
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-emerald-200 mb-1">
                        Promotional Storefront Badge
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {['', 'BEST SELLER', 'POPULAR', 'NEW 2026', 'HOT RENTAL', 'LIMITED SLOTS'].map((badgePreset) => (
                          <button
                            key={badgePreset}
                            type="button"
                            onClick={() => setFormData({ ...formData, badge: badgePreset })}
                            className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all ${
                              formData.badge === badgePreset
                                ? 'bg-amber-400 text-black shadow-md'
                                : 'bg-[#051a10] text-emerald-300 border border-emerald-800/60 hover:border-amber-400/40'
                            }`}
                          >
                            {badgePreset === '' ? 'None' : badgePreset}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value.toUpperCase() })}
                        placeholder="Or custom badge (e.g. FLASH SALE, 20% OFF)"
                        className="w-full px-3.5 py-2 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-200 mb-1">
                        Product Variants / Colors / Sizes
                      </label>
                      <input
                        type="text"
                        value={formData.variants}
                        onChange={(e) => setFormData({ ...formData, variants: e.target.value })}
                        placeholder="e.g. Royal Blue & Gold, Emerald Green & Gold, White & Red"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white text-sm focus:border-amber-400 focus:outline-none"
                      />
                      <p className="text-[10px] text-emerald-400/70 mt-1">
                        Comma-separated options presented to shoppers on the product page.
                      </p>
                    </div>
                  </div>

                  {/* SECTION 5: IMAGE UPLOAD & GALLERY MANAGER */}
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

                  {/* SECTION 6: DESCRIPTION & VISIBILITY */}
                  <div>
                    <label className="block text-xs font-bold text-emerald-200 mb-1">Product Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed specifications, dimensions, material quality, and usage guidelines..."
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
                      <span>Feature on Storefront Homepage</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.in_stock}
                        onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                        className="rounded accent-amber-400"
                      />
                      <span>Available / In Stock for Instant Order</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="submit" className="btn-gold text-sm py-2.5 px-6">
                      {editingId ? 'Save Changes' : 'Publish Product to Storefront'}
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

              {/* RIGHT COLUMN: REAL-TIME STOREFRONT CARD PREVIEW */}
              <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-4">
                <div className="glass-panel p-5 border border-emerald-800/60 rounded-xl">
                  <div className="flex items-center justify-between mb-3 border-b border-emerald-900/60 pb-2">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <Eye className="w-4 h-4" />
                      <span>Live Storefront Preview</span>
                    </div>
                    <span className="text-[10px] text-emerald-300/80 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/50">
                      Real-Time Sync
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 mb-4">
                    This is the exact card design shoppers see while browsing your catalog on desktop & mobile:
                  </p>

                  {/* THE LIVE PREVIEW CARD */}
                  <div className="group rounded-xl overflow-hidden border border-emerald-800/80 bg-[#0c271a] shadow-xl">
                    {/* Image Area */}
                    <div className="relative aspect-square overflow-hidden bg-[#061e13]">
                      <img
                        src={
                          imageUrls[0] ||
                          (formData.image.trim() ? formData.image.trim() : (
                            formData.pillar === 'BOLDDEE RENTALS'
                              ? '/images/rental_equipment.jpg'
                              : '/images/custom_sash.jpg'
                          ))
                        }
                        alt={formData.name || 'Product Preview'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/rental_equipment.jpg';
                        }}
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        {formData.badge ? (
                          <span className="bg-amber-400 text-black text-xs font-black px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                            {formData.badge}
                          </span>
                        ) : formData.pillar ? (
                          <span className="bg-emerald-900/90 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-2 py-0.5 rounded-md">
                            {formData.pillar}
                          </span>
                        ) : <span />}

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-md ${
                            formData.in_stock
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {formData.in_stock ? 'In Stock' : 'Booked'}
                        </span>
                      </div>

                      {/* Bottom Feature Badges */}
                      <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                        {(formData.pillar === 'BOLDDEE GRAD' && formData.is_customizable) && (
                          <span className="bg-amber-500/90 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Customizable Sash
                          </span>
                        )}
                        {(formData.pillar === 'BOLDDEE RENTALS' || formData.is_rental) && (
                          <span className="bg-cyan-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />
                            Equipment Rental
                          </span>
                        )}
                        {(formData.pillar === 'BOLDDEE MOMENTS' || formData.pillar === 'BOLDDEE EVENTS' || formData.is_service) && (
                          <span className="bg-purple-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                            <Layers className="w-2.5 h-2.5" />
                            Service Package
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-emerald-400/80">
                        <span>{formData.category || formData.pillar}</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>5.0 (New)</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-white text-base line-clamp-2">
                        {formData.name || 'Untitled Product Item'}
                      </h4>

                      {/* Pricing with Strikethrough */}
                      <div className="pt-1 flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl font-black text-amber-400">
                          GH₵{formData.price ? Number(formData.price).toLocaleString() : '0.00'}
                        </span>
                        {formData.original_price && Number(formData.original_price) > Number(formData.price || 0) && (
                          <span className="text-xs text-emerald-400/50 line-through">
                            GH₵{Number(formData.original_price).toLocaleString()}
                          </span>
                        )}
                        <span className="text-xs text-emerald-300/70">
                          / {formData.unit || 'piece'}
                        </span>
                      </div>

                      {/* Inclusions or Variants preview */}
                      {formData.variants && (
                        <div className="text-[11px] text-slate-300 pt-1">
                          <span className="text-emerald-400 font-semibold">Variants: </span>
                          <span>{formData.variants}</span>
                        </div>
                      )}
                    </div>

                    {/* Simulated Card Action Buttons */}
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
                      <button
                        type="button"
                        disabled={!formData.in_stock}
                        className="btn-gold text-xs py-2.5 px-2 flex items-center justify-center gap-1 font-bold pointer-events-none"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {formData.pillar === 'BOLDDEE GRAD' && formData.is_customizable
                          ? 'Customize'
                          : (formData.pillar === 'BOLDDEE RENTALS' || formData.is_rental)
                          ? 'Rent Now'
                          : 'Add to Cart'}
                      </button>

                      <button
                        type="button"
                        className="btn-secondary text-xs py-2.5 px-2 flex items-center justify-center gap-1 font-semibold text-center pointer-events-none"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </div>
                  </div>

                  {/* ADMIN UNIT ECONOMICS & METRICS */}
                  <div className="mt-4 p-3.5 rounded-lg bg-[#072416] border border-emerald-900/60 text-xs space-y-2">
                    <span className="text-amber-400 font-bold block text-[11px] uppercase tracking-wider">
                      Confidential Financial Breakdown
                    </span>
                    <div className="flex justify-between text-slate-300">
                      <span>Listing Price:</span>
                      <strong className="text-white">GH₵{Number(formData.price || 0).toFixed(2)}</strong>
                    </div>
                    {formData.cost_price && (
                      <div className="flex justify-between text-slate-300">
                        <span>Direct Cost:</span>
                        <strong className="text-rose-400">GH₵{Number(formData.cost_price).toFixed(2)}</strong>
                      </div>
                    )}
                    {formData.price && formData.cost_price && (
                      <div className="flex justify-between text-emerald-300 font-bold border-t border-emerald-900/40 pt-1">
                        <span>Gross Profit / Unit:</span>
                        <span className="text-emerald-400">
                          GH₵{(Number(formData.price) - Number(formData.cost_price)).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {formData.deposit && Number(formData.deposit) > 0 && (
                      <div className="flex justify-between text-cyan-300 border-t border-emerald-900/40 pt-1">
                        <span>Escrow Deposit:</span>
                        <strong>GH₵{Number(formData.deposit).toFixed(2)}</strong>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400 border-t border-emerald-900/40 pt-1">
                      <span>Stock Inventory Value:</span>
                      <strong className="text-white">
                        GH₵{(Number(formData.price || 0) * Number(formData.stock_quantity || 0)).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
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

        {/* TAB 6: SECURITY DEPOSITS ESCROW (FR-024) */}
        {activeTab === 'deposits' && (
          <div className="glass-panel p-6 border border-emerald-900/60 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Refundable Security Deposits & Damage Escrow</span>
                </h2>
                <p className="text-xs text-emerald-300/80">
                  Track held damage deposits for rental equipment, record return inspections, and release or deduct refunds post-event.
                </p>
              </div>
              <button
                onClick={fetchDeposits}
                className="btn-secondary text-xs flex items-center gap-1.5 self-start"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Deposits
              </button>
            </div>

            {depositsList.length === 0 ? (
              <div className="p-8 text-center bg-[#072416] rounded-xl border border-emerald-800/60">
                <ShieldCheck className="w-8 h-8 text-amber-400/50 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">No security deposits on file yet.</p>
                <p className="text-xs text-emerald-400/70 mt-1">
                  When customers book rental gear (canopies, chairs, sound gear), their damage deposits are held here in escrow.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-emerald-200">
                  <thead className="bg-[#072416] text-amber-400 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-3">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Event Date</th>
                      <th className="p-3">Total Held</th>
                      <th className="p-3">Deducted</th>
                      <th className="p-3">Refunded</th>
                      <th className="p-3">Escrow Status</th>
                      <th className="p-3 text-right">Settlement Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/60">
                    {depositsList.map((d) => (
                      <tr key={d.id} className="hover:bg-emerald-950/40">
                        <td className="p-3 font-mono font-bold text-amber-400">{d.order_number}</td>
                        <td className="p-3">
                          <strong className="text-white block">{d.customer_name}</strong>
                          <span className="text-[10px] text-emerald-400/70">{d.phone || d.email}</span>
                        </td>
                        <td className="p-3">{d.event_date || 'N/A'}</td>
                        <td className="p-3 font-bold text-amber-300">GH₵ {Number(d.total_deposit).toLocaleString()}</td>
                        <td className="p-3 text-rose-300">GH₵ {Number(d.deducted_amount || 0).toLocaleString()}</td>
                        <td className="p-3 text-emerald-300">GH₵ {Number(d.refunded_amount || 0).toLocaleString()}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              d.status === 'Held'
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : d.status === 'Refunded'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {d.status === 'Held' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSettleDeposit(d.order_id, 0, 'Equipment returned in 100% pristine condition')}
                                className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                                title="Release Full Deposit without deductions"
                              >
                                Release Full Deposit
                              </button>
                              <button
                                onClick={() => {
                                  const amt = prompt(`Enter damage deduction amount in GH₵ (Max: ${d.total_deposit}):`, '50');
                                  if (amt !== null) {
                                    const parsed = parseFloat(amt);
                                    if (isNaN(parsed) || parsed < 0 || parsed > d.total_deposit) {
                                      alert('Invalid deduction amount');
                                      return;
                                    }
                                    const reason = prompt('Reason for deduction (e.g. Broken canopy pole, 2 missing chairs):', 'Damaged equipment upon return');
                                    handleSettleDeposit(d.order_id, parsed, reason || 'Damage deduction');
                                  }
                                }}
                                className="px-2 py-1 rounded text-[10px] font-bold bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-800/60"
                              >
                                Deduct Damage
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Settled on {new Date(d.settled_at || d.created_at).toLocaleDateString()}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
