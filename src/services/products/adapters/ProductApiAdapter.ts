import { Product } from '../../types';
import { ProductQueryParams, CreateProductDTO, UpdateProductDTO, PaginatedProductsResponse } from '../types';
import { IProductAdapter } from './IProductAdapter';
import { apiClient } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';
import { assertLiveApiReady, API_CONFIG } from '../../api/config';

export class ProductApiAdapter implements IProductAdapter {
  private fallbackCache: Product[] = [];

  constructor() {
    assertLiveApiReady();
  }

  public getProductsSync(): Product[] {
    return [...this.fallbackCache];
  }

  public async getProducts(params?: ProductQueryParams): Promise<Product[]> {
    assertLiveApiReady();
    try {
      const response = await apiClient.get<Product[]>(ENDPOINTS.PRODUCTS.LIST, params);
      this.fallbackCache = response.data;
      return response.data;
    } catch (err: any) {
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load product catalog: ${err.message || 'Service unavailable'}`);
      }
      console.error('[ProductApiAdapter] Error fetching products:', err);
      return this.fallbackCache;
    }
  }

  public async getProductsPaginated(params?: ProductQueryParams): Promise<PaginatedProductsResponse> {
    assertLiveApiReady();
    try {
      const response = await apiClient.get<PaginatedProductsResponse>(ENDPOINTS.PRODUCTS.LIST, {
        ...params,
        paginated: true,
      });
      return response.data;
    } catch (err: any) {
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load paginated products: ${err.message || 'Service unavailable'}`);
      }
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
        hasMore: false,
      };
    }
  }

  public async getProductById(id: string): Promise<Product | null> {
    assertLiveApiReady();
    try {
      const response = await apiClient.get<Product>(ENDPOINTS.PRODUCTS.DETAIL(id));
      return response.data;
    } catch (err: any) {
      if (err.status === 404) return null;
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to retrieve product details: ${err.message}`);
      }
      return null;
    }
  }

  public async getProductBySlug(slug: string): Promise<Product | null> {
    assertLiveApiReady();
    try {
      const response = await apiClient.get<Product>(ENDPOINTS.PRODUCTS.DETAIL(slug));
      return response.data;
    } catch (err: any) {
      if (err.status === 404) return null;
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to retrieve product by slug: ${err.message}`);
      }
      return null;
    }
  }

  // --- Updated to support FormData (File Uploads) ---
  public async createProduct(dto: CreateProductDTO | FormData): Promise<Product> {
    assertLiveApiReady();
    const response = await apiClient.post<Product>(ENDPOINTS.PRODUCTS.CREATE, dto);
    return response.data;
  }

  public async updateProduct(idOrProduct: string | Product, updates?: UpdateProductDTO | FormData): Promise<Product> {
    assertLiveApiReady();
    const id = typeof idOrProduct === 'string' ? idOrProduct : idOrProduct.id;
    const body = typeof idOrProduct === 'object' && !(idOrProduct instanceof FormData) ? idOrProduct : updates;
    const response = await apiClient.put<Product>(ENDPOINTS.PRODUCTS.UPDATE(id), body);
    return response.data;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    assertLiveApiReady();
    const response = await apiClient.delete<{ success: boolean }>(ENDPOINTS.PRODUCTS.DELETE(id));
    return response.isSuccess;
  }

  public async bulkDeleteProducts(ids: string[]): Promise<boolean> {
    assertLiveApiReady();
    const response = await apiClient.post<{ success: boolean }>('/products/bulk-delete', { ids });
    return response.isSuccess;
  }

  public async bulkUpdateStatus(ids: string[], status: 'draft' | 'published' | 'out_of_stock' | 'archived'): Promise<void> {
    assertLiveApiReady();
    await apiClient.post('/products/bulk-status', { ids, status });
  }

  public async bulkAssignCategory(ids: string[], category: string): Promise<void> {
    assertLiveApiReady();
    await apiClient.post('/products/bulk-category', { ids, category });
  }

  public async updateStock(id: string, newStock: number, reason?: string): Promise<Product> {
    assertLiveApiReady();
    const response = await apiClient.put<Product>(ENDPOINTS.PRODUCTS.STOCK(id), {
      stockQuantity: newStock,
      reason,
    });
    return response.data;
  }

  public async getFeatured(): Promise<Product[]> {
    assertLiveApiReady();
    const response = await apiClient.get<Product[]>(ENDPOINTS.PRODUCTS.FEATURED);
    return response.data;
  }

  public async getTrending(): Promise<Product[]> {
    assertLiveApiReady();
    const response = await apiClient.get<Product[]>(ENDPOINTS.PRODUCTS.TRENDING);
    return response.data;
  }

  public async getSpecialOffers(): Promise<Product[]> {
    assertLiveApiReady();
    const response = await apiClient.get<Product[]>(ENDPOINTS.PRODUCTS.SPECIAL_OFFERS);
    return response.data;
  }
}