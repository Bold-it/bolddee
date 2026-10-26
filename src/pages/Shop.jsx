import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, Tent, Award, Camera, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';

export const Shop = ({ onOpenCustomizer, onOpenRental }) => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );

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
