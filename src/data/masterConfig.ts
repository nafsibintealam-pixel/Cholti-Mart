import { CategoryItem, Product } from '../types';
import { CATEGORIES_DATA } from './categories';
import { DEMO_PRODUCTS } from './products';
import { TRUST_ITEMS } from './siteContent';
import { FAQS_DATA } from './faqs';

/**
 * CHOLTI MART — MASTER CENTRAL CONTENT & DESIGN CONFIGURATION
 * ==========================================================
 * This centralized architecture decouples all customer-facing content,
 * layout settings, images, typography, and color tokens from the presentation layer.
 *
 * Store owners can modify every customer-facing element either:
 * 1. Visually through the built-in "Site Customizer" UI (saved to localStorage + Exportable JSON)
 * 2. Directly in this master configuration file
 *
 * It is fully ready for WordPress + WooCommerce + Elementor migration.
 */

export interface SiteSettingsConfig {
  storeName: string;
  tagline: string;
  subTagline: string;
  logoPrefix: string;
  logoSuffix: string;
  logoImageUrl?: string;
  announcementTextEn: string;
  announcementTextBn: string;
  phone: string;
  email: string;
  address: string;
  currencySymbol: string;
  currencyCode: string;
  freeShippingThreshold: number;
  insideDhakaDeliveryFee: number;
  outsideDhakaDeliveryFee: number;
}

export interface ThemeColorsConfig {
  // Official Brand Palette
  primary: string;         // #142C14 - Deep Primary Green
  secondary: string;       // #2D5128 - Brand Green
  accent: string;          // #537B2F - Accent Green
  softAccent: string;      // #8DA750 - Soft Olive Green
  lightAccent: string;     // #E4EB9C - Light Lime Accent

  // Clean Neutral Direction (for visual breathing room)
  background: string;      // #F7F8F3 - Main Background
  surface: string;         // #FFFFFF - Pure White Surface
  mainText: string;        // #172117 - High-contrast Main Text
  secondaryText: string;   // #687268 - Balanced Secondary Text
  border: string;          // #E3E8DF - Clean Subtle Border

  // Feedback status
  success: string;
  warning: string;
  error: string;
}

export interface TypographyConfig {
  headingFont: string;
  bodyFont: string;
  baseFontSize: string;
  buttonRadius: string;
  cardRadius: string;
}

export interface SectionsVisibilityConfig {
  hero: boolean;
  categories: boolean;
  featuredProducts: boolean;
  offersBanner: boolean;
  dualShowcase: boolean;
  trustSection: boolean;
  promoCategory: boolean;
  testimonials: boolean;
  faq: boolean;
  newsletter: boolean;
  ctaSection: boolean;
}

export interface HeroConfig {
  badge: string;
  headlineMain: string;
  headlineAccent: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  mainImage: string;
  lifestyleTag: string;
  lifestyleTitle: string;
  lifestyleSubtitle: string;
  floatingCardTag: string;
  floatingCardTitle: string;
  floatingCardPrice: string;
  floatingCardImage: string;
  trustPill1: { title: string; subtitle: string };
  trustPill2: { title: string; subtitle: string };
  trustPill3: { title: string; subtitle: string };
}

export interface PromoBannerConfig {
  badge: string;
  titleMain: string;
  titleAccent: string;
  description: string;
  buttonText: string;
  couponCode: string;
  couponDiscount: string;
  secondaryCoupon: string;
  secondaryCouponDiscount: string;
}

export interface SocialLinksConfig {
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
  youtube: string;
}

export interface FooterConfig {
  aboutText: string;
  copyright: string;
}

export interface MasterStoreConfig {
  version: string;
  lastUpdated: string;
  siteSettings: SiteSettingsConfig;
  themeColors: ThemeColorsConfig;
  typography: TypographyConfig;
  sectionsVisibility: SectionsVisibilityConfig;
  hero: HeroConfig;
  promoBanner: PromoBannerConfig;
  socialLinks: SocialLinksConfig;
  footer: FooterConfig;
  trustItems: typeof TRUST_ITEMS;
  faqs: typeof FAQS_DATA;
  categories: CategoryItem[];
  products: Product[];
}

