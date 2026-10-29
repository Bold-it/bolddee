import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star, Calendar, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onOpenCustomizer, onOpenRental }) => {
  const { addItem } = useCart();

  const {
    id,
    name,
    price,
    original_price,
    unit = 'piece',
    pillar,
    category,
    image,
    image_urls,
    in_stock = true,
    rating = 4.9,
    reviewsCount = 48,
    isCustomizable,
    isRental,
    badge
  } = product;

  const displayImage = image || image_urls?.[0] || '/images/custom_sash.jpg';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCustomizable && onOpenCustomizer) {
      onOpenCustomizer(product);
      return;
    }

    if (isRental && onOpenRental) {
      onOpenRental(product);
      return;
    }

    addItem(product, 1);
  };

  return (
    <div className="group rounded-xl overflow-hidden border border-emerald-900/40 bg-[#0c271a] hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-400/10 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Image & Badges */}
        <Link to={`/product/${id}`} className="block relative aspect-square overflow-hidden bg-[#061e13]">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = '/images/rental_equipment.jpg';
            }}
          />

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {badge ? (
              <span className="bg-amber-400 text-black text-xs font-black px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                {badge}
              </span>
            ) : pillar ? (
              <span className="bg-emerald-900/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-2 py-0.5 rounded-md">
                {pillar}
              </span>
            ) : <span />}

            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-md ${
                in_stock
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {in_stock ? 'In Stock' : 'Booked'}
            </span>
          </div>

          {/* Bottom Badge for Customizable / Rental */}
          {(isCustomizable || isRental) && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {isCustomizable && (
                <span className="bg-amber-500/90 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Customizable Sash
                </span>
              )}
              {isRental && (
                <span className="bg-cyan-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" />
                  Equipment Rental
                </span>
              )}
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400/80">
            <span>{category || pillar}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{rating} ({reviewsCount})</span>
            </div>
          </div>

          <Link to={`/product/${id}`} className="block">
            <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors line-clamp-2">
              {name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="pt-1 flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-amber-400">
              GH₵{Number(price).toLocaleString()}
            </span>
            {Number(original_price) > Number(price) && (
              <span className="text-xs text-emerald-400/50 line-through">
                GH₵{Number(original_price).toLocaleString()}
              </span>
            )}
            <span className="text-xs text-emerald-300/70">
              / {unit}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={handleAddToCart}
          disabled={!in_stock}
          className="btn-gold text-xs py-2.5 px-2 flex items-center justify-center gap-1 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {isCustomizable ? 'Customize' : isRental ? 'Rent Now' : 'Add to Cart'}
        </button>

        <Link
          to={`/product/${id}`}
          className="btn-secondary text-xs py-2.5 px-2 flex items-center justify-center gap-1 font-semibold text-center"
        >
          <Eye className="w-3.5 h-3.5" />
          Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
