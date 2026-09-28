import { Brand } from '../../types';
import { INITIAL_BRANDS } from '../adminMockService';
import { API_CONFIG } from '../api/config';
import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export interface IBrandService {
  getBrands(): Promise<Brand[]>;
  getBrandsSync(): Brand[];
  getBrandById(id: string): Promise<Brand | null>;
  createBrand(brand: Omit<Brand, 'id'>): Promise<Brand>;
  updateBrand(idOrBrand: string | Brand, updates?: Partial<Brand>): Promise<Brand>;
  deleteBrand(id: string): Promise<boolean>;
}

const BRANDS_KEY = 'cholti_admin_brands_v1';

class BrandServiceImpl implements IBrandService {
  private brandsCache: Brand[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(BRANDS_KEY);
        if (stored) {
          this.brandsCache = JSON.parse(stored);
        } else {
          this.brandsCache = [...INITIAL_BRANDS];
          localStorage.setItem(BRANDS_KEY, JSON.stringify(this.brandsCache));
        }
        return;
      } catch (e) {
        console.warn('Failed to load brands from storage', e);
      }
    }
    this.brandsCache = [...INITIAL_BRANDS];
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BRANDS_KEY, JSON.stringify(this.brandsCache));
      } catch (e) {
        console.warn('Failed to persist brands to storage', e);
      }
    }
  }

  public getBrandsSync(): Brand[] {
    return [...this.brandsCache];
  }

  public async getBrands(): Promise<Brand[]> {
    if (!API_CONFIG.isMockMode) {
      try {
        const res = await apiClient.get<Brand[]>(ENDPOINTS.TAXONOMY.BRANDS);
        if (res.data) return res.data;
      } catch {
        // Fallback to local cache
      }
    }
    return [...this.brandsCache];
  }

  public async getBrandById(id: string): Promise<Brand | null> {
    return this.brandsCache.find(b => b.id === id) || null;
  }

  public async createBrand(brandData: Omit<Brand, 'id'>): Promise<Brand> {
    const newBrand: Brand = {
      ...brandData,
      id: `brand-${Date.now().toString(36)}`
    };
    this.brandsCache.push(newBrand);
    this.persist();
    return newBrand;
  }

  public async updateBrand(idOrBrand: string | Brand, updates?: Partial<Brand>): Promise<Brand> {
    const id = typeof idOrBrand === 'string' ? idOrBrand : idOrBrand.id;
    const diff = typeof idOrBrand === 'string' ? (updates || {}) : idOrBrand;
    const index = this.brandsCache.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error(`Brand with ID "${id}" not found`);
    }
    this.brandsCache[index] = { ...this.brandsCache[index], ...diff };
    this.persist();
    return this.brandsCache[index];
  }

  public async deleteBrand(id: string): Promise<boolean> {
    const prevLen = this.brandsCache.length;
    this.brandsCache = this.brandsCache.filter(b => b.id !== id);
    if (this.brandsCache.length !== prevLen) {
      this.persist();
      return true;
    }
    return false;
  }
}

export const brandService = new BrandServiceImpl();
