import { Product } from '../../../types';
import { DEMO_PRODUCTS } from '../../../data/products';
import { ProductQueryParams, CreateProductDTO, UpdateProductDTO, PaginatedProductsResponse } from '../types';
import { IProductAdapter } from './IProductAdapter';

const STORAGE_KEY = 'cholti_mock_products_v1';

export class ProductMockAdapter implements IProductAdapter {
  private cache: Product[] = [];

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
        console.warn('Failed to read products from storage, using seed data', e);
      }
    }
    this.cache = [...DEMO_PRODUCTS];
    this.persist();
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      } catch (e) {
        console.warn('Failed to persist products cache', e);
      }
    }
  }

  public getProductsSync(): Product[] {
    return [...this.cache];
  }

  public async getProducts(params?: ProductQueryParams): Promise<Product[]> {
    let list = [...this.cache];

    if (params) {
      if (params.category && params.category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params.subcategory) {
        list = list.filter(p => p.subcategory?.toLowerCase() === params.subcategory!.toLowerCase());
      }
      if (params.brand) {
        list = list.filter(p => p.brand?.toLowerCase() === params.brand!.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      if (params.minPrice !== undefined) {
        list = list.filter(p => p.price >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        list = list.filter(p => p.price <= params.maxPrice!);
      }
      if (params.inStockOnly) {
        list = list.filter(p => p.inStock && p.stockCount > 0);
      }
      if (params.isFeatured) {
        list = list.filter(p => p.isFeatured);
      }
      if (params.isTrending) {
        list = list.filter(p => p.isTrending);
      }
      if (params.isSpecialOffer) {
        list = list.filter(p => p.isSpecialOffer || (p.oldPrice && p.oldPrice > p.price));
      }

      if (params.sortBy) {
        switch (params.sortBy) {
          case 'price-asc':
            list.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            list.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            list.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
            break;
          default:
            break;
        }
      }
    }

    return list;
  }

  public async getProductsPaginated(params?: ProductQueryParams): Promise<PaginatedProductsResponse> {
    const all = await this.getProducts(params);
    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const items = all.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages
    };
  }

  public async getProductById(id: string): Promise<Product | null> {
    const found = this.cache.find(p => p.id === id);
    return found ? { ...found } : null;
  }

  public async getProductBySlug(slug: string): Promise<Product | null> {
    const found = this.cache.find(p => p.slug === slug);
    return found ? { ...found } : null;
  }

  public async createProduct(dto: CreateProductDTO): Promise<Product> {
    const newId = `prod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const product: Product = {
      id: newId,
      name: dto.name,
      slug: dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      sku: dto.sku || `SKU-${Date.now().toString().slice(-6)}`,
      category: dto.category,
      categoryId: dto.categoryId,
      categories: dto.categories || [dto.category],
      subcategory: dto.subcategory || '',
      brand: dto.brand,
      brandId: dto.brandId,
      price: dto.price,
      regularPrice: dto.regularPrice || dto.price,
      salePrice: dto.salePrice,
      costPrice: dto.costPrice,
      rating: 5.0,
      reviewCount: 0,
      reviewsCount: 0,
      images: dto.images.length > 0 ? dto.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
      shortDescription: dto.shortDescription || '',
      description: dto.description || '',
      inStock: dto.inStock !== undefined ? dto.inStock : (dto.stockCount > 0),
      stockCount: dto.stockCount || 0,
      stock: dto.stockCount || 0,
      stockQuantity: dto.stockCount || 0,
      lowStockThreshold: dto.lowStockThreshold || 5,
      status: dto.status || 'published',
      isFeatured: !!dto.isFeatured,
      isTrending: !!dto.isTrending,
      isSpecialOffer: !!dto.isSpecialOffer,
      tags: dto.tags || [],
      specifications: dto.specifications || {},
      variations: dto.variations || [],
      reviewsList: [],
      createdAt: now,
      updatedAt: now,
    };

    this.cache.unshift(product);
    this.persist();
    return product;
  }

  public async updateProduct(idOrProduct: string | Product, updates?: UpdateProductDTO): Promise<Product> {
    const id = typeof idOrProduct === 'string' ? idOrProduct : idOrProduct.id;
    const index = this.cache.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error(`Product with ID ${id} not found.`);
    }

    const current = this.cache[index];
    const updateData = typeof idOrProduct === 'object' ? idOrProduct : (updates || {});

    const updated: Product = {
      ...current,
      ...updateData,
      updatedAt: new Date().toISOString(),
      inStock: updateData.stockCount !== undefined ? (updateData.stockCount > 0) : current.inStock,
    };

    this.cache[index] = updated;
    this.persist();
    return updated;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const initialLen = this.cache.length;
    this.cache = this.cache.filter(p => p.id !== id);
    if (this.cache.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  public async bulkDeleteProducts(ids: string[]): Promise<boolean> {
    const idSet = new Set(ids);
    this.cache = this.cache.filter(p => !idSet.has(p.id));
    this.persist();
    return true;
  }

  public async bulkUpdateStatus(ids: string[], status: 'draft' | 'published' | 'out_of_stock' | 'archived'): Promise<void> {
    const idSet = new Set(ids);
    this.cache = this.cache.map(p => {
      if (idSet.has(p.id)) {
        return {
          ...p,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    this.persist();
  }

  public async bulkAssignCategory(ids: string[], category: string): Promise<void> {
    const idSet = new Set(ids);
    this.cache = this.cache.map(p => {
      if (idSet.has(p.id)) {
        return {
          ...p,
          category,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    this.persist();
  }

  public async updateStock(id: string, newStock: number, _reason?: string): Promise<Product> {
    return this.updateProduct(id, {
      stockCount: Math.max(0, newStock),
      inStock: newStock > 0
    });
  }

  public async getFeatured(): Promise<Product[]> {
    return this.cache.filter(p => p.isFeatured && p.inStock);
  }

  public async getTrending(): Promise<Product[]> {
    return this.cache.filter(p => p.isTrending && p.inStock);
  }

  public async getSpecialOffers(): Promise<Product[]> {
    return this.cache.filter(p => (p.isSpecialOffer || (p.oldPrice && p.oldPrice > p.price)) && p.inStock);
  }
}
