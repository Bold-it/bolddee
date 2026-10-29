import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Providers
import { ProductsProvider } from './context/ProductsContext';
import { CartProvider, useCart } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloatingCTA from './components/WhatsAppFloatingCTA';

// Pages (imitating FAM'S Apple Hub architecture)
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Faqs from './pages/Faqs';
import Legal from './pages/Legal';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';

// BOLDDEE Business Logic Modals
import SashCustomizerModal from './components/SashCustomizerModal';
import RentalCalendarModal from './components/RentalCalendarModal';
import BulkStudentOrderModal from './components/BulkStudentOrderModal';
import QuoteRequestModal from './components/QuoteRequestModal';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Inner App Content
function AppContent() {
  const { addItem, clearCart, items } = useCart();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/admin-login';

  // Modals state
  const [customizerProduct, setCustomizerProduct] = useState(null);
  const [rentalProduct, setRentalProduct] = useState(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Latest Completed Order
  const [recentOrder, setRecentOrder] = useState(null);

  // Handlers for Modals
  const handleOpenCustomizer = (product) => {
    setCustomizerProduct(product);
  };

  const handleOpenRental = (product) => {
    setRentalProduct(product);
  };

  const handleOpenBulkModal = () => {
    setIsBulkModalOpen(true);
  };

  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };

  const handleOpenOrderTracker = () => {
    setIsOrderTrackerOpen(true);
  };

  const handleOpenCheckoutModal = () => {
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#051a10] text-white">
      <ScrollToTop />

      {/* Global Navbar - Hidden on Admin routes */}
      {!isAdminRoute && (
        <Navbar
          onOpenOrderTracker={handleOpenOrderTracker}
          onOpenQuoteModal={handleOpenQuoteModal}
          onOpenBulkModal={handleOpenBulkModal}
        />
      )}

      {/* Main Routes Viewport */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onOpenCustomizer={handleOpenCustomizer}
                onOpenRental={handleOpenRental}
                onOpenBulkModal={handleOpenBulkModal}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <Shop
                onOpenCustomizer={handleOpenCustomizer}
                onOpenRental={handleOpenRental}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetails
                onOpenCustomizer={handleOpenCustomizer}
                onOpenRental={handleOpenRental}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                onOpenCheckoutModal={handleOpenCheckoutModal}
                onOpenQuoteModal={handleOpenQuoteModal}
              />
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/terms" element={<Legal />} />
          <Route path="/rental-terms" element={<Legal />} />
          <Route path="/privacy-policy" element={<Legal />} />
          <Route path="/refund-policy" element={<Legal />} />
          <Route
            path="/rentals"
            element={
              <Shop
                onOpenCustomizer={handleOpenCustomizer}
                onOpenRental={handleOpenRental}
              />
            }
          />
          <Route
            path="/grad"
            element={
              <Shop
                onOpenCustomizer={handleOpenCustomizer}
                onOpenRental={handleOpenRental}
              />
            }
          />
          <Route
            path="/moments"
            element={
              <Shop
                onOpenCustomizer={handleOpenCustomizer}
                onOpenRental={handleOpenRental}
              />
            }
          />
          <Route
            path="/events"
            element={
              <Shop
                onOpenCustomizer={handleOpenCustomizer}
                onOpenRental={handleOpenRental}
              />
            }
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Footer - Hidden on Admin routes */}
      {!isAdminRoute && <Footer />}

      {/* Floating WhatsApp CTA - Hidden on Admin routes */}
      {!isAdminRoute && <WhatsAppFloatingCTA />}

      {/* Interactive Modals */}
      {customizerProduct && (
        <SashCustomizerModal
          product={customizerProduct}
          onClose={() => setCustomizerProduct(null)}
          addToCart={(productWithCustomization) => {
            addItem(
              productWithCustomization,
              1,
              productWithCustomization.customization
            );
          }}
        />
      )}

      {rentalProduct && (
        <RentalCalendarModal
          product={rentalProduct}
          onClose={() => setRentalProduct(null)}
          addToCart={(productWithRental) => {
            addItem(
              productWithRental,
              productWithRental.rentalDetails?.quantity || 1,
              null,
              productWithRental.rentalDetails
            );
          }}
        />
      )}

      {isBulkModalOpen && (
        <BulkStudentOrderModal
          onClose={() => setIsBulkModalOpen(false)}
          addToCart={(bulkProduct) => {
            addItem(bulkProduct, 1);
          }}
        />
      )}

      {isQuoteModalOpen && (
        <QuoteRequestModal
          cartItems={items}
          onClose={() => setIsQuoteModalOpen(false)}
        />
      )}

      {isCheckoutModalOpen && (
        <CheckoutModal
          cartItems={items}
          onClose={() => setIsCheckoutModalOpen(false)}
          clearCart={clearCart}
          setRecentOrder={(order) => {
            setRecentOrder(order);
            setIsOrderTrackerOpen(true);
          }}
        />
      )}

      {isOrderTrackerOpen && (
        <div className="modal-overlay" onClick={() => setIsOrderTrackerOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-emerald-900/60 flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Live Order & Rental Status Tracking</h3>
              <button
                onClick={() => setIsOrderTrackerOpen(false)}
                className="text-emerald-400 hover:text-white text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-4">
              <OrderTrackerModal recentOrder={recentOrder} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </ProductsProvider>
  );
}
