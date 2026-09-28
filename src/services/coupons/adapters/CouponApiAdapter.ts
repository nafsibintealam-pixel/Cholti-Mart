import { CouponItem } from '../../../types';
import { CouponValidationResult } from '../CouponService';
import { ICouponAdapter } from './ICouponAdapter';
import { apiClient } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';
import { assertLiveApiReady, API_CONFIG } from '../../api/config';

export class CouponApiAdapter implements ICouponAdapter {
  private fallbackCache: CouponItem[] = [];

  constructor() {
    assertLiveApiReady();
  }

  public getCouponsSync(): CouponItem[] {
    return [...this.fallbackCache];
  }

  public async getCoupons(): Promise<CouponItem[]> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<CouponItem[]>(ENDPOINTS.COUPONS.LIST);
      this.fallbackCache = res.data;
      return res.data;
    } catch (err: any) {
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load coupons: ${err.message || 'Service unavailable'}`);
      }
      return this.fallbackCache;
    }
  }

  public async validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
    assertLiveApiReady();
    try {
      const res = await apiClient.post<CouponValidationResult>(ENDPOINTS.COUPONS.VALIDATE, { code, subtotal });
      return res.data;
    } catch (err: any) {
      return {
        isValid: false,
        message: err.message || 'Unable to validate coupon at this time.',
        discountAmount: 0
      };
    }
  }

  public async createCoupon(coupon: Omit<CouponItem, 'id' | 'usedCount'>): Promise<CouponItem> {
    assertLiveApiReady();
    const res = await apiClient.post<CouponItem>(ENDPOINTS.COUPONS.CREATE, coupon);
    return res.data;
  }

  public async deleteCoupon(id: string): Promise<boolean> {
    assertLiveApiReady();
    const res = await apiClient.delete<{ success: boolean }>(ENDPOINTS.COUPONS.DELETE(id));
    return res.isSuccess;
  }

  public async toggleStatus(id: string): Promise<CouponItem> {
    assertLiveApiReady();
    const res = await apiClient.post<CouponItem>(`/coupons/${id}/toggle-status`, {});
    return res.data;
  }
}
