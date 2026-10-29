import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, Tent, Award, Camera, Check, Calendar, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';

export const Shop = ({ onOpenCustomizer, onOpenRental }) => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );

  // Live Event Date Filter
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [filterStartDate, setFilterStartDate] = useState(tomorrow);
  const [filterEndDate, setFilterEndDate] = useState(dayAfter);
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'BOLDDEE RENTALS', label: 'Tents & Chairs' },
    { id: 'BOLDDEE GRAD', label: 'Graduation Sashes' },
    { id: 'BOLDDEE MOMENTS', label: 'Photography & 360' },
    { id: 'BOLDDEE EVENTS', label: 'Event Décor Packages' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.toLowerCase().includes(search.toLowerCase()) ||
      product.pillar?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      product.pillar === selectedCategory ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-12 px-4 bg-[#051a10]">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-2">
            BOLDDEE Official Storefront
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
            Shop Rentals & Graduation Apparel
          </h1>
          <p className="text-emerald-200/80 text-sm md:text-base max-w-2xl">
            Book certified event equipment or customize your bespoke graduation stoles with instant online checkout and WhatsApp order confirmations.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="glass-panel p-4 md:p-6 mb-8 border border-emerald-900/60 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
            <input
              type="text"
              placeholder="Search products, tents, sashes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#072416] border border-emerald-800/60 text-white placeholder-emerald-400/50 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Category Dropdown & Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'bg-[#082919] text-emerald-200 hover:text-white hover:bg-emerald-850 border border-emerald-800/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real-Time Event Date & Stock Availability Checker Bar */}
        {(selectedCategory === 'all' || selectedCategory === 'BOLDDEE RENTALS' || selectedCategory === 'BOLDDEE EVENTS') && (
          <div className="glass-panel p-4 mb-8 border border-emerald-800/60 rounded-xl bg-[#072416]/70 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Real-Time Rental Date & Stock Availability</span>
                <span className="text-[11px] text-emerald-300/80">
                  Select your event dates to check real-time warehouse inventory and guard against date conflicts.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-[#03150c] border border-emerald-800/80 rounded-lg px-2.5 py-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400">From:</span>
                <input
                  type="date"
                  value={filterStartDate}
                  min={tomorrow}
                  onChange={(e) => {
                    setFilterStartDate(e.target.value);
                    setIsDateFilterActive(true);
                  }}
                  className="bg-transparent text-white text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 bg-[#03150c] border border-emerald-800/80 rounded-lg px-2.5 py-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400">To:</span>
                <input
                  type="date"
                  value={filterEndDate}
                  min={filterStartDate}
                  onChange={(e) => {
                    setFilterEndDate(e.target.value);
                    setIsDateFilterActive(true);
                  }}
                  className="bg-transparent text-white text-xs focus:outline-none"
                />
              </div>

              {isDateFilterActive && (
                <button
                  onClick={() => setIsDateFilterActive(false)}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1"
                >
                  Clear Dates
                </button>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="glass-panel py-20 px-4 text-center space-y-4 max-w-md mx-auto">
            <p className="text-lg text-emerald-300 font-semibold">No equipment found.</p>
            <p className="text-xs text-emerald-400/70">
              Try adjusting your search query or reset the filter category.
            </p>
            <button
              onClick={() => {
                setSearch('');
                handleCategoryChange('all');
              }}
              className="btn-gold text-xs py-2 px-5"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenCustomizer={onOpenCustomizer}
                onOpenRental={onOpenRental}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
