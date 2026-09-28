import { Product } from '../../types';

export interface ProductQueryParams {
  category?: string;
  subcategory?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  status?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isSpecialOffer?: boolean;
  sortBy?: 'default' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface PaginatedProductsResponse {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit?: number;
  hasMore?: boolean;
}
