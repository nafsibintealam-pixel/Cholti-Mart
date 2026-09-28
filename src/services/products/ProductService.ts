import { Product } from '../../types';
import { ProductQueryParams, CreateProductDTO, UpdateProductDTO, PaginatedProductsResponse } from './types';
import { API_CONFIG } from '../api/config';
import { IProductAdapter } from './adapters/IProductAdapter';
import { ProductMockAdapter } from './adapters/ProductMockAdapter';
import { ProductApiAdapter } from './adapters/ProductApiAdapter';

export interface IProductService {
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
  toWooCommercePayload(product: Product): Record<string, any>;
  subscribe(callback: () => void): () => void;
  getAdapterType(): 'mock' | 'api';
}

class ProductServiceImpl implements IProductService {
  private mockAdapter: ProductMockAdapter;
  private apiAdapter: ProductApiAdapter | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.mockAdapter = new ProductMockAdapter();
  }

  private getAdapter(): IProductAdapter {
    if (API_CONFIG.isMockMode) {
      return this.mockAdapter;
    }
    if (!this.apiAdapter) {
      this.apiAdapter = new ProductApiAdapter();
    }
    return this.apiAdapter;
  }

  public getAdapterType(): 'mock' | 'api' {
    return API_CONFIG.isMockMode ? 'mock' : 'api';
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }

  public getProductsSync(): Product[] {
    return this.getAdapter().getProductsSync();
  }

  public async getProducts(params?: ProductQueryParams): Promise<Product[]> {
    return this.getAdapter().getProducts(params);
  }

  public async getProductsPaginated(params?: ProductQueryParams): Promise<PaginatedProductsResponse> {
    return this.getAdapter().getProductsPaginated(params);
  }

  public async getProductById(id: string): Promise<Product | null> {
    return this.getAdapter().getProductById(id);
  }

  public async getProductBySlug(slug: string): Promise<Product | null> {
    return this.getAdapter().getProductBySlug(slug);
  }

  public async createProduct(dto: CreateProductDTO): Promise<Product> {
    const res = await this.getAdapter().createProduct(dto);
    this.notify();
    return res;
  }

  public async updateProduct(idOrProduct: string | Product, updates?: UpdateProductDTO): Promise<Product> {
    const res = await this.getAdapter().updateProduct(idOrProduct, updates);
    this.notify();
    return res;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const res = await this.getAdapter().deleteProduct(id);
    if (res) this.notify();
    return res;
  }

  public async bulkDeleteProducts(ids: string[]): Promise<boolean> {
    const res = await this.getAdapter().bulkDeleteProducts(ids);
    if (res) this.notify();
    return res;
  }

  public async bulkUpdateStatus(ids: string[], status: 'draft' | 'published' | 'out_of_stock' | 'archived'): Promise<void> {
    await this.getAdapter().bulkUpdateStatus(ids, status);
    this.notify();
  }

  public async bulkAssignCategory(ids: string[], category: string): Promise<void> {
    await this.getAdapter().bulkAssignCategory(ids, category);
    this.notify();
  }

  public async updateStock(id: string, newStock: number, reason?: string): Promise<Product> {
    const res = await this.getAdapter().updateStock(id, newStock, reason);
    this.notify();
    return res;
  }

  public async getFeatured(): Promise<Product[]> {
    return this.getAdapter().getFeatured();
  }

  public async getTrending(): Promise<Product[]> {
    return this.getAdapter().getTrending();
  }

  public async getSpecialOffers(): Promise<Product[]> {
    return this.getAdapter().getSpecialOffers();
  }

  public toWooCommercePayload(product: Product): Record<string, any> {
    return {
      id: product.wooId,
      name: product.name,
      slug: product.slug,
      type: 'simple',
      status: product.status === 'published' ? 'publish' : product.status === 'draft' ? 'draft' : 'pending',
      featured: !!product.isFeatured,
      catalog_visibility: 'visible',
      description: product.description,
      short_description: product.shortDescription,
      sku: product.sku,
      price: product.salePrice ? String(product.salePrice) : String(product.price),
      regular_price: String(product.regularPrice || product.price),
      sale_price: product.salePrice ? String(product.salePrice) : '',
      manage_stock: true,
      stock_quantity: product.stockQuantity ?? product.stockCount,
      stock_status: (product.stockQuantity ?? product.stockCount) > 0 ? 'instock' : 'outofstock',
      low_stock_amount: product.lowStockThreshold || 10,
      categories: [
        { name: product.category, slug: product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      ],
      tags: (product.tags || []).map(t => ({ name: t })),
      images: (product.images || []).map(src => ({ src })),
      attributes: (product.attributes || []).map((attr, idx) => ({
        id: idx + 1,
        name: attr.name,
        position: idx,
        visible: attr.visible,
        variation: !!attr.variation,
        options: attr.options
      })),
      meta_data: [
        { key: '_cost_price', value: String(product.costPrice || '') },
        { key: '_brand_name', value: product.brand || '' }
      ]
    };
  }
}

export const productService: IProductService = new ProductServiceImpl();
