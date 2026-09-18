export interface TranslationDictionary {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  // Topbar
  cod_notice: {
    en: 'Cash on Delivery (COD) Available Across Bangladesh',
    bn: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (COD) সুবিধা'
  },
  secure_shopping: {
    en: '100% Secure Shopping',
    bn: '১০০% নিরাপদ কেনাকাটা'
  },
  dhaka_delivery_notice: {
    en: 'Delivery: Inside Dhaka ৳70 | Outside ৳130',
    bn: 'ডেলিভারি চার্জ: ঢাকা সিটিতে ৳৭০ | ঢাকার বাইরে ৳১৩০'
  },

  // Navigation
  nav_home: {
    en: 'Home',
    bn: 'হোম'
  },
  nav_shop: {
    en: 'Shop All',
    bn: 'সব পণ্য'
  },
  nav_categories: {
    en: 'Categories',
    bn: 'ক্যাটাগরি'
  },
  nav_new_arrivals: {
    en: 'New Arrivals',
    bn: 'নতুন কালেকশন'
  },
  nav_offers: {
    en: 'Special Offers',
    bn: 'বিশেষ ছাড়'
  },
  nav_track: {
    en: 'Track Order',
    bn: 'অর্ডার ট্র্যাক'
  },
  nav_about: {
    en: 'About Us',
    bn: 'আমাদের কথা'
  },
  nav_contact: {
    en: 'Contact',
    bn: 'যোগাযোগ'
  },
  nav_account: {
    en: 'Account',
    bn: 'অ্যাকাউন্ট'
  },
  nav_wishlist: {
    en: 'Wishlist',
    bn: 'উইশলিস্ট'
  },
  nav_cart: {
    en: 'Cart',
    bn: 'কার্ট'
  },

  // Search
  search_placeholder: {
    en: 'Search kurti, jewelry, gadgets, laptop stands, electronics...',
    bn: 'কুর্তি, জুয়েলারি, গ্যাজেট, ল্যাপটপ স্ট্যান্ড খুঁজুন...'
  },
  search_btn: {
    en: 'Search',
    bn: 'খুঁজুন'
  },
  suggested_products: {
    en: 'Suggested Products',
    bn: 'প্রস্তাবিত পণ্য'
  },

  // Actions & Buttons
  btn_add_to_cart: {
    en: 'Add to Cart',
    bn: 'কার্টে যোগ করুন'
  },
  btn_buy_now: {
    en: 'Buy Now',
    bn: 'এখনই অর্ডার করুন'
  },
  btn_instant_cod: {
    en: 'Buy Now (Instant Cash on Delivery Checkout)',
    bn: 'এখনই কিনুন (ক্যাশ অন ডেলিভারি চেকআউট)'
  },
  btn_quick_view: {
    en: 'Quick View',
    bn: 'এক নজরে'
  },
  btn_view_all: {
    en: 'View All',
    bn: 'সব দেখুন'
  },
  btn_more: {
    en: 'More',
    bn: 'আরও'
  },
  btn_checkout: {
    en: 'Checkout',
    bn: 'চেকআউট'
  },
  btn_proceed_checkout: {
    en: 'Proceed to Checkout',
    bn: 'অর্ডারে এগিয়ে যান'
  },
  btn_continue_shopping: {
    en: 'Continue Shopping',
    bn: 'আরও কেনাকাটা করুন'
  },
  btn_apply_coupon: {
    en: 'Apply',
    bn: 'প্রয়োগ করুন'
  },
  btn_confirm_order: {
    en: 'Confirm Order',
    bn: 'অর্ডার নিশ্চিত করুন'
  },

  // Status & Badges
  in_stock: {
    en: 'In Stock',
    bn: 'স্টকে আছে'
  },
  free_delivery: {
    en: 'FREE',
    bn: 'ফ্রি'
  },
  best_seller: {
    en: 'Best Seller',
    bn: 'সেরা বিক্রি'
  },
  trending: {
    en: 'Trending',
    bn: 'জনপ্রিয়'
  },
  verified_buyer: {
    en: 'Verified Buyer',
    bn: 'যাচাইকৃত ক্রেতা'
  },

  // Cart & Checkout
  shopping_cart: {
    en: 'Shopping Cart',
    bn: 'শপিং কার্ট'
  },
  empty_cart_title: {
    en: 'Your cart is empty',
    bn: 'আপনার কার্ট খালি'
  },
  subtotal: {
    en: 'Subtotal',
    bn: 'সাবটোটাল'
  },
  discount: {
    en: 'Discount',
    bn: 'ছাড়'
  },
  delivery_charge: {
    en: 'Delivery Fee',
    bn: 'ডেলিভারি চার্জ'
  },
  total_payable: {
    en: 'Total Payable',
    bn: 'সর্বমোট প্রদেয়'
  },
  cod_description: {
    en: 'Pay in cash directly to courier agent when you receive and verify the parcel.',
    bn: 'পার্সেল হাতে পেয়ে চেক করে ডেলিভারিম্যানকে নগদ মূল্য পরিশোধ করুন।'
  },
  free_delivery_progress: {
    en: 'Free Delivery across Bangladesh over ৳2,500',
    bn: '৳২,৫০০ বা তার বেশি অর্ডারে সারা দেশে ফ্রি ডেলিভারি'
  },

  // Home Page Headers
  hero_title_1: {
    en: 'Curated Everyday Lifestyle & Gadgets',
    bn: 'প্রতিদিনের সেরা লাইফস্টাইল ও টেক গ্যাজেট'
  },
  hero_subtitle_1: {
    en: 'Discover high-demand apparel, jewelry, laptop accessories, and home essentials with nationwide doorstep Cash on Delivery.',
    bn: 'উচ্চমানের পোশাক, নান্দনিক গহনা, স্মার্ট গ্যাজেট ও ঘরের প্রয়োজনীয় পণ্য—সারা বাংলাদেশে বিশ্বস্ত ক্যাশ অন ডেলিভারিতে।'
  },
  shop_by_category: {
    en: 'Shop by Category',
    bn: 'ক্যাটাগরি অনুযায়ী কেনাকাটা'
  },
  featured_products: {
    en: 'Featured Products',
    bn: 'নির্বাচিত পণ্যসমূহ'
  },
  just_landed: {
    en: 'New Arrivals',
    bn: 'নতুন কালেকশন'
  },
  trending_picks: {
    en: 'Trending Right Now',
    bn: 'এই মুহূর্তে জনপ্রিয়'
  },
  special_offers: {
    en: 'Special Offers & Deals',
    bn: 'বিশেষ অফার ও ছাড়'
  },
  why_shop: {
    en: 'Why Shop With Cholti Mart?',
    bn: 'কেন চলতী মার্ট বেছে নেবেন?'
  },
  testimonials_title: {
    en: 'What Customers Are Saying',
    bn: 'সম্মানিত ক্রেতাদের মতামত'
  },
  faq_title: {
    en: 'Frequently Asked Questions',
    bn: 'সাধারণ জিজ্ঞাসাসমূহ'
  },

  // Trust Badges
  cod_badge_title: {
    en: 'Nationwide Cash on Delivery',
    bn: 'সারাদেশে ক্যাশ অন ডেলিভারি'
  },
  cod_badge_desc: {
    en: 'Available across all 64 districts in Bangladesh. Check package before paying.',
    bn: 'বাংলাদেশের সকল ৬৪ জেলায় ক্যাশ অন ডেলিভারি। পণ্য দেখে মূল্য দিন।'
  },
  fast_delivery_title: {
    en: 'Fast Reliable Shipping',
    bn: 'দ্রুত নির্ভরযোগ্য ডেলিভারি'
  },
  fast_delivery_desc: {
    en: '24-48 hours inside Dhaka city. 3-5 business days across outside districts.',
    bn: 'ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা। ঢাকার বাইরে ৩-৫ কার্যদিবসে ডেলিভারি।'
  },
  return_badge_title: {
    en: '7-Day Easy Return Policy',
    bn: '৭ দিনের সহজ রিটার্ন পলিসি'
  },
  return_badge_desc: {
    en: 'Hassle-free replacement if damaged, defective, or mismatch upon delivery.',
    bn: 'পণ্য ক্ষতিগ্রস্ত বা ত্রুটিপূর্ণ হলে কোনো ঝামেলা ছাড়াই এক্সচেঞ্জ সুবিধা।'
  },
  support_badge_title: {
    en: 'Dedicated Helpline & Support',
    bn: 'সার্বক্ষণিক কাস্টমার সাপোর্ট'
  },
  support_badge_desc: {
    en: 'Live phone & WhatsApp assistance for order tracking and inquiries.',
    bn: 'যেকোনো জিজ্ঞাসা বা ট্র্যাকিং সহায়তায় সরাসরি ফোন ও হোয়াটসঅ্যাপ সাপোর্ট।'
  }
};

// Bengali numeral translation helper
const EN_TO_BN_DIGITS: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯'
};

export function toBengaliNumber(num: number | string): string {
  const str = num.toString();
  return str.replace(/[0-9]/g, match => EN_TO_BN_DIGITS[match] || match);
}

export function formatPrice(amount: number, language: 'en' | 'bn' = 'en'): string {
  const formattedEn = amount.toLocaleString('en-IN');
  if (language === 'bn') {
    return `৳${toBengaliNumber(formattedEn)}`;
  }
  return `৳${formattedEn}`;
}
