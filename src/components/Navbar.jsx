import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, FileText, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar = ({ onOpenOrderTracker, onOpenQuoteModal, onOpenBulkModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-900/40 bg-[#051a10]/95 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo with Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="BOLDDEE RENTALS"
              className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-amber-400' : 'text-emerald-100 hover:text-amber-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-sm font-semibold transition-colors ${
                isActive('/shop') ? 'text-amber-400' : 'text-emerald-100 hover:text-amber-400'
              }`}
            >
              Shop
            </Link>
            <Link
              to="/how-it-works"
              className={`text-sm font-semibold transition-colors ${
                isActive('/how-it-works') ? 'text-amber-400' : 'text-emerald-100 hover:text-amber-400'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/about"
              className={`text-sm font-semibold transition-colors ${
                isActive('/about') ? 'text-amber-400' : 'text-emerald-100 hover:text-amber-400'
              }`}
            >
              About Us
            </Link>
            {onOpenBulkModal && (
              <button
                onClick={onOpenBulkModal}
                className="text-sm font-semibold text-emerald-100 hover:text-amber-400 transition-colors"
              >
                Bulk Orders
              </button>
            )}
            {onOpenQuoteModal && (
              <button
                onClick={onOpenQuoteModal}
                className="text-sm font-semibold text-emerald-100 hover:text-amber-400 transition-colors flex items-center gap-1.5"
              >
                <FileText className="h-4 w-4 text-amber-400" />
                Quote
              </button>
            )}
            {onOpenOrderTracker && (
              <button
                onClick={onOpenOrderTracker}
                className="text-sm font-semibold text-emerald-100 hover:text-amber-400 transition-colors flex items-center gap-1.5"
              >
                <Search className="h-4 w-4 text-emerald-400" />
                Track Order
              </button>
            )}
            <Link
              to="/contact"
              className={`text-sm font-semibold transition-colors ${
                isActive('/contact') ? 'text-amber-400' : 'text-emerald-100 hover:text-amber-400'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Action Icons: Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/cart">
              <button className="relative p-2.5 rounded-xl border border-emerald-800/60 bg-[#0c271a] hover:border-amber-400/60 text-emerald-200 hover:text-amber-400 transition-all">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-black shadow-lg">
                    {itemCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2.5 rounded-xl border border-emerald-800/60 bg-[#0c271a] text-emerald-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-900/60 space-y-3 bg-[#051a10]">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                isActive('/') ? 'text-amber-400 bg-emerald-900/30' : 'text-emerald-100 hover:text-amber-400'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                isActive('/shop') ? 'text-amber-400 bg-emerald-900/30' : 'text-emerald-100 hover:text-amber-400'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Shop Catalog
            </Link>
            <Link
              to="/how-it-works"
              className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                isActive('/how-it-works') ? 'text-amber-400 bg-emerald-900/30' : 'text-emerald-100 hover:text-amber-400'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                isActive('/about') ? 'text-amber-400 bg-emerald-900/30' : 'text-emerald-100 hover:text-amber-400'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            {onOpenBulkModal && (
              <button
                className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-emerald-100 hover:text-amber-400"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenBulkModal();
                }}
              >
                Class Bulk Orders
              </button>
            )}
            {onOpenQuoteModal && (
              <button
                className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-emerald-100 hover:text-amber-400 flex items-center gap-2"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenQuoteModal();
                }}
              >
                <FileText className="h-4 w-4 text-amber-400" />
                Request Instant Quote
              </button>
            )}
            {onOpenOrderTracker && (
              <button
                className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-emerald-100 hover:text-amber-400 flex items-center gap-2"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenOrderTracker();
                }}
              >
                <Search className="h-4 w-4 text-emerald-400" />
                Track Order Status
              </button>
            )}
            <Link
              to="/contact"
              className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                isActive('/contact') ? 'text-amber-400 bg-emerald-900/30' : 'text-emerald-100 hover:text-amber-400'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
