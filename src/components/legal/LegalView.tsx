import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Lock, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Cookie,
  FileText,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { FAQS_DATA } from '../../data/faqs';
import { AppView } from '../../types';

export const LegalView: React.FC = () => {
  const { currentView, navigateTo } = useShop();
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const legalTabs: { id: AppView; label: string }[] = [
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Helpline' },
    { id: 'faq', label: 'FAQs' },
    { id: 'shipping-policy', label: 'Shipping & Delivery' },
    { id: 'returns', label: 'Return & Refund' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'cookies', label: 'Cookie Policy' },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-[#537B2F] uppercase tracking-wider">Company Background</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">About Cholti Mart</h1>
              <p className="text-[#2D5128] font-medium text-sm mt-1">Shop Smart, Shop Cholti Mart.</p>
            </div>
            <div className="prose prose-sm text-neutral-600 space-y-4 leading-relaxed text-xs sm:text-sm">
              <p>
                <strong>Cholti Mart</strong> is a modern, customer-first Bangladeshi e-commerce brand designed to bring dependable lifestyle, fashion, jewelry, home, and smart tech products directly to your doorstep.
              </p>
              <h3 className="text-base font-bold text-neutral-900 pt-2">Our Mission</h3>
              <p>
                Our goal is to eliminate online shopping uncertainty in Bangladesh. By pairing curated multi-category product lines with strict physical quality checks, open-doorstep parcel inspection, and nationwide Cash on Delivery, we empower shoppers across all 64 districts to shop with complete peace of mind.
              </p>
              <h3 className="text-base font-bold text-neutral-900 pt-2">Curated Quality, Honest Pricing</h3>
              <p>
                Every product featured in our catalog is benchmarked against strict usability, durability, and fair value criteria. We do not engage in inflated markups or artificial clearance gimmicks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-[#F3F6EC] rounded-2xl border border-[#8DA750]/30">
                  <span className="text-xl font-bold text-[#142C14] block">64 Districts</span>
                  <span className="text-xs text-neutral-600">Nationwide doorstep coverage</span>
                </div>
                <div className="p-4 bg-[#F3F6EC] rounded-2xl border border-[#8DA750]/30">
                  <span className="text-xl font-bold text-[#142C14] block">100% COD</span>
                  <span className="text-xs text-neutral-600">Inspect parcel before payment</span>
                </div>
                <div className="p-4 bg-[#F3F6EC] rounded-2xl border border-[#8DA750]/30">
                  <span className="text-xl font-bold text-[#142C14] block">7 Days</span>
                  <span className="text-xs text-neutral-600">Hassle-free return window</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-[#537B2F] uppercase tracking-wider">Customer Support</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">Contact & Customer Helpline</h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">We are here to assist with orders, tracking, warranty, and exchanges.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#2D5128] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-neutral-900 block">Phone & WhatsApp Support</span>
                    <a href="tel:+8801700000000" className="text-[#2D5128] font-bold hover:underline block">
                      +880 1700-000000
                    </a>
                    <span className="text-neutral-500 text-xs mt-0.5 block">Available 10:00 AM – 10:00 PM (Every day)</span>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#2D5128] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-neutral-900 block">Official Support Email</span>
                    <a href="mailto:support@choltimart.com" className="text-[#2D5128] font-bold hover:underline block">
                      support@choltimart.com
                    </a>
                    <span className="text-neutral-500 text-xs mt-0.5 block">Inquiries answered within 4 hours</span>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#2D5128] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-neutral-900 block">Dhaka Operational Office</span>
                    <span className="text-neutral-600 block">House 42, Road 7, Sector 3, Uttara, Dhaka-1230, Bangladesh</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
                <h3 className="font-bold text-neutral-900 text-sm mb-4">Send Us a Direct Message</h3>
                {contactSubmitted ? (
                  <div className="p-4 bg-[#F3F6EC] border border-[#8DA750] rounded-2xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#537B2F] mx-auto" />
                    <h4 className="font-bold text-[#142C14] text-sm">Message Sent Successfully!</h4>
                    <p className="text-xs text-neutral-600">Our customer care team will review your inquiry and reach out shortly.</p>
                    <button 
                      onClick={() => setContactSubmitted(false)}
                      className="text-xs font-bold text-[#2D5128] underline pt-1"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Full Name</label>
                      <input type="text" required placeholder="e.g. Tanvir Ahmed" className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#537B2F]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number</label>
                      <input type="tel" required placeholder="017XXXXXXXX" className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#537B2F]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Message</label>
                      <textarea rows={3} required placeholder="How can we help you with your order?" className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#537B2F]" />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-[#142C14] hover:bg-[#2D5128] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer">
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Help & Support</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">Frequently Asked Questions</h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">Everything you need to know about ordering, delivery, and payments in Bangladesh.</p>
            </div>

            <div className="space-y-3 pt-2">
              {FAQS_DATA.map(faq => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? '' : faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-semibold text-neutral-900">
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${openFaqId === faq.id ? 'rotate-180 text-emerald-600' : ''}`} />
                  </button>

                  {openFaqId === faq.id && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 border-t border-neutral-100 leading-relaxed bg-neutral-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'shipping':
      case 'shipping-policy':
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Nationwide Logistics</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">Shipping & Delivery Policy</h1>
              <p className="text-xs text-neutral-400">Doorstep delivery across all 64 districts in Bangladesh</p>
            </div>

            <div className="prose prose-sm text-neutral-600 space-y-4 leading-relaxed text-xs sm:text-sm">
              <h3 className="text-base font-bold text-neutral-900">Delivery Timelines & Charges:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                  <span className="text-xs font-bold text-emerald-900 uppercase block">Inside Dhaka City</span>
                  <span className="text-2xl font-black text-neutral-900 mt-1 block">৳70 Fee</span>
                  <span className="text-xs text-neutral-600 mt-1 block">Estimated delivery: 24 to 48 Hours</span>
                </div>
                <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl">
                  <span className="text-xs font-bold text-blue-900 uppercase block">Outside Dhaka (63 Districts)</span>
                  <span className="text-2xl font-black text-neutral-900 mt-1 block">৳130 Fee</span>
                  <span className="text-xs text-neutral-600 mt-1 block">Estimated delivery: 3 to 5 Days</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl not-prose">
                <span className="text-xs font-bold text-amber-900 block">Free Nationwide Delivery Promotion</span>
                <span className="text-xs text-amber-800 mt-0.5 block">
                  Orders exceeding <strong>৳2,500</strong> automatically qualify for 100% Free Shipping anywhere in Bangladesh.
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900 pt-2">Doorstep Inspection Policy</h3>
              <p>
                For all Cash on Delivery shipments, customers are encouraged to inspect the outer parcel and verify item contents with the delivery agent before paying the final invoice amount.
              </p>

              <h3 className="text-base font-bold text-neutral-900 pt-2">Courier Partners</h3>
              <p>
                We partner with Steadfast Courier, Pathao Courier, and Paperfly to ensure automated SMS tracking and safe parcel handling.
              </p>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Data Protection</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">Privacy Policy</h1>
              <p className="text-xs text-neutral-400">Last updated: January 2026 | Cholti Mart</p>
            </div>

            <div className="prose prose-sm text-neutral-600 space-y-4 leading-relaxed text-xs sm:text-sm">
              <p>
                Cholti Mart respects customer privacy. We collect customer names, phone numbers, and delivery addresses solely for parcel fulfillment, shipping communication, and order verification.
              </p>
              <h3 className="text-base font-bold text-neutral-900 pt-2">No Storage of Payment Credentials</h3>
              <p>
                We do not store credit card numbers, bKash PINs, or bank account passwords. All digital mobile transactions are processed through authorized, regulated Bangladesh Bank licensed gateways (bKash, Nagad, SSLCommerz).
              </p>
              <h3 className="text-base font-bold text-neutral-900 pt-2">Data Protection & Non-Disclosure</h3>
              <p>
                We do not sell, rent, or trade your personal data to external advertisers or telemarketing firms. Your contact details are only shared with courier riders to arrange delivery.
              </p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">User Agreement</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">Terms & Conditions</h1>
              <p className="text-xs text-neutral-400">Governing Cholti Mart E-Commerce Operations in Bangladesh</p>
            </div>

            <div className="prose prose-sm text-neutral-600 space-y-4 leading-relaxed text-xs sm:text-sm">
              <h3 className="text-base font-bold text-neutral-900">1. Order Placement & Verification</h3>
              <p>
                Orders placed on choltimart.com are subject to phone verification before dispatch. We reserve the right to cancel orders with unreachable or invalid telephone numbers.
              </p>
              <h3 className="text-base font-bold text-neutral-900">2. Pricing & Currency</h3>
              <p>
                All prices are stated in Bangladeshi Taka (৳) inclusive of applicable taxes. Delivery charges are calculated based on recipient district.
              </p>
              <h3 className="text-base font-bold text-neutral-900">3. Cash on Delivery (COD) Compliance</h3>
              <p>
                Under Cash on Delivery terms, the recipient agrees to inspect the parcel and pay the invoice amount in cash to the rider upon acceptance.
              </p>
            </div>
          </div>
        );

      case 'returns':
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">7-Day Guarantee</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">Return & Refund Policy</h1>
              <p className="text-xs text-neutral-400">Fair, transparent replacement and refund terms</p>
            </div>

            <div className="prose prose-sm text-neutral-600 space-y-4 leading-relaxed text-xs sm:text-sm">
              <p>
                We stand behind our catalog quality. If you receive an item that is defective, broken in transit, or different from the online description:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You have <strong>7 calendar days</strong> from delivery date to request a return or exchange.</li>
                <li>Items must be returned in their original condition with packaging and tags intact.</li>
                <li>Refunds are processed within 24–48 hours via original payment method or bKash/Nagad for COD orders.</li>
                <li>Delivery charges for return pickups of defective items are 100% covered by Cholti Mart.</li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => navigateTo('contact')}
                  className="px-5 py-2.5 bg-[#142C14] hover:bg-[#2D5128] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Initiate Return or Contact Helpline
                </button>
              </div>
            </div>
          </div>
        );

      case 'cookies':
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-[#537B2F] uppercase tracking-wider">Privacy & Transparency</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">Cookie Policy</h1>
              <p className="text-xs text-neutral-500 mt-1">Last updated: January 2026 | Cholti Mart (choltimart.com)</p>
            </div>

            <div className="prose prose-sm text-neutral-600 space-y-5 leading-relaxed text-xs sm:text-sm">
              <p>
                This Cookie Policy explains how <strong>Cholti Mart</strong> uses cookies and similar client-side storage technologies when you visit our website. We are dedicated to providing transparency about the data we store and how it improves your e-commerce shopping experience.
              </p>

              <div className="p-4 bg-[#F3F6EC] border border-[#8DA750]/40 rounded-2xl">
                <div className="flex items-center gap-2 text-[#142C14] font-bold text-sm mb-1">
                  <Cookie className="w-4 h-4 text-[#537B2F]" />
                  <span>Summary of How We Use Cookies</span>
                </div>
                <p className="text-xs text-neutral-700 leading-normal">
                  We use cookies strictly for essential store functionality — such as remembering the items in your shopping cart, preserving your saved wishlist, saving your English/Bangla language preference, and ensuring secure checkout transactions. We never sell your personal browsing data.
                </p>
              </div>

              <h3 className="text-base font-bold text-neutral-900 pt-2">1. What Are Cookies?</h3>
              <p>
                Cookies are small text files placed on your computer, smartphone, or tablet when you browse websites. They allow our system to recognize your device across multiple visits, keep your cart items intact when you navigate between pages, and deliver a smooth and personalized shopping experience.
              </p>

              <h3 className="text-base font-bold text-neutral-900 pt-2">2. Types of Cookies We Use</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
                  <span className="text-xs font-bold text-[#142C14] block mb-1 uppercase tracking-wide">
                    Essential Shopping Cookies
                  </span>
                  <p className="text-xs text-neutral-600">
                    Required for basic site navigation, adding products to cart, calculating delivery charges based on district, and processing orders through Cash on Delivery or digital payment.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
                  <span className="text-xs font-bold text-[#142C14] block mb-1 uppercase tracking-wide">
                    Preference & Language Cookies
                  </span>
                  <p className="text-xs text-neutral-600">
                    Remembers your preferred language (English or বাংলা), recently viewed catalog items, and active coupon codes across browsing sessions.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
                  <span className="text-xs font-bold text-[#142C14] block mb-1 uppercase tracking-wide">
                    Performance & Security Cookies
                  </span>
                  <p className="text-xs text-neutral-600">
                    Monitors page load speeds, protects against automated bot spam, and keeps customer checkout sessions encrypted and secure.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
                  <span className="text-xs font-bold text-[#142C14] block mb-1 uppercase tracking-wide">
                    Customer Support & AI Cookies
                  </span>
                  <p className="text-xs text-neutral-600">
                    Enables the Cholti AI assistant widget to remember your ongoing shopping conversation, product queries, and order status lookups.
                  </p>
                </div>
              </div>

              <h3 className="text-base font-bold text-neutral-900 pt-2">3. How Can You Manage or Disable Cookies?</h3>
              <p>
                Most modern web browsers (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge) automatically accept cookies, but you can modify your browser settings to decline cookies or notify you when a cookie is placed.
              </p>
              <p className="text-xs text-neutral-500">
                Please note: If you completely block cookies, certain features of the store — such as retaining items in your cart across page refreshes or automatic language detection — may not function properly.
              </p>

              <h3 className="text-base font-bold text-neutral-900 pt-2">4. Questions & Helpline</h3>
              <p>
                If you have questions regarding our Cookie Policy or data privacy practices, our team is happy to assist you:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600">
                <li>Email: <a href="mailto:support@choltimart.com" className="text-[#537B2F] font-semibold hover:underline">support@choltimart.com</a></li>
                <li>Helpline: <a href="tel:+8801700000000" className="text-[#537B2F] font-semibold hover:underline">+880 1700-000000</a> (10:00 AM – 10:00 PM)</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-neutral-400 mb-6 flex items-center gap-2">
        <button onClick={() => navigateTo('home')} className="hover:text-neutral-700">Home</button>
        <span>/</span>
        <span className="text-neutral-800 font-medium capitalize">
          {currentView.replace('-', ' ')}
        </span>
      </nav>

      {/* Reusable Legal Navigation Pill Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 border-b border-neutral-200 scrollbar-none">
        {legalTabs.map(tab => {
          const isActive = currentView === tab.id || (tab.id === 'shipping-policy' && currentView === 'shipping');
          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-[#142C14] text-white shadow-xs' 
                  : 'bg-white text-neutral-600 hover:bg-[#F3F6EC] hover:text-[#142C14] border border-neutral-200/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-xs">
        {renderContent()}
      </div>
    </div>
  );
};
