import { Product } from '../../../types';
import { ProductQueryParams, CreateProductDTO, UpdateProductDTO, PaginatedProductsResponse } from '../types';

export interface IProductAdapter {
  getProducts(params?: ProductQueryParams): Promise<Product[]>;
  getProductsPaginated(params?: ProductQueryParams): Promise<PaginatedProductsResponse>;
  getProductsSync(): Product[];
  getProductById(id: string): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  createProduct(dto: CreateProductDTO): Promise<Product>;
  updateProduct(idOrProduct: string | Product, updates?: UpdateProductDTO): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  bulkDeleteProducts(ids: string[]): Promise<boolean>;
  bulkUpdateStatus(ids: string[], status: 'draft' | 'published' | 'out_of_stock' | 'archived'): Promise<void>;
  bulkAssignCategory(ids: string[], category: string): Promise<void>;
  updateStock(id: string, newStock: number, reason?: string): Promise<Product>;
  getFeatured(): Promise<Product[]>;
  getTrending(): Promise<Product[]>;
  getSpecialOffers(): Promise<Product[]>;
}
