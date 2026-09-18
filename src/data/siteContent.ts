/**
 * CHOLTI MART — HOMEPAGE & SITE CONTENT REPOSITORY
 * ==========================================================
 * Modify any marketing copy, hero banners, trust badges, coupons,
 * and testimonials here without having to edit React component code!
 */

export interface HeroContent {
  badge: string;
  headlineMain: string;
  headlineAccent: string;
  subheadline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  trustPoints: { title: string; subtitle: string }[];
  featuredCard: {
    categoryTag: string;
    title: string;
    description: string;
    buttonText: string;
    targetCategory: string;
    image: string;
  };
  floatingPill: {
    tag: string;
    title: string;
    price: string;
    image: string;
  };
}

export interface TrustItem {
  id: string;
  iconName: 'ShieldCheck' | 'Truck' | 'RefreshCw' | 'Headphones';
  title: string;
  description: string;
}

export interface PromoDealContent {
  campaignBadge: string;
  titleMain: string;
  titleAccent: string;
  description: string;
  buttonText: string;
  targetCategory: string;
  freeShippingNotice: string;
  coupons: {
    label: string;
    code: string;
    description: string;
  }[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  verified: boolean;
}

export const HERO_CONTENT: HeroContent = {
  badge: 'Curated for Modern Living in Bangladesh',
  headlineMain: 'Everyday Finds.',
  headlineAccent: 'Better Choices.',
  subheadline: 'Discover fashion, jewelry, gadgets, electronics and everyday essentials — thoughtfully curated with nationwide Cash on Delivery.',
  primaryCtaText: 'Shop Now',
  secondaryCtaText: 'Explore Categories',
  trustPoints: [
    { title: 'Cash on Delivery', subtitle: 'All 64 districts' },
    { title: 'Verified Quality', subtitle: 'Inspected parcels' },
    { title: '7 Days Return', subtitle: 'Quick exchange' },
  ],
  featuredCard: {
    categoryTag: 'Featured Tech & Workspace',
    title: 'Ergonomic Aluminum Stands & Gadgets',
    description: 'Designed to reduce neck fatigue and organize your home office.',
    buttonText: 'Explore Computer Accessories',
    targetCategory: 'Computer Accessories',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80',
  },
  floatingPill: {
    tag: 'Anti-Tarnish',
    title: '18K PVD Jewelry',
    price: 'From ৳680',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&auto=format&fit=crop&q=80',
  },
};

export const TRUST_ITEMS: TrustItem[] = [
  {
    id: 'trust-1',
    iconName: 'ShieldCheck',
    title: 'Secure Shopping',
    description: 'Encrypted checkout data. We never store raw payment credentials or charge unannounced fees.',
  },
  {
    id: 'trust-2',
    iconName: 'Truck',
    title: 'Cash on Delivery',
    description: 'Available in every district. Pay safely only when the parcel arrives at your door.',
  },
  {
    id: 'trust-3',
    iconName: 'RefreshCw',
    title: 'Delivery Across Bangladesh',
    description: 'Dhaka delivery in 24-48 hours. Nationwide deliveries dispatched via trusted courier networks.',
  },
  {
    id: 'trust-4',
    iconName: 'Headphones',
    title: 'Friendly Support',
    description: 'Direct phone and WhatsApp helpline for order tracking, size advice, and quick exchanges.',
  },
];

export const PROMO_DEAL_CONTENT: PromoDealContent = {
  campaignBadge: 'Limited Campaign Deals',
  titleMain: 'Smart Deals.',
  titleAccent: 'Thoughtful Prices.',
  description: "Save on verified seasonal picks, desk accessories, and women's apparel. Enjoy an extra 10% discount on your cart with code CHOLTI10.",
  buttonText: 'Explore Offers',
  targetCategory: 'Special Offers',
  freeShippingNotice: 'Free Nationwide Delivery over ৳2,500',
  coupons: [
    { label: 'Coupon Code', code: 'CHOLTI10', description: '10% OFF any order' },
    { label: 'First Order', code: 'FIRST100', description: '৳100 Flat discount' },
  ],
};

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Tanvir Hasan',
    role: 'Software Engineer, Dhaka',
    rating: 5,
    comment: '"Ordered the adjustable aluminum laptop stand for my home office setup. Delivery took just 1.5 days to Dhanmondi, and packaging was sturdy."',
    verified: true,
  },
  {
    id: 't-2',
    name: 'Nusrat Jahan',
    role: 'Mirpur, Dhaka',
    rating: 5,
    comment: '"The women\'s kurti stitching was accurate to the size table. The breathable cotton fabric is comfortable for summer heat. Happy with the COD option."',
    verified: true,
  },
  {
    id: 't-3',
    name: 'Roksana Begum',
    role: 'Chittagong',
    rating: 5,
    comment: '"Bought the electric food chopper. Saved so much prep time making onion pastes. Tested the parcel in front of the courier agent before paying."',
    verified: true,
  },
];
