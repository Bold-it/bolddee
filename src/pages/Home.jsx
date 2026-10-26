import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Package,
  Truck,
  Star,
  Sparkles,
  Award,
  Tent,
  Camera,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import { CAMPAIGNS } from '../data/mockData';

export const Home = ({ onOpenCustomizer, onOpenRental, onOpenBulkModal }) => {
  const { products } = useProducts();
  const featuredProducts = products.filter((p) => p.featured && p.in_stock).slice(0, 6);

  const categories = [
    {
      name: 'BOLDDEE RENTALS',
      label: 'Tents, Chairs & Sound',
      description: 'Marquee tents, gold Chiavari chairs, banquet tables, modular stages & PA systems.',
      icon: <Tent className="h-8 w-8 text-amber-400" />,
      color: 'from-emerald-950 to-[#072416]'
    },
    {
      name: 'BOLDDEE GRAD',
      label: 'Graduation Sashes & Medals',
      description: 'Custom hand-woven and gold embroidered stoles, honor medals & degree certificate frames.',
      icon: <Award className="h-8 w-8 text-amber-400" />,
      color: 'from-amber-950/40 to-[#072416]'
    },
    {
      name: 'BOLDDEE MOMENTS',
      label: 'Photoshoot & 360 Booth',
      description: 'Studio graduate portraits, 4K cinema event videography & 360 spin photo booth rental.',
      icon: <Camera className="h-8 w-8 text-amber-400" />,
      color: 'from-purple-950/40 to-[#072416]'
    },
    {
      name: 'BOLDDEE EVENTS',
      label: 'Full Décor & VIP Setup',
      description: 'Complete event backdrop photo walls, balloon arches, floral centerpieces & lighting.',
      icon: <Sparkles className="h-8 w-8 text-amber-400" />,
      color: 'from-emerald-950 to-[#072416]'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 md:py-24 px-4 border-b border-emerald-900/60 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Column: Heading & CTAs */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>We Make Your Moments Worthwhile</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                Ghana's Premier Event Rentals & <span className="gold-gradient-text">Graduation Hub</span>
              </h1>

              <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl leading-relaxed">
                Premium high-peak marquee canopies, royal Chiavari chairs, pro sound staging,
                personalized custom graduation sashes, and studio photography tailored for your milestones.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/shop">
                  <button className="btn-gold text-base py-3.5 px-8 shadow-lg">
                    Browse All Products
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="btn-secondary text-base py-3.5 px-8">
                    Contact Us
                  </button>
                </Link>
                {onOpenBulkModal && (
                  <button
                    onClick={onOpenBulkModal}
                    className="btn-emerald text-base py-3.5 px-6 hidden sm:inline-flex"
                  >
                    Bulk Class Sashes
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Feature / Trust Card (matches FAM'S layout) */}
            <div className="flex-1 w-full max-w-md">
              <div className="glass-panel p-8 border border-emerald-500/20 shadow-2xl relative">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-800/40">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Verified BOLDDEE Quality</h3>
                    <p className="text-xs text-emerald-300/80">Trusted by Universities & Event Planners</p>
                  </div>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-800/50 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Clean, Heavy-Duty Equipment</h4>
                      <p className="text-xs text-emerald-300/70">Weather-proof tents & pristine Chiavari chairs inspected prior to dispatch.</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-800/50 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Custom Stoles with Crests</h4>
                      <p className="text-xs text-emerald-300/70">Authentic Ghanaian kente & satin stoles customized with names & programs.</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-800/50 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Rapid Campus & Event Delivery</h4>
                      <p className="text-xs text-emerald-300/70">Direct delivery and professional crew setup across Ho, Accra, Kumasi & nationwide.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4 bg-[#051a10]">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 text-amber-400">
                  <Star className="h-5 w-5 fill-amber-400" />
                  <span className="text-xs font-black uppercase tracking-wider">Top Rated Selections</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                  Featured Equipment & Packages
                </h2>
              </div>
              <Link to="/shop">
                <button className="btn-secondary text-sm flex items-center gap-2">
                  <span>View All Items</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenCustomizer={onOpenCustomizer}
                  onOpenRental={onOpenRental}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/shop">
                <button className="btn-gold text-base py-3 px-8 shadow-md">
                  Explore Complete Shop Catalog
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Browse by Category Section */}
      <section className="py-20 px-4 bg-[#072416] border-y border-emerald-900/60">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Browse by Pillar & Category
            </h2>
            <p className="text-emerald-200/80 text-sm md:text-base">
              Select any category to browse available stock, rental schedules, or customized stoles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link to={`/shop?category=${encodeURIComponent(category.name)}`} key={category.name}>
                <div className="h-full bg-[#0c271a] border border-emerald-800/60 rounded-xl p-6 hover:border-amber-400/60 hover:shadow-xl hover:shadow-amber-400/5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-5 border border-emerald-700/40">
                      {category.icon}
                    </div>
                    <span className="text-xs font-bold text-amber-400 tracking-wider uppercase block mb-1">
                      {category.name}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2">{category.label}</h3>
                    <p className="text-xs text-emerald-200/70 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:underline">
                    <span>Explore Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose BOLDDEE RENTALS */}
      <section className="py-20 px-4 bg-[#051a10]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Why Choose BOLDDEE RENTALS?
            </h2>
            <p className="text-emerald-200/80 text-sm md:text-base">
              Built by event experts and passionate artisans in Ghana dedicated to making every ceremony unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 text-center space-y-4 border border-emerald-900/60">
              <div className="w-16 h-16 bg-amber-400/20 text-amber-400 rounded-2xl mx-auto flex items-center justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">100% Quality Guaranteed</h3>
              <p className="text-sm text-emerald-200/70 leading-relaxed">
                All chairs, marquee canopies, stages and microphones are strictly tested, cleaned, and professionally maintained before every single booking.
              </p>
            </div>

            <div className="glass-panel p-8 text-center space-y-4 border border-emerald-900/60">
              <div className="w-16 h-16 bg-amber-400/20 text-amber-400 rounded-2xl mx-auto flex items-center justify-center">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Campus Bulk Sashes & Discounts</h3>
              <p className="text-sm text-emerald-200/70 leading-relaxed">
                Enjoy tiered discounts for graduating classes, student departments, and organizations with personalized embroidery and custom university logos.
              </p>
            </div>

            <div className="glass-panel p-8 text-center space-y-4 border border-emerald-900/60">
              <div className="w-16 h-16 bg-amber-400/20 text-amber-400 rounded-2xl mx-auto flex items-center justify-center">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Punctual Delivery & Setup</h3>
              <p className="text-sm text-emerald-200/70 leading-relaxed">
                Fast, dependable delivery and seamless setup directly at your campus gate, church, banquet hall, or private grounds across Ghana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Campaigns Banner */}
      <section className="py-12 px-4 bg-[#082918] border-t border-emerald-900/60">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-panel p-8 md:p-10 border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#0d3b24] to-[#082215]">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                Active Campus Graduation Drives
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white">
                Graduating from HTU, UG Legon, KNUST or UCC?
              </h3>
              <p className="text-sm text-emerald-200/80 max-w-xl">
                Get up to 15% discount on class stole packages, complimentary medal ribbons, and doorstep delivery directly to your faculty hostel.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {onOpenBulkModal && (
                <button
                  onClick={onOpenBulkModal}
                  className="btn-gold text-sm py-3 px-6 shadow-md"
                >
                  Start Class Bulk Order
                </button>
              )}
              <Link to="/contact">
                <button className="btn-secondary text-sm py-3 px-6">
                  Talk to Campus Rep
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
