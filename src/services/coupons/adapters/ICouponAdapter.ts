import { CouponItem } from '../../../types';
import { CouponValidationResult } from '../CouponService';

export interface ICouponAdapter {
  getCoupons(): Promise<CouponItem[]>;
  getCouponsSync(): CouponItem[];
  validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult>;
  createCoupon(coupon: Omit<CouponItem, 'id' | 'usedCount'>): Promise<CouponItem>;
  deleteCoupon(id: string): Promise<boolean>;
  toggleStatus(id: string): Promise<CouponItem>;
}
