import { HeroConfig, PromoBannerConfig, DEFAULT_MASTER_CONFIG } from '../../data/masterConfig';
import { TRUST_ITEMS, TrustItem } from '../../data/siteContent';
import { FAQS_DATA, FAQItem } from '../../data/faqs';
import { TestimonialRecord, BlogPostRecord, ContentPageRecord } from '../../types';
import { API_CONFIG } from '../api/config';
import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export type { TrustItem };

export interface IContentService {
  getHeroConfig(): Promise<HeroConfig>;
  getHeroConfigSync(): HeroConfig;
  updateHeroConfig(updates: Partial<HeroConfig>): Promise<HeroConfig>;

  getPromoBanner(): Promise<PromoBannerConfig>;
  getPromoBannerSync(): PromoBannerConfig;
  updatePromoBanner(updates: Partial<PromoBannerConfig>): Promise<PromoBannerConfig>;

  getTrustItems(): Promise<TrustItem[]>;
  getTrustItemsSync(): TrustItem[];

  getFaqs(): Promise<FAQItem[]>;
  getFaqsSync(): FAQItem[];
  updateFaq(index: number, question: string, answer: string): Promise<FAQItem[]>;
  addFaq(faq: FAQItem): Promise<FAQItem[]>;

  getTestimonials(): Promise<TestimonialRecord[]>;
  getTestimonialsSync(): TestimonialRecord[];
  addTestimonial(record: Omit<TestimonialRecord, 'id' | 'createdAt'>): Promise<TestimonialRecord>;

  getBlogPosts(): Promise<BlogPostRecord[]>;
  getBlogPostsSync(): BlogPostRecord[];
  createBlogPost(post: Omit<BlogPostRecord, 'id' | 'createdAt' | 'views'>): Promise<BlogPostRecord>;
  saveBlogPosts(posts: any[]): void;

  getPage(slug: string): Promise<ContentPageRecord | null>;
  getAllPages(): Promise<ContentPageRecord[]>;
  getPages(): Promise<ContentPageRecord[]>;
  getPagesSync(): ContentPageRecord[];
  updatePage(slug: string, updates: Partial<ContentPageRecord>): Promise<ContentPageRecord>;
  subscribeNewsletter(email: string): Promise<boolean>;
}

const STORAGE_KEYS = {
  HERO: 'cholti_cms_hero_v1',
  PROMO: 'cholti_cms_promo_v1',
  FAQS: 'cholti_cms_faqs_v1',
  TESTIMONIALS: 'cholti_admin_testimonials_v1',
  BLOG: 'cholti_admin_blog_posts_v1',
  PAGES: 'cholti_admin_content_pages_v1',
};

const INITIAL_TESTIMONIALS: TestimonialRecord[] = [
  {
    id: 'test-1',
    customerName: 'Sultana Razia',
    customerLocation: 'Uttara, Dhaka',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The Aluminum laptop stand was delivered within 24 hours in Uttara. Build quality is solid, matte finished and completely wobble free.',
    productPurchased: 'Adjustable Aluminum Laptop Stand',
    isVerified: true,
    isFeatured: true,
    createdAt: '14 Sep 2026'
  },
  {
    id: 'test-2',
    customerName: 'Mehedi Hasan',
    customerLocation: 'Mirpur DOHS, Dhaka',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Received the Aarong Earth ethnic kurti in great packaging. The cash on delivery rider waited for me to check the product integrity. Highly recommended!',
    productPurchased: 'Embroidered Cotton Kurti Set',
    isVerified: true,
    isFeatured: true,
    createdAt: '10 Sep 2026'
  },
  {
    id: 'test-3',
    customerName: 'Nusrat Jahan',
    customerLocation: 'Agrabad, Chittagong',
    customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Authentic Xiaomi smartwatch at an honest price. Steer clear of unauthorized counterfeit pages on Facebook; Cholti Mart is real and verified.',
    productPurchased: 'Xiaomi Mi Band 8 Active Smart Tracker',
    isVerified: true,
    isFeatured: true,
    createdAt: '08 Sep 2026'
  }
];

