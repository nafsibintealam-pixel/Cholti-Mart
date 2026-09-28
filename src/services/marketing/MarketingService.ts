import { PromotionCampaign, FlashSaleItem, AbandonedCartRecord } from '../../types';
import { INITIAL_PROMOTIONS, INITIAL_FLASH_SALES } from '../adminMockService';
import { analyticsService } from '../analytics/AnalyticsService';

export interface IMarketingService {
  getPromotions(): Promise<PromotionCampaign[]>;
  getPromotionsSync(): PromotionCampaign[];
  savePromotions(promos: PromotionCampaign[]): void;
  getFlashSales(): Promise<FlashSaleItem[]>;
  getFlashSalesSync(): FlashSaleItem[];
  saveFlashSales(sales: FlashSaleItem[]): void;
  getAbandonedCarts(): Promise<AbandonedCartRecord[]>;
  getAbandonedCartsSync(): AbandonedCartRecord[];
}

const STORAGE_KEYS = {
  PROMOTIONS: 'cholti_admin_promotions_v1',
  FLASH_SALES: 'cholti_admin_flash_sales_v1',
  ABANDONED_CARTS: 'cholti_admin_abandoned_carts_v1'
};

class MarketingServiceImpl implements IMarketingService {
  private promotionsCache: PromotionCampaign[] = [];
  private flashSalesCache: FlashSaleItem[] = [];
  private abandonedCartsCache: AbandonedCartRecord[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const storedPromo = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
        this.promotionsCache = storedPromo ? JSON.parse(storedPromo) : INITIAL_PROMOTIONS;

        const storedFlash = localStorage.getItem(STORAGE_KEYS.FLASH_SALES);
        this.flashSalesCache = storedFlash ? JSON.parse(storedFlash) : INITIAL_FLASH_SALES;

        const storedAbn = localStorage.getItem(STORAGE_KEYS.ABANDONED_CARTS);
        if (storedAbn) {
          this.abandonedCartsCache = JSON.parse(storedAbn);
        } else {
          // Initialize from analyticsService default records
          this.abandonedCartsCache = [
            {
              id: 'abn-101',
              customerName: 'Kazi Farhan',
              customerEmail: 'kazi.farhan@gmail.com',
              customerPhone: '01755998877',
              itemsCount: 2,
              cartTotal: 3450,
              lastActive: '2 hours ago',
              recoveryEmailSent: true,
              status: 'abandoned'
            },
            {
              id: 'abn-102',
              customerName: 'Samira Islam',
              customerEmail: 'samira.i@yahoo.com',
              customerPhone: '01844221100',
              itemsCount: 1,
              cartTotal: 2150,
              lastActive: '5 hours ago',
              recoveryEmailSent: false,
              status: 'abandoned'
            },
            {
              id: 'abn-103',
              customerName: 'Mahmudul Hasan',
              customerEmail: 'mahmud.h@gmail.com',
              customerPhone: '01933445566',
              itemsCount: 3,
              cartTotal: 4890,
              lastActive: 'Yesterday',
              recoveryEmailSent: false,
              status: 'abandoned'
            }
          ];
        }
      } catch (e) {
        console.warn('Failed to load marketing data from storage', e);
        this.promotionsCache = INITIAL_PROMOTIONS;
        this.flashSalesCache = INITIAL_FLASH_SALES;
      }
    } else {
      this.promotionsCache = INITIAL_PROMOTIONS;
      this.flashSalesCache = INITIAL_FLASH_SALES;
    }
  }

  public getPromotionsSync(): PromotionCampaign[] {
    return [...this.promotionsCache];
  }

  public async getPromotions(): Promise<PromotionCampaign[]> {
    return [...this.promotionsCache];
  }

  public savePromotions(promos: PromotionCampaign[]): void {
    this.promotionsCache = promos;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promos));
    }
  }

  public getFlashSalesSync(): FlashSaleItem[] {
    return [...this.flashSalesCache];
  }

  public async getFlashSales(): Promise<FlashSaleItem[]> {
    return [...this.flashSalesCache];
  }

  public saveFlashSales(sales: FlashSaleItem[]): void {
    this.flashSalesCache = sales;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FLASH_SALES, JSON.stringify(sales));
    }
  }

  public getAbandonedCartsSync(): AbandonedCartRecord[] {
    return [...this.abandonedCartsCache];
  }

  public async getAbandonedCarts(): Promise<AbandonedCartRecord[]> {
    return [...this.abandonedCartsCache];
  }
}

export const marketingService: IMarketingService = new MarketingServiceImpl();
