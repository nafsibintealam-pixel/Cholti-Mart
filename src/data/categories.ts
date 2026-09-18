import { CategoryItem } from '../types';

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'womens-fashion',
    name: "Women's Fashion",
    banglaName: 'নারীদের ফ্যাশন',
    slug: 'womens-fashion',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    itemCount: 48,
    subcategories: ['Kurtis', 'Dresses', 'Tops', 'Bags', 'Accessories']
  },
  {
    id: 'womens-jewelry',
    name: "Women's Jewelry",
    banglaName: 'নারীদের জুয়েলারি',
    slug: 'womens-jewelry',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    itemCount: 36,
    subcategories: ['Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Sets']
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    banglaName: 'বিউটি ও পার্সোনাল কেয়ার',
    slug: 'beauty-personal-care',
    iconName: 'Heart',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    itemCount: 38,
    subcategories: ['Skincare', 'Hair Care', 'Fragrance / Body Care', 'Beauty Tools']
  },
  {
    id: 'gadgets',
    name: 'Gadgets',
    banglaName: 'স্মার্ট গ্যাজেটস',
    slug: 'gadgets',
    iconName: 'Cpu',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    itemCount: 46,
    subcategories: ['Smart Gadgets', 'Mobile Accessories', 'Audio', 'Desk Gadgets', 'Utility Gadgets']
  },
  {
    id: 'electronics',
    name: 'Electronics',
    banglaName: 'ইলেকট্রনিক্স',
    slug: 'electronics',
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    itemCount: 34,
    subcategories: ['Lighting', 'Audio', 'Small Electronics', 'Electrical Items']
  },
  {
    id: 'mobile-accessories',
    name: 'Mobile Accessories',
    banglaName: 'মোবাইল এক্সেসরিজ',
    slug: 'mobile-accessories',
    iconName: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop&q=80',
    itemCount: 52,
    subcategories: ['Phone Holders', 'Chargers', 'Cables', 'Cases']
  },
  {
    id: 'computer-accessories',
    name: 'Computer Accessories',
    banglaName: 'কম্পিউটার ও ল্যাপটপ এক্সেসরিজ',
    slug: 'computer-accessories',
    iconName: 'Laptop',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    itemCount: 38,
    subcategories: ['Laptop Stands', 'USB Hubs', 'Mouse', 'Keyboard', 'Desk Accessories']
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    banglaName: 'হোম ও লিভিং',
    slug: 'home-living',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80',
    itemCount: 45,
    subcategories: ['Decor', 'Organization', 'Lifestyle']
  },
  {
    id: 'kitchen-household',
    name: 'Kitchen & Household',
    banglaName: 'কিচেন ও হাউসহোল্ড',
    slug: 'kitchen-household',
    iconName: 'Coffee',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    itemCount: 31,
    subcategories: ['Kitchen Tools', 'Electric Kitchen Items', 'Household Utilities']
  },
  {
    id: 'offers',
    name: 'Special Offers',
    banglaName: 'স্পেশাল অফার',
    slug: 'offers',
    iconName: 'Tag',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    itemCount: 22,
    subcategories: ['Hot Deals', 'Under ৳999', 'Bundle Specials', 'Clearance']
  }
];