const INITIAL_BLOG_POSTS: BlogPostRecord[] = [
  {
    id: 'blog-1',
    title: 'Top 7 Desk Gadgets to Maximize Your Work-From-Home Productivity in 2026',
    slug: 'top-7-desk-gadgets-wfh-2026',
    excerpt: 'From aluminum ergonomic laptop stands to GaN fast chargers, discover the essentials every modern remote professional needs.',
    content: 'Remote work requires deliberate ergonomics...',
    author: 'Editorial Team',
    category: 'Tech & Gadgets',
    status: 'published',
    publishedDate: '12 Sep 2026',
    coverImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    views: 1420,
    tags: ['Productivity', 'Desk Tech', 'Gadgets']
  },
  {
    id: 'blog-2',
    title: 'Sartorial Guide: Caring for Pure Cotton & Handloom Silk in Monsoon Bangladesh',
    slug: 'caring-for-cotton-and-silk-bangladesh',
    excerpt: 'Simple steps to preserve dye vibrancy, delicate stitch work, and fabric longevity during humid weather.',
    content: 'Bangladesh monsoon humidity can damage natural fibres...',
    author: 'Farhana Kabir',
    category: 'Fashion & Lifestyle',
    status: 'published',
    publishedDate: '05 Sep 2026',
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    views: 980,
    tags: ['Fashion', 'Handloom', 'Textile Care']
  }
];

const INITIAL_PAGES: ContentPageRecord[] = [
  {
    id: 'page-about',
    title: 'About Cholti Mart',
    slug: 'about',
    content: 'Cholti Mart is a modern multi-category lifestyle, fashion, gadgets, and household essentials destination in Bangladesh...',
    author: 'Admin',
    status: 'published',
    lastModified: '10 Sep 2026',
    views: 3100,
    seoTitle: 'About Cholti Mart | Shop Smart, Shop Cholti Mart',
    seoDescription: 'Discover our story, nationwide cash on delivery commitment, and verified product authenticity.'
  },
  {
    id: 'page-terms',
    title: 'Terms & Conditions',
    slug: 'terms',
    content: 'By accessing or purchasing from Cholti Mart (choltimart.com), you agree to be bound by the following terms...',
    author: 'Legal Team',
    status: 'published',
    lastModified: '01 Sep 2026',
    views: 1240
  },
  {
    id: 'page-privacy',
    title: 'Privacy & Data Protection Policy',
    slug: 'privacy',
    content: 'Cholti Mart values your privacy. We collect personal contact details solely for order fulfillment and courier tracking...',
    author: 'Legal Team',
    status: 'published',
    lastModified: '01 Sep 2026',
    views: 1560
  },
  {
    id: 'page-returns',
    title: '7-Day Return & Replacement Policy',
    slug: 'returns',
    content: 'We offer a 7-day hassle-free return window for defective, broken, or mismatched items...',
    author: 'Support Team',
    status: 'published',
    lastModified: '01 Sep 2026',
    views: 2410
  },
  {
    id: 'page-shipping',
    title: 'Nationwide Delivery & Shipping Policy',
    slug: 'shipping',
    content: 'Orders inside Dhaka are delivered within 24-48 hours (৳60). Orders across all 63 other districts are delivered in 48-72 hours (৳130)...',
    author: 'Operations Team',
    status: 'published',
    lastModified: '01 Sep 2026',
    views: 4500
  }
];

class ContentServiceImpl implements IContentService {
  private heroCache: HeroConfig;
  private promoCache: PromoBannerConfig;
  private faqsCache: FAQItem[];
  private testimonialsCache: TestimonialRecord[] = [];
  private blogCache: BlogPostRecord[] = [];
  private pagesCache: ContentPageRecord[] = [];

