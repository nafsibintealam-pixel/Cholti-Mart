import { CouponItem } from '../../types';
import { API_CONFIG } from '../api/config';
import { ICouponAdapter } from './adapters/ICouponAdapter';
import { CouponMockAdapter } from './adapters/CouponMockAdapter';
import { CouponApiAdapter } from './adapters/CouponApiAdapter';

export interface CouponValidationResult {
  isValid: boolean;
  message: string;
  discountAmount: number;
  coupon?: CouponItem;
}

export interface ICouponService {
  getCoupons(): Promise<CouponItem[]>;
  getCouponsSync(): CouponItem[];
  validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult>;
  createCoupon(coupon: Omit<CouponItem, 'id' | 'usedCount'>): Promise<CouponItem>;
  deleteCoupon(id: string): Promise<boolean>;
  toggleStatus(id: string): Promise<CouponItem>;
  getAdapterType(): 'mock' | 'api';
}

class CouponServiceImpl implements ICouponService {
  private mockAdapter: CouponMockAdapter;
  private apiAdapter: CouponApiAdapter | null = null;

  constructor() {
    this.mockAdapter = new CouponMockAdapter();
  }

  private getAdapter(): ICouponAdapter {
    if (API_CONFIG.isMockMode) {
      return this.mockAdapter;
    }
    if (!this.apiAdapter) {
      this.apiAdapter = new CouponApiAdapter();
    }
    return this.apiAdapter;
  }

  public getAdapterType(): 'mock' | 'api' {
    return API_CONFIG.isMockMode ? 'mock' : 'api';
  }

  public getCouponsSync(): CouponItem[] {
    return this.getAdapter().getCouponsSync();
  }

  public async getCoupons(): Promise<CouponItem[]> {
    return this.getAdapter().getCoupons();
  }

  public async validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
    return this.getAdapter().validateCoupon(code, subtotal);
  }

  public async createCoupon(coupon: Omit<CouponItem, 'id' | 'usedCount'>): Promise<CouponItem> {
    return this.getAdapter().createCoupon(coupon);
  }

  public async deleteCoupon(id: string): Promise<boolean> {
    return this.getAdapter().deleteCoupon(id);
  }

  public async toggleStatus(id: string): Promise<CouponItem> {
    return this.getAdapter().toggleStatus(id);
  }
}

export const couponService: ICouponService = new CouponServiceImpl();
