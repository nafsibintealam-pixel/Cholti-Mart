import { Category, Brand, ProductAttribute } from '../../../types';

export interface ICategoryAdapter {
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
}