  constructor() {
    this.heroCache = { ...DEFAULT_MASTER_CONFIG.hero };
    this.promoCache = { ...DEFAULT_MASTER_CONFIG.promoBanner };
    this.faqsCache = [...FAQS_DATA];
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const savedHero = localStorage.getItem(STORAGE_KEYS.HERO);
        if (savedHero) this.heroCache = JSON.parse(savedHero);

        const savedPromo = localStorage.getItem(STORAGE_KEYS.PROMO);
        if (savedPromo) this.promoCache = JSON.parse(savedPromo);

        const savedFaqs = localStorage.getItem(STORAGE_KEYS.FAQS);
        if (savedFaqs) this.faqsCache = JSON.parse(savedFaqs);

        const savedTestimonials = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
        this.testimonialsCache = savedTestimonials ? JSON.parse(savedTestimonials) : [...INITIAL_TESTIMONIALS];

        const savedBlog = localStorage.getItem(STORAGE_KEYS.BLOG);
        this.blogCache = savedBlog ? JSON.parse(savedBlog) : [...INITIAL_BLOG_POSTS];

        const savedPages = localStorage.getItem(STORAGE_KEYS.PAGES);
        this.pagesCache = savedPages ? JSON.parse(savedPages) : [...INITIAL_PAGES];
        return;
      } catch (e) {
        console.warn('Failed to load CMS content from storage', e);
      }
    }
    this.testimonialsCache = [...INITIAL_TESTIMONIALS];
    this.blogCache = [...INITIAL_BLOG_POSTS];
    this.pagesCache = [...INITIAL_PAGES];
  }

  public getHeroConfigSync(): HeroConfig {
    return { ...this.heroCache };
  }

  public async getHeroConfig(): Promise<HeroConfig> {
    return { ...this.heroCache };
  }

  public async updateHeroConfig(updates: Partial<HeroConfig>): Promise<HeroConfig> {
    this.heroCache = { ...this.heroCache, ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(this.heroCache));
    }
    return { ...this.heroCache };
  }

  public getPromoBannerSync(): PromoBannerConfig {
    return { ...this.promoCache };
  }

  public async getPromoBanner(): Promise<PromoBannerConfig> {
    return { ...this.promoCache };
  }

  public async updatePromoBanner(updates: Partial<PromoBannerConfig>): Promise<PromoBannerConfig> {
    this.promoCache = { ...this.promoCache, ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROMO, JSON.stringify(this.promoCache));
    }
    return { ...this.promoCache };
  }

  public getTrustItemsSync(): TrustItem[] {
    return [...TRUST_ITEMS];
  }

  public async getTrustItems(): Promise<TrustItem[]> {
    return [...TRUST_ITEMS];
  }

  public getFaqsSync(): FAQItem[] {
    return [...this.faqsCache];
  }

  public async getFaqs(): Promise<FAQItem[]> {
    return [...this.faqsCache];
  }

  public async updateFaq(index: number, question: string, answer: string): Promise<FAQItem[]> {
    if (this.faqsCache[index]) {
      this.faqsCache[index] = { ...this.faqsCache[index], question, answer };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(this.faqsCache));
      }
    }
    return [...this.faqsCache];
  }

  public async addFaq(faq: FAQItem): Promise<FAQItem[]> {
    this.faqsCache.push(faq);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(this.faqsCache));
    }
    return [...this.faqsCache];
  }

  public getTestimonialsSync(): TestimonialRecord[] {
    return [...this.testimonialsCache];
  }

  public async getTestimonials(): Promise<TestimonialRecord[]> {
    return [...this.testimonialsCache];
  }

  public async addTestimonial(record: Omit<TestimonialRecord, 'id' | 'createdAt'>): Promise<TestimonialRecord> {
    const newT: TestimonialRecord = {
      ...record,
      id: `test-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    this.testimonialsCache.unshift(newT);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(this.testimonialsCache));
    }
    return newT;
  }

  public getBlogPostsSync(): BlogPostRecord[] {
    return [...this.blogCache];
  }

  public async getBlogPosts(): Promise<BlogPostRecord[]> {
    return [...this.blogCache];
  }

  public async createBlogPost(post: Omit<BlogPostRecord, 'id' | 'createdAt' | 'views'>): Promise<BlogPostRecord> {
    const newB: BlogPostRecord = {
      ...post,
      id: `blog-${Date.now()}`,
      views: 0,
      publishedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    this.blogCache.unshift(newB);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(this.blogCache));
    }
    return newB;
  }

  public saveBlogPosts(posts: any[]): void {
    this.blogCache = posts;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(this.blogCache));
    }
  }

  public async getAllPages(): Promise<ContentPageRecord[]> {
    return [...this.pagesCache];
  }

  public async getPages(): Promise<ContentPageRecord[]> {
    return [...this.pagesCache];
  }

  public getPagesSync(): ContentPageRecord[] {
    return [...this.pagesCache];
  }

  public async getPage(slug: string): Promise<ContentPageRecord | null> {
    const found = this.pagesCache.find(p => p.slug === slug);
    return found ? { ...found } : null;
  }

  public async updatePage(slug: string, updates: Partial<ContentPageRecord>): Promise<ContentPageRecord> {
    const index = this.pagesCache.findIndex(p => p.slug === slug);
    if (index === -1) throw new Error(`Page with slug ${slug} not found`);
    this.pagesCache[index] = { ...this.pagesCache[index], ...updates, lastModified: new Date().toLocaleDateString('en-GB') };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(this.pagesCache));
    }
    return this.pagesCache[index];
  }

  public async subscribeNewsletter(email: string): Promise<boolean> {
    if (!email || !email.includes('@')) return false;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cholti_newsletter_subscribers_v1');
        const subscribers: string[] = stored ? JSON.parse(stored) : [];
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          localStorage.setItem('cholti_newsletter_subscribers_v1', JSON.stringify(subscribers));
        }
      } catch (e) {
        console.warn('Failed to save subscriber', e);
      }
    }
    return true;
  }
}

export const contentService: IContentService = new ContentServiceImpl();
