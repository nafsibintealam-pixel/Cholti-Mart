import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  CreditCard 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CholtiMartLogo } from './CholtiMartLogo';

export const Footer: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <footer className="bg-neutral-900 text-white pt-12 sm:pt-16 pb-24 lg:pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          
          {/* Brand Info with Official Cholti Mart Logo */}
          <div className="lg:col-span-2 space-y-4">
            <CholtiMartLogo variant="footer" showTagline={true} />

            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed pt-1">
              Shop Smart, Shop Cholti Mart. Bangladesh's multi-category lifestyle, fashion, gadgets, and household essentials destination with dependable nationwide cash on delivery.
            </p>

            {/* Direct Contact Info */}
            <div className="space-y-2 pt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>House 42, Road 7, Sector 3, Uttara, Dhaka-1230, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="tel:+8801700000000" className="hover:text-white transition-colors font-medium">
                  +880 1700-000000 (10 AM - 10 PM)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="mailto:support@choltimart.com" className="hover:text-white transition-colors">
                  support@choltimart.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <a 
                  href="https://wa.me/8801700000000" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Helpline Support
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-emerald-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-emerald-400 transition-colors">
                  Shop All Products
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', "Women's Fashion")} className="hover:text-emerald-400 transition-colors">
                  Women's Fashion
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', 'Gadgets')} className="hover:text-emerald-400 transition-colors">
                  Gadgets & Tech
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', 'Special Offers')} className="hover:text-emerald-400 transition-colors">
                  Special Offers
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-emerald-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-emerald-400 transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => navigateTo('tracking')} className="hover:text-emerald-400 transition-colors font-medium text-emerald-400">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faq')} className="hover:text-emerald-400 transition-colors">
                  Help & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shipping-policy')} className="hover:text-emerald-400 transition-colors">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('returns')} className="hover:text-emerald-400 transition-colors">
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('account')} className="hover:text-emerald-400 transition-colors">
                  My Account
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('wishlist')} className="hover:text-emerald-400 transition-colors">
                  Saved Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies & Social Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Policies & Legal
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => navigateTo('privacy')} className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('terms')} className="hover:text-emerald-400 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('cookies')} 
                  className="hover:text-emerald-400 transition-colors font-medium text-neutral-300 underline underline-offset-2"
                  aria-label="View Cookie Policy"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>

            {/* Social Links */}
            <div className="pt-4">
              <span className="text-xs text-neutral-400 block mb-2 font-medium">Follow Cholti Mart</span>
              <div className="flex items-center space-x-2.5">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-emerald-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="Facebook page of Cholti Mart"
                >
                  fb
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-emerald-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="Instagram page of Cholti Mart"
                >
                  ig
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-emerald-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="TikTok page of Cholti Mart"
                >
                  tk
                </a>
                <a 
                  href="https://wa.me/8801700000000" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-emerald-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="WhatsApp of Cholti Mart"
                >
                  wa
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Payment Methods, Legal Quicklinks & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="space-y-1 text-center md:text-left">
            <p>© {new Date().getFullYear()} Cholti Mart (choltimart.com). All rights reserved.</p>
            <div className="flex items-center justify-center md:justify-start gap-3 text-[11px] text-neutral-400">
              <button onClick={() => navigateTo('privacy')} className="hover:text-emerald-400 transition-colors">Privacy</button>
              <span>•</span>
              <button onClick={() => navigateTo('terms')} className="hover:text-emerald-400 transition-colors">Terms</button>
              <span>•</span>
              <button onClick={() => navigateTo('cookies')} className="hover:text-emerald-400 transition-colors underline underline-offset-2">Cookie Policy</button>
              <span>•</span>
              <button onClick={() => navigateTo('shipping-policy')} className="hover:text-emerald-400 transition-colors">Shipping</button>
            </div>
          </div>

          {/* Supported Bangladesh Payment Methods */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] text-neutral-400 mr-1">Accepted in BD:</span>
            <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-200 font-medium text-[11px] border border-neutral-700">
              Cash on Delivery (COD)
            </span>
            <span className="px-2.5 py-1 rounded bg-pink-950/80 text-pink-300 font-semibold text-[11px] border border-pink-800/60">
              bKash
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 font-semibold text-[11px] border border-amber-800/60">
              Nagad
            </span>
            <span className="px-2.5 py-1 rounded bg-purple-950/80 text-purple-300 font-semibold text-[11px] border border-purple-800/60">
              Rocket
            </span>
            <span className="px-2.5 py-1 rounded bg-blue-950/80 text-blue-300 font-medium text-[11px] border border-blue-800/60">
              Visa / Master
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
