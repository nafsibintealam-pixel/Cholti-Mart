import { Category, Brand, ProductAttribute } from '../../types';
import { API_CONFIG } from '../api/config';
import { ICategoryAdapter } from './adapters/ICategoryAdapter';
import { CategoryMockAdapter } from './adapters/CategoryMockAdapter';
import { CategoryApiAdapter } from './adapters/CategoryApiAdapter';

export interface ICategoryService {
  getCategories(): Promise<Category[]>;
  getCategoriesSync(): Category[];
  getCategoryById(id: string): Promise<Category | null>;
  createCategory(category: Omit<Category, 'id'>): Promise<Category>;
  updateCategory(idOrCategory: string | Category, updates?: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;

  getBrands(): Promise<Brand[]>;
  getBrandsSync(): Brand[];
  getBrandById(id: string): Promise<Brand | null>;
  createBrand(brand: Omit<Brand, 'id'>): Promise<Brand>;
  updateBrand(idOrBrand: string | Brand, updates?: Partial<Brand>): Promise<Brand>;
  deleteBrand(id: string): Promise<boolean>;

  getTags(): Promise<string[]>;
  getAttributes(): Promise<ProductAttribute[]>;
  getAdapterType(): 'mock' | 'api';
}

class CategoryServiceImpl implements ICategoryService {
  private mockAdapter: CategoryMockAdapter;
  private apiAdapter: CategoryApiAdapter | null = null;

  constructor() {
    this.mockAdapter = new CategoryMockAdapter();
  }

  private getAdapter(): ICategoryAdapter {
    if (API_CONFIG.isMockMode) {
      return this.mockAdapter;
    }
    if (!this.apiAdapter) {
      this.apiAdapter = new CategoryApiAdapter();
    }
    return this.apiAdapter;
  }

  public getAdapterType(): 'mock' | 'api' {
    return API_CONFIG.isMockMode ? 'mock' : 'api';
  }

  public getCategoriesSync(): Category[] {
    return this.getAdapter().getCategoriesSync();
  }

  public async getCategories(): Promise<Category[]> {
    return this.getAdapter().getCategories();
  }

  public async getCategoryById(id: string): Promise<Category | null> {
    return this.getAdapter().getCategoryById(id);
  }

  public async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return this.getAdapter().createCategory(category);
  }

  public async updateCategory(idOrCategory: string | Category, updates?: Partial<Category>): Promise<Category> {
    return this.getAdapter().updateCategory(idOrCategory, updates);
  }

  public async deleteCategory(id: string): Promise<boolean> {
    return this.getAdapter().deleteCategory(id);
  }

  public getBrandsSync(): Brand[] {
    return this.getAdapter().getBrandsSync();
  }

  public async getBrands(): Promise<Brand[]> {
    return this.getAdapter().getBrands();
  }

  public async getBrandById(id: string): Promise<Brand | null> {
    return this.getAdapter().getBrandById(id);
  }

  public async createBrand(brand: Omit<Brand, 'id'>): Promise<Brand> {
    return this.getAdapter().createBrand(brand);
  }

  public async updateBrand(idOrBrand: string | Brand, updates?: Partial<Brand>): Promise<Brand> {
    return this.getAdapter().updateBrand(idOrBrand, updates);
  }

  public async deleteBrand(id: string): Promise<boolean> {
    return this.getAdapter().deleteBrand(id);
  }

  public async getTags(): Promise<string[]> {
    return this.getAdapter().getTags();
  }

  public async getAttributes(): Promise<ProductAttribute[]> {
    return this.getAdapter().getAttributes();
  }
}

export const categoryService: ICategoryService = new CategoryServiceImpl();
