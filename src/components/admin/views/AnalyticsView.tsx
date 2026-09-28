import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Truck, 
  Calendar, 
  DollarSign, 
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AdminCard, 
  AdminBadge, 
  AdminButton, 
  AdminExportButton 
} from '../common/AdminUiElements';

export interface AnalyticsViewProps {
  subnav?: string;
  onNavigateSubnav: (sub: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  subnav = 'sales_report',
  onNavigateSubnav
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Performance numbers
  const courierStats = [
    { name: 'Steadfast Courier', totalParcels: 342, successRate: 95.2, returnRate: 3.8, avgDeliveryDays: 1.4 },
    { name: 'Pathao Courier', totalParcels: 218, successRate: 92.4, returnRate: 5.6, avgDeliveryDays: 1.8 },
    { name: 'RedX Delivery', totalParcels: 145, successRate: 89.1, returnRate: 7.9, avgDeliveryDays: 2.2 }
  ];

  const cityDistribution = [
    { city: 'Dhaka Division', percentage: 62, orders: 480 },
    { city: 'Chittagong Division', percentage: 16, orders: 124 },
    { city: 'Sylhet Division', percentage: 9, orders: 70 },
    { city: 'Rajshahi Division', percentage: 6, orders: 46 },
    { city: 'Khulna & Barisal', percentage: 7, orders: 54 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Subnav Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'sales_report', label: 'Sales & Revenue Report' },
            { id: 'top_products', label: 'Top Performing Products' },
            { id: 'customer_insights', label: 'Regional Demographics' },
            { id: 'courier_performance', label: 'Courier Fulfillment Matrix' }
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

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl shrink-0">
          {(['7d', '30d', '90d', '1y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                timeRange === r
                  ? 'bg-[#2D5128] text-[#E4EB9C]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {subnav === 'courier_performance' ? (
        /* Courier Performance View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courierStats.map((c, idx) => (
              <AdminCard
                key={idx}
                title={c.name}
                subtitle={`${c.totalParcels} Shipments tracked`}
                action={
                  <AdminBadge variant={c.successRate >= 92 ? 'success' : 'warning'} size="xs">
                    {c.successRate}% Success
                  </AdminBadge>
                }
              >
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-bold">Return Rate</span>
                      <span className="font-mono font-bold text-red-400">{c.returnRate}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-bold">Avg Transit</span>
                      <span className="font-mono font-bold text-white">{c.avgDeliveryDays} Days</span>
                    </div>
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>
        </div>
      ) : subnav === 'customer_insights' ? (
        /* Demographics View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard title="Orders by Bangladesh Division" subtitle="Geographic delivery concentration">
            <div className="space-y-3 text-xs">
              {cityDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-white">{item.city}</span>
                    <span className="font-mono text-[#E4EB9C] font-bold">{item.percentage}% ({item.orders} orders)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2D5128] to-[#8DA750] rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Shopper Retention Dynamics" subtitle="New vs repeat customer transactions">
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase font-bold block">Repeat Customer Rate</span>
                  <span className="text-2xl font-black text-[#E4EB9C]">41.8%</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                    <ArrowUpRight className="w-4 h-4" /> +5.4%
                  </span>
                  <span className="text-[10px] text-neutral-500">vs last month</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase font-bold block">Average Order Value (AOV)</span>
                  <span className="text-2xl font-black text-white font-mono">৳2,840 BDT</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                    <ArrowUpRight className="w-4 h-4" /> +8.2%
                  </span>
                  <span className="text-[10px] text-neutral-500">vs last month</span>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      ) : (
        /* Sales Report Overview */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AdminCard title="Gross Sales Revenue">
              <div className="font-mono text-2xl font-black text-[#E4EB9C]">৳1,842,500</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% compared to prior period
              </div>
            </AdminCard>

            <AdminCard title="Completed Orders">
              <div className="font-mono text-2xl font-black text-white">774</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.9% growth
              </div>
            </AdminCard>

            <AdminCard title="Average Items / Basket">
              <div className="font-mono text-2xl font-black text-white">2.4 Units</div>
              <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-1">
                Healthy basket depth
              </div>
            </AdminCard>
          </div>

          <AdminCard title="Monthly Revenue Trajectory (৳ BDT)" subtitle="Visual monthly cash inflow comparison">
            <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
              {[
                { month: 'Apr', value: 1200000, height: '60%' },
                { month: 'May', value: 1450000, height: '72%' },
                { month: 'Jun', value: 1320000, height: '66%' },
                { month: 'Jul', value: 1680000, height: '84%' },
                { month: 'Aug', value: 1540000, height: '77%' },
                { month: 'Sep', value: 1842500, height: '95%' }
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-mono text-[#E4EB9C] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ৳{(bar.value / 1000).toFixed(0)}k
                  </div>
                  <div 
                    className="w-full max-w-[48px] bg-gradient-to-t from-[#2D5128] to-[#8DA750] rounded-t-xl transition-all duration-300 group-hover:brightness-125"
                    style={{ height: bar.height }}
                  />
                  <span className="text-[11px] text-neutral-400 font-medium">{bar.month}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      )}

    </div>
  );
};
