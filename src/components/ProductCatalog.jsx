import React, { useState } from 'react';
import { Search, Filter, Sparkles, Calendar, ShoppingCart, Star, Check, Plus, Eye } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';

export default function ProductCatalog({ 
  currentPillar, 
  addToCart, 
  openCustomizer, 
  openRentalCalendar,
  openQuote
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Filter products by pillar, search, and category
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesPillar = currentPillar === 'ALL' || product.pillar === currentPillar;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;

    return matchesPillar && matchesSearch && matchesCategory;
  });

  // Extract unique categories for current pillar
  const categories = ['ALL', ...new Set(
    PRODUCTS
      .filter(p => currentPillar === 'ALL' || p.pillar === currentPillar)
      .map(p => p.category)
  )];

  const getPillarBadgeClass = (pillar) => {
    switch(pillar) {
      case 'BOLDDEE GRAD': return 'pillar-grad';
      case 'BOLDDEE RENTALS': return 'pillar-rentals';
      case 'BOLDDEE MOMENTS': return 'pillar-moments';
      case 'BOLDDEE EVENTS': return 'pillar-events';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-yellow-400 mb-2">
            <Sparkles className="w-4 h-4" /> Commercial Offerings & Equipment
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {currentPillar === 'ALL' ? 'ALL PRODUCTS & EVENT SERVICES' : currentPillar}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Browse personalized graduation items, equipment hire, photography packages, and full setups.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search stoles, tents, chairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-white pl-9 pr-4 py-2 rounded-xl text-xs border border-white/10 focus:border-yellow-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' 
                    : 'bg-slate-900/80 text-slate-400 border border-white/5 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl">
          <p className="text-slate-400 text-base font-semibold">No items match your search filter.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
            className="mt-4 btn-secondary text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="glass-panel bg-slate-900/90 rounded-2xl border border-white/10 hover:border-yellow-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 shadow-xl"
            >
              {/* Product Image & Badges */}
              <div className="relative h-48 sm:h-52 bg-slate-950 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Pillar Tag */}
                <div className="absolute top-3 left-3">
                  <span className={`pillar-badge ${getPillarBadgeClass(product.pillar)}`}>
                    {product.pillar}
                  </span>
                </div>

                {/* Special Tag / Badge */}
                {product.badge && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full shadow-md">
                    {product.badge}
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-yellow-300 font-bold bg-slate-950/80 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-yellow-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Pricing Details */}
                <div className="pt-2 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Price / Rate</div>
                    <div className="text-xl font-black text-yellow-400 flex items-baseline gap-1">
                      GH₵ {product.price.toLocaleString()}
                      <span className="text-[11px] font-normal text-slate-400">/{product.unit}</span>
                    </div>
                  </div>

                  {product.deposit && (
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">Security Deposit</div>
                      <div className="text-xs font-bold text-slate-300">GH₵ {product.deposit}</div>
                    </div>
                  )}
                </div>

                {/* Dynamic Action Buttons based on Product Type */}
                <div className="pt-1">
                  {product.isCustomizable ? (
                    <button 
                      onClick={() => openCustomizer(product)}
                      className="w-full btn-primary justify-center text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Customize Sash / Design
                    </button>
                  ) : product.isRental ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openRentalCalendar(product)}
                        className="flex-1 btn-secondary text-blue-300 border-blue-500/30 hover:bg-blue-500/10 justify-center text-xs"
                      >
                        <Calendar className="w-3.5 h-3.5 text-blue-400" /> Check Dates
                      </button>
                      <button 
                        onClick={() => addToCart(product)}
                        className="p-2.5 rounded-lg bg-yellow-500 text-slate-950 font-bold hover:bg-yellow-400 transition-colors"
                        title="Add to Cart"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : product.isService ? (
                    <button 
                      onClick={() => openQuote(product)}
                      className="w-full btn-secondary text-purple-300 border-purple-500/30 hover:bg-purple-500/10 justify-center text-xs"
                    >
                      Book / Request Quote
                    </button>
                  ) : (
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full btn-primary justify-center text-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Order
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </section>
  );
}