export const DEFAULT_MASTER_CONFIG: MasterStoreConfig = {
  version: '2.0.0',
  lastUpdated: '2026-09-18',

  siteSettings: {
    storeName: 'Cholti Mart',
    tagline: 'Everyday Finds. Better Choices.',
    subTagline: 'Curated for Modern Living in Bangladesh',
    logoPrefix: 'CHOLTI',
    logoSuffix: 'MART',
    logoImageUrl: '',
    announcementTextEn: 'Cash on Delivery (COD) Available Across Bangladesh',
    announcementTextBn: 'সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারি (COD) সুবিধা',
    phone: '+880 1700-000000',
    email: 'support@choltimart.com',
    address: 'House 42, Road 7, Sector 3, Uttara, Dhaka-1230, Bangladesh',
    currencySymbol: '৳',
    currencyCode: 'BDT',
    freeShippingThreshold: 2500,
    insideDhakaDeliveryFee: 70,
    outsideDhakaDeliveryFee: 130,
  },

  themeColors: {
    // Official 5-Color Brand Direction
    primary: '#142C14',     // Deep Primary Green
    secondary: '#2D5128',   // Brand Green
    accent: '#537B2F',      // Accent Green
    softAccent: '#8DA750',  // Soft Olive Green
    lightAccent: '#E4EB9C', // Light Lime Accent

    // Neutral Palette for Breathing Room
    background: '#F7F8F3',  // Main Canvas Background
    surface: '#FFFFFF',     // Pure White Cards & Modals
    mainText: '#172117',    // High-contrast Main Text
    secondaryText: '#687268', // Balanced Secondary Text
    border: '#E3E8DF',      // Clean Subtle Border

    // System status
    success: '#537B2F',
    warning: '#D97706',
    error: '#DC2626',
  },

  typography: {
    headingFont: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    bodyFont: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    baseFontSize: '16px',
    buttonRadius: '12px',
    cardRadius: '16px',
  },

  sectionsVisibility: {
    hero: true,
    categories: true,
    featuredProducts: true,
    offersBanner: true,
    dualShowcase: true,
    trustSection: true,
    promoCategory: true,
    testimonials: true,
    faq: true,
    newsletter: true,
    ctaSection: true,
  },

  hero: {
    badge: 'Curated for Modern Living in Bangladesh',
    headlineMain: 'Everyday Finds.',
    headlineAccent: 'Better Choices.',
    subheadline: 'Discover fashion, jewelry, gadgets, electronics and everyday essentials — thoughtfully curated with nationwide Cash on Delivery.',
    primaryCtaLabel: 'Shop Now',
    primaryCtaLink: 'shop',
    secondaryCtaLabel: 'Explore Categories',
    secondaryCtaLink: 'categories',
    mainImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    lifestyleTag: 'Multi-Category Selection',
    lifestyleTitle: 'Lifestyle, Fashion & Daily Tech',
    lifestyleSubtitle: 'Thoughtfully selected essentials for modern living',
    floatingCardTag: 'Smart Gadgets',
    floatingCardTitle: 'Noise-Cancelling TWS',
    floatingCardPrice: '৳1,850',
    floatingCardImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80',
    trustPill1: { title: 'Cash on Delivery', subtitle: 'All 64 districts' },
    trustPill2: { title: 'Doorstep Check', subtitle: 'Inspect before paying' },
    trustPill3: { title: '7 Days Return', subtitle: 'Hassle-free exchange' },
  },

  promoBanner: {
    badge: 'Limited Campaign Deals',
    titleMain: 'Smart Deals.',
    titleAccent: 'Thoughtful Prices.',
    description: "Save on verified seasonal picks, desk accessories, and women's apparel. Enjoy an extra 10% discount on your cart with code CHOLTI10.",
    buttonText: 'Explore Offers',
    couponCode: 'CHOLTI10',
    couponDiscount: '10% OFF',
    secondaryCoupon: 'FIRST100',
    secondaryCouponDiscount: '৳100 OFF',
  },

  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    whatsapp: 'https://wa.me/8801700000000',
    youtube: 'https://youtube.com',
  },

  footer: {
    aboutText: "Shop Smart, Shop Cholti Mart. Bangladesh's multi-category lifestyle, fashion, gadgets, and household essentials destination with dependable nationwide cash on delivery.",
    copyright: `© ${new Date().getFullYear()} Cholti Mart (choltimart.com). All rights reserved.`,
  },

  trustItems: TRUST_ITEMS,
  faqs: FAQS_DATA,
  categories: CATEGORIES_DATA,
  products: DEMO_PRODUCTS,
};
