export interface SeoMetadata {
  pageKey: string;
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
}

export interface ISeoService {
  getSeoMetadata(pageKey: string): Promise<SeoMetadata>;
  getSeoMetadataSync(pageKey: string): SeoMetadata;
  updateSeoMetadata(pageKey: string, updates: Partial<SeoMetadata>): Promise<SeoMetadata>;
  getAllSeoConfigs(): Promise<Record<string, SeoMetadata>>;
}

const SEO_STORAGE_KEY = 'cholti_admin_seo_configs_v1';

const DEFAULT_SEO_CONFIGS: Record<string, SeoMetadata> = {
  home: {
    pageKey: 'home',
    title: 'Cholti Mart | Everyday Finds. Better Choices. Online Shopping in Bangladesh',
    description: 'Shop curated fashion, lifestyle accessories, 18K anti-tarnish jewelry, and smart home gadgets with nationwide Cash on Delivery across all 64 districts in Bangladesh.',
    keywords: ['cholti mart', 'online shop bangladesh', 'cash on delivery', 'gadgets dhaka', 'women kurti'],
    ogTitle: 'Cholti Mart | Everyday Finds. Better Choices.',
    ogDescription: 'Everyday lifestyle, apparel, and workspace gadgets thoughtfully curated with reliable Cash on Delivery in Bangladesh.',
    ogImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200&auto=format&fit=crop&q=80',
    robots: 'index, follow'
  },
  shop: {
    pageKey: 'shop',
    title: 'Shop All Products | Cholti Mart Bangladesh',
    description: 'Browse all products across fashion, jewelry, computer accessories, and electronics with quick district filtering and doorstep delivery.',
    keywords: ['buy gadgets online', 'cholti mart catalog', 'bangladesh ecommerce'],
    robots: 'index, follow'
  },
  about: {
    pageKey: 'about',
    title: 'About Cholti Mart | Authentic Lifestyle & Gadgets',
    description: 'Learn about Cholti Mart mission to deliver genuine consumer essentials with upfront pricing and zero counterfeit products.',
    robots: 'index, follow'
  },
  faq: {
    pageKey: 'faq',
    title: 'Help & FAQs | Delivery, COD & Returns Policy | Cholti Mart',
    description: 'Frequently asked questions regarding order verification, courier tracking numbers, refund terms, and exchange process.',
    robots: 'index, follow'
  }
};

class SeoServiceImpl implements ISeoService {
  private configs: Record<string, SeoMetadata> = {};

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(SEO_STORAGE_KEY);
        if (stored) {
          this.configs = JSON.parse(stored);
          return;
        }
      } catch (e) {
        console.warn('Failed to parse SEO configs', e);
      }
    }
    this.configs = { ...DEFAULT_SEO_CONFIGS };
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(this.configs));
      } catch (e) {
        console.warn('Failed to persist SEO configs', e);
      }
    }
  }

  public getSeoMetadataSync(pageKey: string): SeoMetadata {
    return this.configs[pageKey] || {
      pageKey,
      title: `${pageKey.toUpperCase()} | Cholti Mart`,
      description: 'Cholti Mart - Everyday Finds. Better Choices.',
      robots: 'index, follow'
    };
  }

  public async getSeoMetadata(pageKey: string): Promise<SeoMetadata> {
    return this.getSeoMetadataSync(pageKey);
  }

  public async updateSeoMetadata(pageKey: string, updates: Partial<SeoMetadata>): Promise<SeoMetadata> {
    const existing = this.getSeoMetadataSync(pageKey);
    const updated: SeoMetadata = {
      ...existing,
      ...updates,
      pageKey
    };
    this.configs[pageKey] = updated;
    this.persist();
    return updated;
  }

  public async getAllSeoConfigs(): Promise<Record<string, SeoMetadata>> {
    return { ...this.configs };
  }
}

export const seoService = new SeoServiceImpl();
