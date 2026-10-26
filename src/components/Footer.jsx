import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin, ShieldCheck, Heart, Camera } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#03150c] text-emerald-100 border-t border-emerald-900/60 mt-20">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
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
            <p className="text-emerald-300/80 text-sm max-w-md leading-relaxed">
              BOLDDEE RENTALS is Ghana's trusted destination for luxury event equipment rentals,
              custom-woven graduation sashes, heavy-duty marquee canopies, elegant Chiavari chairs,
              studio photoshoot packages, and full event décor setup.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400/90 pt-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Registered Business: Bold-Services & Bull-Dee Enterprises</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base text-white mb-4 tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-amber-400 transition-colors">
                  Browse All Equipment
                </Link>
              </li>
              <li>
                <Link to="/shop?category=BOLDDEE GRAD" className="hover:text-amber-400 transition-colors">
                  Graduation Stoles & Medals
                </Link>
              </li>
              <li>
                <Link to="/shop?category=BOLDDEE RENTALS" className="hover:text-amber-400 transition-colors">
                  Tents, Chairs & Stages
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact & Location
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="hover:text-amber-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h4 className="font-bold text-base text-white mb-4 tracking-wider uppercase">
              Connect With Us
            </h4>
            <div className="space-y-3 text-sm text-emerald-200/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-1" />
                <span>Ho Technical University Campus & Greater Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <span>+233 546 996 210 / +233 24 416 3901</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>bolddeerentals@gmail.com</span>
              </div>

              {/* Social Buttons */}
              <div className="flex gap-3 pt-3">
                <a
                  href="https://wa.me/233546996210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 hover:text-amber-400 hover:border-amber-400 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 hover:text-amber-400 hover:border-amber-400 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
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
