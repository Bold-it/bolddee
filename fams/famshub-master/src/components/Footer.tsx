import { Instagram, Phone, Mail } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FAM's Apple Hub</h3>
            <p className="text-primary-foreground/80">
              Your trusted source for original Apple products
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="/" className="hover:text-secondary transition-colors">Home</a></li>
              <li><a href="/shop" className="hover:text-secondary transition-colors">Shop</a></li>
              <li><a href="/contact" className="hover:text-secondary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>+233 546 996 210</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>famsapplehub@gmail.com</span>
              </div>
              <div className="flex space-x-4 mt-4">
                <a
                  href="https://www.instagram.com/_famsapplehub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@_famsapplehub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  <FaTiktok className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} FAM's Apple Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
