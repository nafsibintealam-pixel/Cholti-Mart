import { InventoryAdjustment, Product } from '../../../types';
import { IInventoryAdapter } from './IInventoryAdapter';
import { apiClient } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';
import { assertLiveApiReady, API_CONFIG } from '../../api/config';
import { productService } from '../../products/ProductService';

export class InventoryApiAdapter implements IInventoryAdapter {
  private cache: InventoryAdjustment[] = [];

  constructor() {
    assertLiveApiReady();
  }

  public getAdjustmentsSync(): InventoryAdjustment[] {
    return [...this.cache];
  }

  public async getAdjustments(): Promise<InventoryAdjustment[]> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<InventoryAdjustment[]>(ENDPOINTS.INVENTORY.ADJUSTMENTS);
      this.cache = res.data;
      return res.data;
    } catch (err: any) {
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load inventory adjustments: ${err.message || 'Service unavailable'}`);
      }
      return this.cache;
    }
  }

  public async recordAdjustment(entry: Omit<InventoryAdjustment, 'id' | 'date'>): Promise<InventoryAdjustment> {
    assertLiveApiReady();
    const res = await apiClient.post<InventoryAdjustment>(ENDPOINTS.INVENTORY.RECORD_ADJUSTMENT, entry);
    return res.data;
  }

  public async updateStock(productId: string, params: {
    quantityChange: number;
    reason: InventoryAdjustment['reason'];
    notes?: string;
  }): Promise<Product | undefined> {
    assertLiveApiReady();
    const res = await apiClient.post<Product>(ENDPOINTS.INVENTORY.STOCK_UPDATE(productId), params);
    return res.data;
  }

  public getLowStockProductsSync(threshold = 10): Product[] {
    return productService.getProductsSync().filter(p => (p.stockCount ?? p.stock ?? 0) <= threshold);
  }

  public async getLowStockProducts(threshold = 10): Promise<Product[]> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<Product[]>(ENDPOINTS.INVENTORY.LOW_STOCK, { threshold });
      return res.data;
    } catch {
      return productService.getProducts().then(list => list.filter(p => (p.stockCount ?? p.stock ?? 0) <= threshold));
    }
  }
}
