import { InventoryAdjustment, Product } from '../../../types';

export interface IInventoryAdapter {
  getAdjustments(): Promise<InventoryAdjustment[]>;
  getAdjustmentsSync(): InventoryAdjustment[];
  recordAdjustment(entry: Omit<InventoryAdjustment, 'id' | 'date'>): Promise<InventoryAdjustment>;
  updateStock(productId: string, params: {
    quantityChange: number;
    reason: InventoryAdjustment['reason'];
    notes?: string;
  }): Promise<Product | undefined>;
  getLowStockProducts(threshold?: number): Promise<Product[]>;
  getLowStockProductsSync(threshold?: number): Product[];
}
