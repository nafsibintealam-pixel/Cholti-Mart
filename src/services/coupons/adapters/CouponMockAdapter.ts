import { CouponItem } from '../../../types';
import { CouponValidationResult } from '../CouponService';
import { ICouponAdapter } from './ICouponAdapter';

const STORAGE_KEY = 'cholti_admin_coupons_v1';

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: 'coup-1',
    code: 'CHOLTI10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 1000,
    maxDiscount: 300,
    startDate: '01 Sep 2026',
    endDate: '31 Oct 2026',
    usageLimit: 500,
    usedCount: 142,
    status: 'active',
    description: '10% instant discount on orders above ৳1,000'
  },
  {
    id: 'coup-2',
    code: 'EID200',
    discountType: 'fixed',
    discountValue: 200,
    minSpend: 2000,
    startDate: '01 Sep 2026',
    endDate: '15 Oct 2026',
    usageLimit: 300,
    usedCount: 88,
    status: 'active',
    description: 'Flat ৳200 discount on festival purchases'
  },
  {
    id: 'coup-3',
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 130,
    minSpend: 3000,
    startDate: '01 Sep 2026',
    endDate: '30 Nov 2026',
    usageLimit: 1000,
    usedCount: 312,
    status: 'active',
    description: 'Free nationwide shipping waiver on orders over ৳3,000'
  }
];

export class CouponMockAdapter implements ICouponAdapter {
  private cache: CouponItem[] = [];

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
        console.warn('Failed to load coupons from storage', e);
      }
    }
    this.cache = [...INITIAL_COUPONS];
    this.persist();
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      } catch (e) {
        console.warn('Failed to persist coupons cache', e);
      }
    }
  }

  public getCouponsSync(): CouponItem[] {
    return [...this.cache];
  }

  public async getCoupons(): Promise<CouponItem[]> {
    return [...this.cache];
  }

  public async validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
    const cleanCode = code.trim().toUpperCase();
    const found = this.cache.find(c => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return {
        isValid: false,
        message: `Coupon code "${code}" is invalid or does not exist.`,
        discountAmount: 0
      };
    }

    if (found.status !== 'active') {
      return {
        isValid: false,
        message: `Coupon code "${cleanCode}" has expired or is inactive.`,
        discountAmount: 0
      };
    }

    if (found.minSpend && subtotal < found.minSpend) {
      return {
        isValid: false,
        message: `Minimum order total of ৳${found.minSpend} required to use "${cleanCode}".`,
        discountAmount: 0
      };
    }

    let discount = 0;
    const val = found.discountValue ?? found.value ?? 0;
    if (found.discountType === 'percentage') {
      discount = Math.round((subtotal * val) / 100);
      if (found.maxDiscount && discount > found.maxDiscount) {
        discount = found.maxDiscount;
      }
    } else {
      discount = val;
    }

    discount = Math.min(discount, subtotal);

    return {
      isValid: true,
      message: `Coupon "${cleanCode}" applied successfully! (Saved ৳${discount})`,
      discountAmount: discount,
      coupon: found
    };
  }

  public async createCoupon(coupon: Omit<CouponItem, 'id' | 'usedCount'>): Promise<CouponItem> {
    const newCoupon: CouponItem = {
      ...coupon,
      id: `coup-${Date.now()}`,
      code: coupon.code.toUpperCase().trim(),
      usedCount: 0
    };
    this.cache.unshift(newCoupon);
    this.persist();
    return newCoupon;
  }

  public async deleteCoupon(id: string): Promise<boolean> {
    const prev = this.cache.length;
    this.cache = this.cache.filter(c => c.id !== id);
    if (this.cache.length !== prev) {
      this.persist();
      return true;
    }
    return false;
  }

  public async toggleStatus(id: string): Promise<CouponItem> {
    const index = this.cache.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Coupon ${id} not found`);
    const current = this.cache[index];
    const newStatus = current.status === 'active' ? 'expired' : 'active';
    this.cache[index] = { ...current, status: newStatus };
    this.persist();
    return this.cache[index];
  }
}
