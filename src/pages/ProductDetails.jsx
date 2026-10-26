import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  Calendar,
  Star,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';

export const ProductDetails = ({ onOpenCustomizer, onOpenRental }) => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addItem } = useCart();

  const product = products.find((p) => String(p.id) === String(id));
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
        <p className="text-emerald-300 text-sm mb-6">The requested item could not be found in our catalog.</p>
        <Link to="/shop">
          <button className="btn-gold text-sm py-2 px-6">Back to Shop Catalog</button>
        </Link>
      </div>
    );
  }

  const images = product.image_urls?.length
    ? product.image_urls
    : [product.image || '/images/custom_sash.jpg'];

  const handleAddToCart = () => {
    if (product.isCustomizable && onOpenCustomizer) {
      onOpenCustomizer(product);
      return;
    }
    if (product.isRental && onOpenRental) {
      onOpenRental(product);
      return;
    }

    addItem(product, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleWhatsAppContact = () => {
    const message = `Hello BOLDDEE RENTALS! I am interested in booking/ordering:\n\n*${product.name}*\nPrice: GH₵${Number(product.price).toLocaleString()} / ${product.unit || 'item'}\nCategory: ${product.pillar || product.category || 'General'}\n\nPlease confirm availability and booking details.`;
    const whatsappUrl = `https://wa.me/233546996210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-[#051a10]">
      <div className="container mx-auto max-w-6xl">
        {/* Back Link */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-amber-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>

        {/* Product Details Grid (matches FAM'S Apple Hub layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-[#082215] border border-emerald-900/60 shadow-xl relative">
              <img
                src={images[selectedImageIdx] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/rental_equipment.jpg';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-amber-400 text-black text-xs font-black px-3 py-1 rounded-md shadow-md uppercase">
                  {product.pillar || 'BOLDDEE'}
                </span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIdx === idx
                        ? 'border-amber-400 shadow-md scale-105'
                        : 'border-emerald-900/60 hover:border-emerald-600/60'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  {product.category || product.pillar}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-md ${
                    product.in_stock
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {product.in_stock ? 'In Stock / Ready' : 'Booked Out'}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-3 text-sm text-emerald-300/80">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold ml-1">{product.rating || 4.9}</span>
                </div>
                <span>•</span>
                <span>{product.reviewsCount || 48} Customer Reviews</span>
              </div>
            </div>

            {/* Price Banner */}
            <div className="glass-panel p-5 border border-emerald-900/60 flex items-baseline gap-2">
              <span className="text-4xl font-black text-amber-400">
                GH₵{Number(product.price).toLocaleString()}
              </span>
              <span className="text-emerald-300/80 text-sm font-semibold">
                / {product.unit || 'unit'}
              </span>
              {product.deposit && (
                <span className="ml-auto text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-md">
                  Security Deposit: GH₵{product.deposit}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Product Description & Specifications
              </h2>
              <p className="text-emerald-200/80 text-sm leading-relaxed">
                {product.description ||
                  'Professional equipment and bespoke apparel maintained to top standards by BOLDDEE RENTALS. Delivered on time with quality assurance.'}
              </p>
            </div>

            {/* Interactive Feature Buttons for Sash or Rental */}
            {product.isCustomizable && (
              <div className="p-4 rounded-xl border border-amber-400/40 bg-amber-950/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Customize Your Graduation Sash Live</span>
                </div>
                <p className="text-xs text-amber-200/80">
                  Choose university crest, satin base color, embroidery lettering, graduate name, and honors rank in 3D preview.
                </p>
                <button
                  onClick={() => onOpenCustomizer && onOpenCustomizer(product)}
                  className="btn-gold text-xs py-2 px-4 font-black"
                >
                  Open Sash Customizer
                </button>
              </div>
            )}

            {product.isRental && (
              <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Rental Availability & Security Deposit</span>
                </div>
                <p className="text-xs text-cyan-200/80">
                  Select your event date range. Multi-day discounts are automatically computed with refundable deposit tracking.
                </p>
                <button
                  onClick={() => onOpenRental && onOpenRental(product)}
                  className="btn-secondary text-xs py-2 px-4 font-bold border-cyan-500/40 text-cyan-200"
                >
                  Configure Event Dates
                </button>
              </div>
            )}

            {/* Added Toast Alert */}
            {addedToast && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Added to cart successfully!</span>
                <Link to="/cart" className="ml-auto underline font-bold text-amber-400">
                  View Cart
                </Link>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="w-full btn-gold text-base py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{product.isCustomizable ? 'Customize & Add to Cart' : 'Add to Shopping Cart'}</span>
              </button>

              <button
                onClick={handleWhatsAppContact}
                className="w-full btn-secondary text-base py-3.5 flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5 text-emerald-400" />
                <span>Chat with Representative on WhatsApp</span>
              </button>
            </div>

            {/* Delivery & Rental Information Card (matches FAM'S layout) */}
            <div className="glass-panel p-5 border border-emerald-900/60 space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-400" />
                <span>Delivery & Booking Policy</span>
              </h3>
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                Direct delivery to Ho Technical University, University of Ghana Legon, KNUST, UCC, and venues nationwide.
                Equipment setup and disassembly provided by our field technicians.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
