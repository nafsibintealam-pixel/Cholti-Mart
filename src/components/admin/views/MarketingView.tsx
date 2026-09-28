import React, { useState } from 'react';
import { 
  Megaphone, 
  Percent, 
  Zap, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Mail, 
  Clock, 
  Tag,
  Copy,
  Check
} from 'lucide-react';
import { PromotionCampaign, FlashSaleItem, AbandonedCartRecord } from '../../../types';
import { AdminCard, AdminBadge, AdminButton, AdminModal } from '../common/AdminUiElements';
import { marketingService } from '../../../services';

export interface CouponItem {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minSpend: number;
  expiryDate: string;
  isActive: boolean;
}

const INITIAL_COUPONS: CouponItem[] = [
  { id: 'cp-1', code: 'CHOLTI10', discount: 10, type: 'percentage', minSpend: 1000, expiryDate: '2026-12-31', isActive: true },
  { id: 'cp-2', code: 'WELCOME50', discount: 50, type: 'fixed', minSpend: 500, expiryDate: '2026-12-31', isActive: true },
  { id: 'cp-3', code: 'EIDSPECIAL', discount: 15, type: 'percentage', minSpend: 2500, expiryDate: '2026-10-31', isActive: true }
];

export interface MarketingViewProps {
  subnav?: string;
  onNavigateSubnav: (sub: string) => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({
  subnav = 'coupons',
  onNavigateSubnav
}) => {
  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    try {
      const saved = localStorage.getItem('cholti_mock_coupons_v1');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [promotions, setPromotions] = useState<PromotionCampaign[]>(() => marketingService.getPromotionsSync());
  const [flashSales, setFlashSales] = useState<FlashSaleItem[]>(() => marketingService.getFlashSalesSync());
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCartRecord[]>(() => marketingService.getAbandonedCartsSync());

  const addCoupon = (item: Omit<CouponItem, 'id'>) => {
    const created: CouponItem = {
      ...item,
      id: `cp-${Date.now().toString(36)}`
    };
    const updated = [created, ...coupons];
    setCoupons(updated);
    localStorage.setItem('cholti_mock_coupons_v1', JSON.stringify(updated));
  };

  const deleteCoupon = (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    setCoupons(updated);
    localStorage.setItem('cholti_mock_coupons_v1', JSON.stringify(updated));
  };

  // Add Coupon Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Omit<CouponItem, 'id'>>({
    code: '',
    discount: 10,
    type: 'percentage',
    minSpend: 1000,
    expiryDate: '2026-12-31',
    isActive: true
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    addCoupon(newCoupon);
    setIsCouponModalOpen(false);
    setNewCoupon({
      code: '',
      discount: 10,
      type: 'percentage',
      minSpend: 1000,
      expiryDate: '2026-12-31',
      isActive: true
    });
  };

  const triggerCartRecovery = (id: string) => {
    setAbandonedCarts(prev => prev.map(c => c.id === id ? { ...c, recoveryEmailSent: true } : c));
  };

  return (
    <div className="space-y-6">
      
      {/* Subnav Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'coupons', label: `Promo Coupons (${coupons.length})` },
            { id: 'flash_sales', label: `Flash Sales (${flashSales.length})` },
            { id: 'promotions', label: `Campaign Banners (${promotions.length})` },
            { id: 'abandoned_carts', label: `Abandoned Carts (${abandonedCarts.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigateSubnav(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl transition-colors font-medium ${
                subnav === tab.id
                  ? 'bg-[#2D5128] text-[#E4EB9C] font-bold border border-[#8DA750]/40'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {subnav === 'coupons' && (
          <AdminButton
            variant="lime"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCouponModalOpen(true)}
          >
            Create Coupon
          </AdminButton>
        )}
      </div>

      {subnav === 'flash_sales' ? (
        /* Flash Sales View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {flashSales.map((fs) => (
            <AdminCard
              key={fs.id}
              title={
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="truncate">{fs.productName}</span>
                </div>
              }
              subtitle={`Flash discount: -${fs.discountPercent}%`}
              action={
                <AdminBadge variant="danger" size="xs" dot>
                  Active Deal
                </AdminBadge>
              }
            >
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Flash Price</span>
                    <span className="text-base font-bold text-[#E4EB9C]">৳{fs.flashPrice}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block">Regular</span>
                    <span className="text-xs text-neutral-500 line-through">৳{fs.regularPrice}</span>
                  </div>
                </div>

                {/* Progress bar of sold units */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Sold: {fs.soldCount} of {fs.stockLimit} units</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {Math.round((fs.soldCount / fs.stockLimit) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                      style={{ width: `${(fs.soldCount / fs.stockLimit) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      ) : subnav === 'promotions' ? (
        /* Campaign Banners View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promotions.map((promo) => (
            <AdminCard
              key={promo.id}
              title={promo.title}
              subtitle={promo.subtitle}
              action={
                <AdminBadge variant="lime" size="xs">
                  {promo.badgeText}
                </AdminBadge>
              }
            >
              <div className="space-y-3 text-xs">
                {promo.bannerImage && (
                  <img
                    src={promo.bannerImage}
                    alt={promo.title}
                    className="w-full h-32 rounded-xl object-cover border border-neutral-800"
                  />
                )}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                  <span>Validity: {promo.startDate} to {promo.endDate}</span>
                  <span className="font-mono text-[#E4EB9C] font-bold">{promo.clicksCount} clicks</span>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      ) : subnav === 'abandoned_carts' ? (
        /* Abandoned Carts Recovery View */
        <AdminCard title="Abandoned Cart Recovery" subtitle="Shoppers who left items at checkout without completing payment" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 text-[10px] uppercase font-bold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-4 py-3">Phone & Email</th>
                  <th className="px-4 py-3">Cart Value</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Recovery Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                {abandonedCarts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-neutral-800/40">
                    <td className="px-5 py-3.5 font-bold text-white">
                      {cart.customerName}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-emerald-400 text-[11px]">{cart.customerPhone}</div>
                      <div className="text-[10px] text-neutral-400">{cart.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-[#E4EB9C]">
                      ৳{cart.cartTotal.toLocaleString()} ({cart.itemsCount} items)
                    </td>
                    <td className="px-4 py-3.5 text-neutral-400 text-[11px]">
                      {cart.lastActive}
                    </td>
                    <td className="px-4 py-3.5">
                      <AdminBadge
                        variant={cart.status === 'recovered' ? 'success' : cart.recoveryEmailSent ? 'info' : 'warning'}
                        size="xs"
                      >
                        {cart.status === 'recovered' ? 'Recovered Order' : cart.recoveryEmailSent ? 'SMS/Email Sent' : 'Pending Outreach'}
                      </AdminBadge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {!cart.recoveryEmailSent && cart.status !== 'recovered' && (
                        <AdminButton
                          variant="outline"
                          size="xs"
                          icon={<Mail className="w-3.5 h-3.5" />}
                          onClick={() => triggerCartRecovery(cart.id)}
                        >
                          Send Recovery SMS
                        </AdminButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      ) : (
        /* Coupons List View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <AdminCard
                key={coupon.id}
                title={
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#E4EB9C]" />
                    <span className="font-mono font-bold text-white">{coupon.code}</span>
                  </div>
                }
                action={
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      title="Copy code"
                    >
                      {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="p-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                }
              >
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono">
                    <div>
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Discount</span>
                      <span className="text-base font-black text-emerald-400">
                        {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `৳${coupon.discount} OFF`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Min Spend</span>
                      <span className="text-xs text-white">৳{coupon.minSpend}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                    <span>Expires: {coupon.expiryDate}</span>
                    <AdminBadge variant={coupon.isActive ? 'success' : 'neutral'} size="xs">
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </AdminBadge>
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      <AdminModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        title="Create Promotional Coupon"
        subtitle="Generate discount code applicable at storefront checkout"
        footer={
          <>
            <AdminButton variant="outline" size="sm" onClick={() => setIsCouponModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="lime" size="sm" onClick={handleCreateCoupon}>
              Save Coupon
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">Coupon Code (Uppercase) *</label>
            <input
              type="text"
              required
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              placeholder="e.g. BOISHAKH15"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#8DA750]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Discount Type</label>
              <select
                value={newCoupon.type}
                onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (৳)</option>
              </select>
            </div>
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Discount Value *</label>
              <input
                type="number"
                required
                value={newCoupon.discount}
                onChange={(e) => setNewCoupon({ ...newCoupon, discount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#8DA750]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Minimum Spend (BDT ৳)</label>
              <input
                type="number"
                value={newCoupon.minSpend}
                onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#8DA750]"
              />
            </div>
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Expiry Date</label>
              <input
                type="date"
                value={newCoupon.expiryDate}
                onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              />
            </div>
          </div>
        </form>
      </AdminModal>

    </div>
  );
};
