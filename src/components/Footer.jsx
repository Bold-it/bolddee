import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin, ShieldCheck, Heart, Camera } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#03150c] text-emerald-100 border-t border-emerald-900/60 mt-20">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="BOLDDEE RENTALS"
                className="h-14 w-auto object-contain mb-2"
              />
            </Link>
            <p className="text-amber-400 font-bold text-lg">
              We Make Your Moments Worthwhile.
            </p>
            <p className="text-emerald-300/80 text-xs md:text-sm max-w-md leading-relaxed">
              Ghana's premier provider of certified event infrastructure, heavy-duty marquee canopies,
              gold Chiavari chairs, custom-embroidered graduation stoles, and full event décor styling.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400/90 pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Registered Business: Bold-Services & Bull-Dee Enterprises</span>
            </div>
          </div>

          {/* Pillars */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4 tracking-wider uppercase">
              Our Pillars
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <Link to="/grad" className="hover:text-amber-400 transition-colors">
                  BOLDDEE GRAD (Sashes)
                </Link>
              </li>
              <li>
                <Link to="/rentals" className="hover:text-amber-400 transition-colors">
                  BOLDDEE RENTALS (Canopies)
                </Link>
              </li>
              <li>
                <Link to="/moments" className="hover:text-amber-400 transition-colors">
                  BOLDDEE MOMENTS (Photos)
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-amber-400 transition-colors">
                  BOLDDEE EVENTS (Décor)
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-amber-400 transition-colors">
                  Complete Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4 tracking-wider uppercase">
              Resources
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <Link to="/how-it-works" className="hover:text-amber-400 transition-colors">
                  How Booking Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  About Our Hubs
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-amber-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4 tracking-wider uppercase">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <Link to="/terms" className="hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/rental-terms" className="hover:text-amber-400 transition-colors">
                  Rental Agreement & Buffers
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy (Act 843)
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-amber-400 transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-emerald-900/60 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-400/60">
          <p>&copy; {new Date().getFullYear()} BOLDDEE RENTALS. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> for Unforgettable Moments across Ghana
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
