import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  ChevronRight, 
  Truck, 
  RefreshCw, 
  Search,
  ExternalLink,
  Minimize2,
  Maximize2,
  HelpCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { DEMO_PRODUCTS } from '../../data/products';
import { Product } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
  actionLink?: {
    label: string;
    view?: 'shop' | 'cart' | 'contact' | 'tracking' | 'returns' | 'shipping';
    category?: string;
  };
}

const PRESET_PROMPTS = [
  { label: '🎁 Gifts under ৳1000', query: 'Find gifts under 1000' },
  { label: '🔥 Trending products', query: 'Show me trending items' },
  { label: '📦 Delivery & COD in BD', query: 'How does delivery and Cash on Delivery work?' },
  { label: '⚡ Smart Gadgets', query: 'Recommend smart gadgets' },
  { label: '✨ Skincare essentials', query: 'Suggest skincare products' },
  { label: '🔄 7-day return policy', query: 'What is your return policy?' }
];

export const CholtiAI: React.FC = () => {
  const { navigateTo, addToCart, setQuickViewProduct, formatCurrency, t, language } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: language === 'bn' 
        ? 'আসসালামু আলাইকুম! আমি Cholti AI — আপনার ব্যক্তিগত কেনাকাটা সহকারী। সেরা অফার, বাজেট গ্যাজেট বা ডেলিভারি তথ্যের জন্য আমাকে জিজ্ঞেস করতে পারেন।'
        : 'Hello! I am Cholti AI, your personal shopping assistant. Ask me to find trending gadgets, beauty items, budget gift ideas, or help track an order.',
      timestamp: 'Just now'
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasUnreadNotification(false);
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Simulate smart AI response with contextual matching
    setTimeout(() => {
      const lower = query.toLowerCase();
      let replyText = '';
      let recommended: Product[] = [];
      let action: Message['actionLink'] = undefined;

      if (lower.includes('under 1000') || lower.includes('under ৳1000') || lower.includes('gift') || lower.includes('1000 tk') || lower.includes('budget')) {
        replyText = language === 'bn'
          ? 'এখানে ১,০০০ টাকার নিচের কয়েকটি অত্যন্ত জনপ্রিয় ও দরকারী উপহার সামগ্রী রয়েছে:'
          : 'Here are our most popular gifts and lifestyle items under ৳1,000 with nationwide Cash on Delivery:';
        recommended = DEMO_PRODUCTS.filter(p => p.price <= 1000).slice(0, 3);
        action = { label: 'Explore More Budget Finds', view: 'shop' };

      } else if (lower.includes('trend') || lower.includes('best seller') || lower.includes('popular')) {
        replyText = language === 'bn'
          ? 'এই মুহূর্তে আমাদের ক্যাটালগের শীর্ষ ট্রেন্ডিং পণ্যগুলি দেখতে পারেন:'
          : 'Here are our top trending products that customers in Bangladesh are loving right now:';
        recommended = DEMO_PRODUCTS.filter(p => p.isTrending || p.badge === 'Best Seller').slice(0, 3);
        action = { label: 'View All Trending Deals', view: 'shop' };

      } else if (lower.includes('gadget') || lower.includes('tech') || lower.includes('charger') || lower.includes('audio') || lower.includes('neckband')) {
        replyText = language === 'bn'
          ? 'আমাদের স্মার্ট গ্যাজেট ক্যাটাগরি থেকে সেরা কিছু কালেকশন:'
          : 'Check out these top-rated smart gadgets and everyday tech essentials:';
        recommended = DEMO_PRODUCTS.filter(p => p.category === 'Gadgets').slice(0, 3);
        action = { label: 'Shop All Smart Gadgets', view: 'shop', category: 'Gadgets' };

      } else if (lower.includes('beauty') || lower.includes('skin') || lower.includes('serum') || lower.includes('hair') || lower.includes('cosmetic')) {
        replyText = language === 'bn'
          ? 'বিউটি ও পার্সোনাল কেয়ারের কিছু প্রিয় পণ্য:'
          : 'Here are authentic, dermatologically-tested beauty and personal care favourites:';
        recommended = DEMO_PRODUCTS.filter(p => p.category === 'Beauty & Personal Care').slice(0, 3);
        action = { label: 'Explore Beauty & Personal Care', view: 'shop', category: 'Beauty & Personal Care' };

      } else if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('charge') || lower.includes('cod') || lower.includes('cash on delivery')) {
        replyText = language === 'bn'
          ? 'আমাদের ডেলিভারি পলিসি:\n• ঢাকা সিটির ভেতরে: ৳৭০ (২৪ থেকে ৪৮ ঘণ্টা)\n• ঢাকার বাইরে (সকল ৬৪ জেলা): ৳১৩০ (৩ থেকে ৫ দিন)\n• ডেলিভারিম্যানের সামনে পার্সেল খুলে কোয়ালিটি চেক করে পেমেন্ট করার সুবিধা রয়েছে।'
          : 'Our Delivery & Payment terms:\n• Inside Dhaka: ৳70 (24–48 hours)\n• Outside Dhaka (all 64 districts): ৳130 (3–5 working days)\n• 100% Cash on Delivery available with doorstep parcel inspection before you pay!';
        action = { label: 'Read Full Shipping Policy', view: 'shipping' };

      } else if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange') || lower.includes('warranty')) {
        replyText = language === 'bn'
          ? 'আমাদের সহজ ৭ দিনের রিটার্ন পলিসি রয়েছে! যদি পণ্যে কোনো ত্রুটি বা সমস্যার প্রমাণ পাওয়া যায়, আমরা বিনামূল্যে এক্সচেঞ্জ বা ফুল রিফান্ড নিশ্চিত করি।'
          : 'We offer a 7-day hassle-free return and exchange guarantee. If an item is defective, damaged in transit, or incorrect, pickup charges are 100% covered by Cholti Mart.';
        action = { label: 'View Return Policy', view: 'returns' };

      } else if (lower.includes('track') || lower.includes('order status') || lower.includes('where is my order')) {
        replyText = language === 'bn'
          ? 'আপনার অর্ডার ট্র্যাক করতে ৬ ডিজিটের অর্ডার আইডি (যেমন: CM-2026-XXXX) দিয়ে আমাদের ট্র্যাকিং পেজ ভিজিট করুন অথবা হেল্পলাইনে যোগাযোগ করুন।'
          : 'You can track any active order using your Order ID and phone number on our real-time tracking page.';
        action = { label: 'Go to Order Tracking', view: 'tracking' };

      } else {
        // Keyword search in product catalog
        const matches = DEMO_PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(lower) || 
          p.category.toLowerCase().includes(lower) ||
          p.tags.some(t => t.toLowerCase().includes(lower))
        );

        if (matches.length > 0) {
          replyText = `Found ${matches.length} matching items for "${query}":`;
          recommended = matches.slice(0, 3);
          action = { label: 'View in Shop', view: 'shop' };
        } else {
          replyText = language === 'bn'
            ? `আমি "${query}" সম্পর্কে নিশ্চিত নই, তবে আপনি আমাদের শপ ক্যাটালগ ঘুরে দেখতে পারেন অথবা সরাসরি কাস্টমার সাপোর্টে কল করতে পারেন (+880 1700-000000)।`
            : `I couldn't find an exact match for "${query}", but you can explore our complete store catalog or speak directly with our Dhaka customer helpline at +880 1700-000000.`;
          action = { label: 'Explore All Categories', view: 'shop' };
        }
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: recommended.length > 0 ? recommended : undefined,
        actionLink: action
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 font-sans">
      
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          id="cholti-ai-launcher"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#142C14] hover:bg-[#2D5128] text-white rounded-full shadow-2xl hover:shadow-[#142C14]/40 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-[#8DA750]/50 cursor-pointer"
          aria-label="Open Cholti AI Shopping Assistant"
        >
          {/* Animated pulsing dot */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E4EB9C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E4EB9C]"></span>
          </span>

          <Bot className="w-5 h-5 text-[#E4EB9C] group-hover:rotate-6 transition-transform" />
          
          <div className="text-left leading-tight hidden sm:block">
            <span className="text-xs font-black tracking-wide block text-white">Cholti AI</span>
            <span className="text-[10px] text-[#E4EB9C] font-medium block">Shopping Guide</span>
          </div>

          {hasUnreadNotification && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#8DA750] text-[#142C14] text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
              1
            </span>
          )}
        </button>
      )}

      {/* Expanded AI Chat Widget Modal */}
      {isOpen && (
        <div 
          id="cholti-ai-modal"
          className={`bg-white rounded-3xl shadow-2xl border border-[#8DA750]/40 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized 
              ? 'w-80 h-14' 
              : 'w-[92vw] sm:w-96 h-[540px] max-h-[85vh]'
          }`}
        >
          {/* Header Bar using Official Dark Green & Mindaro Palette */}
          <div className="bg-[#142C14] text-white px-4 py-3.5 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#2D5128] border border-[#8DA750]/40 flex items-center justify-center text-[#E4EB9C]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold tracking-wide text-white">Cholti AI</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#537B2F] text-[#E4EB9C] text-[9px] font-bold">
                    Online
                  </span>
                </div>
                <span className="text-[10px] text-[#E4EB9C]/80 block leading-tight">
                  Shopping & Product Guide
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Chat Body (hidden if minimized) */}
          {!isMinimized && (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#F3F6EC]/50 to-white text-xs">
                
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#142C14] text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-neutral-800 border border-[#8DA750]/30 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    {/* Render Recommended Products if available */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="w-full mt-2.5 space-y-2">
                        {msg.recommendedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-white rounded-xl p-2 border border-neutral-200/90 shadow-2xs flex items-center justify-between gap-2.5 hover:border-[#537B2F] transition-all"
                          >
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-11 h-11 rounded-lg object-cover shrink-0 cursor-pointer"
                              onClick={() => setQuickViewProduct(prod)}
                            />
                            <div className="min-w-0 flex-1 text-left">
                              <span 
                                onClick={() => setQuickViewProduct(prod)}
                                className="font-bold text-neutral-900 truncate block hover:text-[#2D5128] cursor-pointer"
                              >
                                {prod.name}
                              </span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-extrabold text-[#142C14]">
                                  {formatCurrency(prod.price)}
                                </span>
                                {prod.oldPrice && (
                                  <span className="text-[10px] text-neutral-400 line-through">
                                    {formatCurrency(prod.oldPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className="px-2.5 py-1.5 bg-[#142C14] hover:bg-[#2D5128] text-white rounded-lg text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action navigation button */}
                    {msg.actionLink && (
                      <button
                        onClick={() => {
                          if (msg.actionLink?.view) {
                            navigateTo(msg.actionLink.view, msg.actionLink.category);
                          }
                          setIsOpen(false);
                        }}
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#2D5128] hover:text-[#142C14] bg-[#E4EB9C]/40 hover:bg-[#E4EB9C] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>{msg.actionLink.label}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}

                    <span className="text-[9px] text-neutral-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 bg-white border border-[#8DA750]/30 rounded-2xl px-3 py-2 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#537B2F] animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#537B2F] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#537B2F] animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Preset Quick Chips */}
              <div className="px-3 py-2 bg-neutral-50/80 border-t border-neutral-200 overflow-x-auto flex gap-1.5 scrollbar-none">
                {PRESET_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p.query)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 hover:border-[#8DA750] text-[10.5px] font-medium text-neutral-700 whitespace-nowrap hover:bg-[#F3F6EC] transition-colors cursor-pointer shadow-2xs"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Input bar */}
              <div className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Ask about products, gifts, delivery..."
                  className="flex-1 text-xs bg-neutral-100 focus:bg-white rounded-xl px-3.5 py-2.5 border border-transparent focus:border-[#8DA750] focus:outline-hidden transition-all text-neutral-800 placeholder-neutral-400"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputQuery.trim()}
                  className="p-2.5 bg-[#142C14] hover:bg-[#2D5128] disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-[#E4EB9C]" />
                </button>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
};
