export interface MediaItem {
  id: string;
  name: string;
  url: string;
  altText: string;
  fileSize: string;
  dimensions: string;
  uploadedAt: string;
  mimeType: string;
  category: 'product' | 'banner' | 'brand' | 'other';
}

export interface IMediaService {
  getMedia(): Promise<MediaItem[]>;
  getMediaSync(): MediaItem[];
  uploadMedia(file: { name: string; url: string; altText?: string; fileSize?: string; category?: 'product' | 'banner' | 'brand' | 'other' }): Promise<MediaItem>;
  deleteMedia(id: string): Promise<boolean>;
  searchMedia(query: string): Promise<MediaItem[]>;
}

const STORAGE_KEY = 'cholti_admin_media_library_v1';

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-1',
    name: 'aluminum-laptop-stand-hero.jpg',
    url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    altText: 'Adjustable ergonomic aluminum laptop riser stand',
    fileSize: '342 KB',
    dimensions: '1200 x 900',
    uploadedAt: '17 Sep 2026',
    mimeType: 'image/jpeg',
    category: 'product'
  },
  {
    id: 'med-2',
    name: 'aarong-kurti-green.jpg',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    altText: 'Embroidered cotton festive ethnic kurti set',
    fileSize: '480 KB',
    dimensions: '1080 x 1350',
    uploadedAt: '16 Sep 2026',
    mimeType: 'image/jpeg',
    category: 'product'
  },
  {
    id: 'med-3',
    name: 'women-leather-crossbody-bag.jpg',
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    altText: 'Premium vegan leather crossbody handbag in caramel brown',
    fileSize: '512 KB',
    dimensions: '1200 x 1200',
    uploadedAt: '15 Sep 2026',
    mimeType: 'image/jpeg',
    category: 'product'
  },
  {
    id: 'med-4',
    name: 'banner-eid-promotions.jpg',
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    altText: 'Promotional shopping banner deals & discounts',
    fileSize: '890 KB',
    dimensions: '1920 x 650',
    uploadedAt: '10 Sep 2026',
    mimeType: 'image/jpeg',
    category: 'banner'
  }
];

class MediaServiceImpl implements IMediaService {
  private cache: MediaItem[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.cache = parsed;
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to load media cache', e);
      }
    }
    this.cache = [...INITIAL_MEDIA_ITEMS];
    this.persist();
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      } catch (e) {
        console.warn('Failed to persist media cache', e);
      }
    }
  }

  public getMediaSync(): MediaItem[] {
    return [...this.cache];
  }

  public async getMedia(): Promise<MediaItem[]> {
    return [...this.cache];
  }

  public async uploadMedia(file: {
    name: string;
    url: string;
    altText?: string;
    fileSize?: string;
    category?: 'product' | 'banner' | 'brand' | 'other';
  }): Promise<MediaItem> {
    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      name: file.name,
      url: file.url,
      altText: file.altText || file.name,
      fileSize: file.fileSize || '350 KB',
      dimensions: '1200 x 1200',
      uploadedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      mimeType: 'image/jpeg',
      category: file.category || 'product',
    };
    this.cache.unshift(newItem);
    this.persist();
    return newItem;
  }

  public async deleteMedia(id: string): Promise<boolean> {
    const prev = this.cache.length;
    this.cache = this.cache.filter(m => m.id !== id);
    if (this.cache.length !== prev) {
      this.persist();
      return true;
    }
    return false;
  }

  public async searchMedia(query: string): Promise<MediaItem[]> {
    const q = query.toLowerCase();
    return this.cache.filter(m => m.name.toLowerCase().includes(q) || m.altText.toLowerCase().includes(q));
  }
}

export const mediaService: IMediaService = new MediaServiceImpl();
