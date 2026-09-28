import { Category, Brand, ProductAttribute } from '../../../types';
import { CATEGORIES_DATA } from '../../../data/categories';
import { INITIAL_BRANDS } from '../../adminMockService';
import { ICategoryAdapter } from './ICategoryAdapter';

const CATEGORIES_KEY = 'cholti_admin_categories_v1';
const BRANDS_KEY = 'cholti_admin_brands_v1';

export class CategoryMockAdapter implements ICategoryAdapter {
  private categoriesCache: Category[] = [];
  private brandsCache: Brand[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const storedCats = localStorage.getItem(CATEGORIES_KEY);
        if (storedCats) {
          this.categoriesCache = JSON.parse(storedCats);
        } else {
          this.categoriesCache = [...CATEGORIES_DATA];
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(this.categoriesCache));
        }

        const storedBrands = localStorage.getItem(BRANDS_KEY);
        if (storedBrands) {
          this.brandsCache = JSON.parse(storedBrands);
        } else {
          this.brandsCache = [...INITIAL_BRANDS];
          localStorage.setItem(BRANDS_KEY, JSON.stringify(this.brandsCache));
        }
        return;
      } catch (e) {
        console.warn('Failed to load categories/brands from storage', e);
      }
    }
    this.categoriesCache = [...CATEGORIES_DATA];
    this.brandsCache = [...INITIAL_BRANDS];
  }

  private persistCategories() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(this.categoriesCache));
      } catch (e) {
        console.warn('Failed to save categories', e);
      }
    }
  }

  private persistBrands() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BRANDS_KEY, JSON.stringify(this.brandsCache));
      } catch (e) {
        console.warn('Failed to save brands', e);
      }
    }
  }

  public getCategoriesSync(): Category[] {
    return [...this.categoriesCache];
  }

  public async getCategories(): Promise<Category[]> {
    return [...this.categoriesCache];
  }

  public async getCategoryById(id: string): Promise<Category | null> {
    const found = this.categoriesCache.find(c => c.id === id || c.slug === id);
    return found ? { ...found } : null;
  }

  public async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const newCat: Category = {
      ...category,
      id: category.slug || `cat-${Date.now()}`,
      subcategories: category.subcategories || [],
      itemCount: category.itemCount || 0,
    };
    this.categoriesCache.push(newCat);
    this.persistCategories();
    return newCat;
  }

  public async updateCategory(idOrCategory: string | Category, updates?: Partial<Category>): Promise<Category> {
    const id = typeof idOrCategory === 'string' ? idOrCategory : idOrCategory.id;
    const diff = typeof idOrCategory === 'string' ? (updates || {}) : idOrCategory;
    const index = this.categoriesCache.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Category ${id} not found`);
    this.categoriesCache[index] = { ...this.categoriesCache[index], ...diff };
    this.persistCategories();
    return this.categoriesCache[index];
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const prevLen = this.categoriesCache.length;
    this.categoriesCache = this.categoriesCache.filter(c => c.id !== id);
    if (this.categoriesCache.length !== prevLen) {
      this.persistCategories();
      return true;
    }
    return false;
  }

  public getBrandsSync(): Brand[] {
    return [...this.brandsCache];
  }

  public async getBrands(): Promise<Brand[]> {
    return [...this.brandsCache];
  }

  public async getBrandById(id: string): Promise<Brand | null> {
    const found = this.brandsCache.find(b => b.id === id || b.slug === id);
    return found ? { ...found } : null;
  }

  public async createBrand(brand: Omit<Brand, 'id'>): Promise<Brand> {
    const newBrand: Brand = {
      ...brand,
      id: brand.slug || `brand-${Date.now()}`,
      productCount: brand.productCount || 0,
    };
    this.brandsCache.push(newBrand);
    this.persistBrands();
    return newBrand;
  }

  public async updateBrand(idOrBrand: string | Brand, updates?: Partial<Brand>): Promise<Brand> {
    const id = typeof idOrBrand === 'string' ? idOrBrand : idOrBrand.id;
    const diff = typeof idOrBrand === 'string' ? (updates || {}) : idOrBrand;
    const index = this.brandsCache.findIndex(b => b.id === id);
    if (index === -1) throw new Error(`Brand ${id} not found`);
    this.brandsCache[index] = { ...this.brandsCache[index], ...diff };
    this.persistBrands();
    return this.brandsCache[index];
  }

  public async deleteBrand(id: string): Promise<boolean> {
    const prevLen = this.brandsCache.length;
    this.brandsCache = this.brandsCache.filter(b => b.id !== id);
    if (this.brandsCache.length !== prevLen) {
      this.persistBrands();
      return true;
    }
    return false;
  }

  public async getTags(): Promise<string[]> {
    return [
      'New Arrival', 'Best Seller', 'Summer Deal', 'Eid Special', 'Flash Sale',
      'Trending', 'Handmade', 'Ergonomic', 'Smart Tech', 'Premium Leather'
    ];
  }

  public async getAttributes(): Promise<ProductAttribute[]> {
    return [
      { id: 'attr-color', name: 'Color', options: ['Black', 'White', 'Space Gray', 'Navy', 'Silver', 'Olive Green', 'Caramel'], visible: true, variation: true },
      { id: 'attr-size', name: 'Size', options: ['S', 'M', 'L', 'XL', 'Free Size', 'Adjustable'], visible: true, variation: true },
      { id: 'attr-material', name: 'Material', options: ['Pure Cotton', 'Aluminum Alloy', 'Genuine Leather', 'Braided Nylon'], visible: true, variation: false },
      { id: 'attr-warranty', name: 'Warranty', options: ['7 Days Replacement', '6 Months Official', '1 Year Official', 'No Warranty'], visible: true, variation: false }
    ];
  }
}
