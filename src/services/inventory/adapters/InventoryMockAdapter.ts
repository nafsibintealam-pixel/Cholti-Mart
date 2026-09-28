import { InventoryAdjustment, Product } from '../../../types';
import { productService } from '../../products/ProductService';
import { INITIAL_INVENTORY_ADJUSTMENTS } from '../../adminMockService';
import { IInventoryAdapter } from './IInventoryAdapter';

const ADJUSTMENTS_KEY = 'cholti_admin_inventory_adjustments_v1';

export class InventoryMockAdapter implements IInventoryAdapter {
  private cache: InventoryAdjustment[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(ADJUSTMENTS_KEY);
        if (stored) {
          this.cache = JSON.parse(stored);
        } else {
          this.cache = [...INITIAL_INVENTORY_ADJUSTMENTS];
          localStorage.setItem(ADJUSTMENTS_KEY, JSON.stringify(this.cache));
        }
        return;
      } catch (e) {
        console.warn('Failed to load inventory adjustments', e);
      }
    }
    this.cache = [...INITIAL_INVENTORY_ADJUSTMENTS];
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ADJUSTMENTS_KEY, JSON.stringify(this.cache));
      } catch (e) {
        console.warn('Failed to persist inventory adjustments', e);
      }
    }
  }

  public getAdjustmentsSync(): InventoryAdjustment[] {
    return [...this.cache];
  }

  public async getAdjustments(): Promise<InventoryAdjustment[]> {
    return [...this.cache];
  }

  public async recordAdjustment(entry: Omit<InventoryAdjustment, 'id' | 'date'>): Promise<InventoryAdjustment> {
    const record: InventoryAdjustment = {
      ...entry,
      id: `adj-${Date.now().toString(36)}`,
      date: new Date().toISOString()
    };
    this.cache = [record, ...this.cache];
    this.persist();
    return record;
  }

  public async updateStock(productId: string, params: {
    quantityChange: number;
    reason: InventoryAdjustment['reason'];
    notes?: string;
  }): Promise<Product | undefined> {
    const product = await productService.getProductById(productId);
    if (!product) return undefined;

    const previousStock = product.stockCount ?? product.stock ?? 0;
    const newStock = Math.max(0, previousStock + params.quantityChange);

    const updated = await productService.updateProduct(productId, { 
      stockCount: newStock,
      stock: newStock,
      stockQuantity: newStock,
      inStock: newStock > 0
    });

    await this.recordAdjustment({
      productId,
      productName: product.name,
      sku: product.sku || '',
      previousStock,
      quantityChange: params.quantityChange,
      newStock,
      reason: params.reason,
      adjustedBy: 'Ops Lead',
      notes: params.notes || `Stock adjusted via inventory manager: ${params.quantityChange > 0 ? '+' : ''}${params.quantityChange}`
    });

    return updated;
  }

  public getLowStockProductsSync(threshold = 10): Product[] {
    return productService.getProductsSync().filter(p => (p.stockCount ?? p.stock ?? 0) <= threshold);
  }

  public async getLowStockProducts(threshold = 10): Promise<Product[]> {
    const products = await productService.getProducts();
    return products.filter(p => (p.stockCount ?? p.stock ?? 0) <= threshold);
  }
}
