import { Category, Brand, ProductAttribute } from '../../../types';
import { ICategoryAdapter } from './ICategoryAdapter';
import { apiClient } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';
import { assertLiveApiReady, API_CONFIG } from '../../api/config';

export class CategoryApiAdapter implements ICategoryAdapter {
  private categoriesCache: Category[] = [];
  private brandsCache: Brand[] = [];

  constructor() {
    assertLiveApiReady();
  }

  public getCategoriesSync(): Category[] {
    return [...this.categoriesCache];
  }

  public async getCategories(): Promise<Category[]> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<Category[]>(ENDPOINTS.TAXONOMY.CATEGORIES);
      this.categoriesCache = res.data;
      return res.data;
    } catch (err: any) {
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load categories: ${err.message || 'Service unavailable'}`);
      }
      return this.categoriesCache;
    }
  }

  public async getCategoryById(id: string): Promise<Category | null> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<Category>(ENDPOINTS.TAXONOMY.CATEGORY_DETAIL(id));
      return res.data;
    } catch (err: any) {
      if (err.status === 404) return null;
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load category ${id}: ${err.message}`);
      }
      return null;
    }
  }

  public async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    assertLiveApiReady();
    const res = await apiClient.post<Category>(ENDPOINTS.TAXONOMY.CATEGORIES, category);
    return res.data;
  }

  public async updateCategory(idOrCategory: string | Category, updates?: Partial<Category>): Promise<Category> {
    assertLiveApiReady();
    const id = typeof idOrCategory === 'string' ? idOrCategory : idOrCategory.id;
    const body = typeof idOrCategory === 'object' ? idOrCategory : updates;
    const res = await apiClient.put<Category>(ENDPOINTS.TAXONOMY.CATEGORY_DETAIL(id), body);
    return res.data;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    assertLiveApiReady();
    const res = await apiClient.delete<{ success: boolean }>(ENDPOINTS.TAXONOMY.CATEGORY_DETAIL(id));
    return res.isSuccess;
  }

  public getBrandsSync(): Brand[] {
    return [...this.brandsCache];
  }

  public async getBrands(): Promise<Brand[]> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<Brand[]>(ENDPOINTS.TAXONOMY.BRANDS);
      this.brandsCache = res.data;
      return res.data;
    } catch (err: any) {
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load brands: ${err.message || 'Service unavailable'}`);
      }
      return this.brandsCache;
    }
  }

  public async getBrandById(id: string): Promise<Brand | null> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<Brand>(ENDPOINTS.TAXONOMY.BRAND_DETAIL(id));
      return res.data;
    } catch (err: any) {
      if (err.status === 404) return null;
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load brand ${id}: ${err.message}`);
      }
      return null;
    }
  }

  public async createBrand(brand: Omit<Brand, 'id'>): Promise<Brand> {
    assertLiveApiReady();
    const res = await apiClient.post<Brand>(ENDPOINTS.TAXONOMY.BRANDS, brand);
    return res.data;
  }

  public async updateBrand(idOrBrand: string | Brand, updates?: Partial<Brand>): Promise<Brand> {
    assertLiveApiReady();
    const id = typeof idOrBrand === 'string' ? idOrBrand : idOrBrand.id;
    const body = typeof idOrBrand === 'object' ? idOrBrand : updates;
    const res = await apiClient.put<Brand>(ENDPOINTS.TAXONOMY.BRAND_DETAIL(id), body);
    return res.data;
  }

  public async deleteBrand(id: string): Promise<boolean> {
    assertLiveApiReady();
    const res = await apiClient.delete<{ success: boolean }>(ENDPOINTS.TAXONOMY.BRAND_DETAIL(id));
    return res.isSuccess;
  }

  public async getTags(): Promise<string[]> {
    assertLiveApiReady();
    const res = await apiClient.get<string[]>('/taxonomy/tags');
    return res.data;
  }

  public async getAttributes(): Promise<ProductAttribute[]> {
    assertLiveApiReady();
    const res = await apiClient.get<ProductAttribute[]>('/taxonomy/attributes');
    return res.data;
  }
}
