import { InventoryAdjustment, Product } from '../../types';
import { API_CONFIG } from '../api/config';
import { IInventoryAdapter } from './adapters/IInventoryAdapter';
import { InventoryMockAdapter } from './adapters/InventoryMockAdapter';
import { InventoryApiAdapter } from './adapters/InventoryApiAdapter';

export interface IInventoryService {
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
  getAdapterType(): 'mock' | 'api';
}

class InventoryServiceImpl implements IInventoryService {
  private mockAdapter: InventoryMockAdapter;
  private apiAdapter: InventoryApiAdapter | null = null;

  constructor() {
    this.mockAdapter = new InventoryMockAdapter();
  }

  private getAdapter(): IInventoryAdapter {
    if (API_CONFIG.isMockMode) {
      return this.mockAdapter;
    }
    if (!this.apiAdapter) {
      this.apiAdapter = new InventoryApiAdapter();
    }
    return this.apiAdapter;
  }

  public getAdapterType(): 'mock' | 'api' {
    return API_CONFIG.isMockMode ? 'mock' : 'api';
  }

  public getAdjustmentsSync(): InventoryAdjustment[] {
    return this.getAdapter().getAdjustmentsSync();
  }

  public async getAdjustments(): Promise<InventoryAdjustment[]> {
    return this.getAdapter().getAdjustments();
  }

  public async recordAdjustment(entry: Omit<InventoryAdjustment, 'id' | 'date'>): Promise<InventoryAdjustment> {
    return this.getAdapter().recordAdjustment(entry);
  }

  public async updateStock(productId: string, params: {
    quantityChange: number;
    reason: InventoryAdjustment['reason'];
    notes?: string;
  }): Promise<Product | undefined> {
    return this.getAdapter().updateStock(productId, params);
  }

  public getLowStockProductsSync(threshold = 10): Product[] {
    return this.getAdapter().getLowStockProductsSync(threshold);
  }

  public async getLowStockProducts(threshold = 10): Promise<Product[]> {
    return this.getAdapter().getLowStockProducts(threshold);
  }
}

export const inventoryService: IInventoryService = new InventoryServiceImpl();
