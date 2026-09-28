import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Search, 
  Plus, 
  Edit2, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Save,
  Radio
} from 'lucide-react';
import { DeliveryZone, CourierServiceConfig } from '../../../types';
import { 
  AdminCard, 
  AdminBadge, 
  AdminButton, 
  AdminSearchInput, 
  AdminModal 
} from '../common/AdminUiElements';
import { deliveryService } from '../../../services';

export interface DeliveryViewProps {
  subnav?: string;
  onNavigateSubnav: (sub: string) => void;
}

export const DeliveryView: React.FC<DeliveryViewProps> = ({
  subnav = 'zones',
  onNavigateSubnav
}) => {
  const [zones, setZones] = useState<DeliveryZone[]>(() => deliveryService.getDeliveryZonesSync());
  const [couriers, setCouriers] = useState<CourierServiceConfig[]>(() => deliveryService.getCourierConfigsSync());
  
  // Tracking query simulator state
  const [trackingCode, setTrackingCode] = useState('STDF-90281');
  const [searchedTracking, setSearchedTracking] = useState<string | null>('STDF-90281');

  // Edit Zone Modal
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone) return;
    const updated = zones.map(z => z.id === editingZone.id ? editingZone : z);
    setZones(updated);
    deliveryService.saveDeliveryZones(updated);
    setEditingZone(null);
  };

  const toggleCourier = (courierId: string) => {
    const updated = couriers.map(c => c.id === courierId ? { ...c, isEnabled: !c.isEnabled } : c);
    setCouriers(updated);
    deliveryService.saveCourierConfigs(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Subnav Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 text-xs font-medium">
        {[
          { id: 'zones', label: `Delivery Zones (${zones.length})` },
          { id: 'couriers', label: `Courier Partners (${couriers.length})` },
          { id: 'tracking', label: 'Order Tracking & API Simulator' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onNavigateSubnav(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl transition-colors ${
              subnav === tab.id
                ? 'bg-[#2D5128] text-[#E4EB9C] font-bold border border-[#8DA750]/40'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subnav === 'couriers' ? (
        /* Courier Integrations View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {couriers.map((c) => (
            <AdminCard
              key={c.id}
              title={
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>{c.name}</span>
                </div>
              }
              subtitle={`Avg. turnaround: ${c.avgDeliveryHours} hours`}
              action={
                <button
                  onClick={() => toggleCourier(c.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    c.isEnabled
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {c.isEnabled ? 'Enabled' : 'Disabled'}
                </button>
              }
            >
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-400">Connection Status:</span>
                    <span className="font-bold text-emerald-400 font-mono">{c.statusText}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-400">Environment:</span>
                    <AdminBadge variant={c.isSandboxed ? 'warning' : 'success'} size="xs">
                      {c.isSandboxed ? 'Sandbox Simulation' : 'Live Production'}
                    </AdminBadge>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block mb-1">Webhook Endpoint:</span>
                    <span className="font-mono text-[11px] text-neutral-300 block truncate bg-neutral-900 p-1.5 rounded-lg border border-neutral-800">
                      {c.webhookUrl || 'Not configured'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400">
                  Ready for automated parcel generation on order dispatch.
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      ) : subnav === 'tracking' ? (
        /* Tracking Search & Simulator View */
        <div className="space-y-4">
          <AdminCard title="Logistics Parcel Tracking Simulator" subtitle="Track live courier parcel dispatch states across Steadfast, Pathao & RedX">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Enter tracking code (e.g. STDF-90281)"
                  className="flex-1 px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#8DA750]"
                />
                <AdminButton
                  variant="lime"
                  size="sm"
                  onClick={() => setSearchedTracking(trackingCode)}
                >
                  Track Parcel
                </AdminButton>
              </div>

              {searchedTracking && (
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                      <span className="text-[10px] uppercase text-neutral-400 font-bold block">Parcel ID</span>
                      <span className="font-mono text-sm font-bold text-white">{searchedTracking}</span>
                    </div>
                    <AdminBadge variant="purple" size="xs" dot>
                      In Transit
                    </AdminBadge>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="space-y-3 text-xs pl-2">
                    <div className="border-l-2 border-emerald-500 pl-4 space-y-0.5 relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -left-[6px] top-1" />
                      <div className="font-bold text-white">Out for Delivery (Dhaka Hub)</div>
                      <p className="text-[11px] text-neutral-400">Courier rider assigned &bull; Today, 10:30 AM</p>
                    </div>
                    <div className="border-l-2 border-neutral-700 pl-4 space-y-0.5 relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-600 absolute -left-[6px] top-1" />
                      <div className="font-bold text-neutral-300">Sorted at Central Sorting Hub (Tejgaon)</div>
                      <p className="text-[11px] text-neutral-400">18 Sep 2026, 08:45 PM</p>
                    </div>
                    <div className="pl-4 space-y-0.5 relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-600 absolute -left-[5px] top-1" />
                      <div className="font-bold text-neutral-400">Picked Up from Dhanmondi Warehouse</div>
                      <p className="text-[11px] text-neutral-500">18 Sep 2026, 03:15 PM</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      ) : (
        /* Delivery Zones & Pricing Table */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Bangladesh Delivery Zones & Shipping Rates</h3>
              <p className="text-xs text-neutral-400">Configure standard shipping charges and COD policies nationwide</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone) => (
              <AdminCard
                key={zone.id}
                title={
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E4EB9C]" />
                    <span>{zone.name}</span>
                  </div>
                }
                subtitle={zone.districtName}
                action={
                  <AdminButton
                    variant="outline"
                    size="xs"
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                    onClick={() => setEditingZone(zone)}
                  >
                    Edit Zone
                  </AdminButton>
                }
              >
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono">
                    <div>
                      <span className="text-[10px] uppercase text-neutral-500 font-bold block">Delivery Fee</span>
                      <span className="text-sm font-black text-[#E4EB9C]">৳{zone.charge} BDT</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-neutral-500 font-bold block">Estimated Time</span>
                      <span className="text-xs text-white font-medium">{zone.estimatedDelivery}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                    <span>Default Courier: <strong className="text-neutral-200">{zone.courierPartner}</strong></span>
                    <AdminBadge variant={zone.isCodAvailable ? 'success' : 'danger'} size="xs">
                      {zone.isCodAvailable ? 'Cash on Delivery Active' : 'Prepaid Only'}
                    </AdminBadge>
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>
        </div>
      )}

      {/* Edit Zone Modal */}
      {editingZone && (
        <AdminModal
          isOpen={!!editingZone}
          onClose={() => setEditingZone(null)}
          title={`Edit Delivery Zone: ${editingZone.name}`}
          subtitle="Update shipping fee and delivery duration"
          footer={
            <>
              <AdminButton variant="outline" size="sm" onClick={() => setEditingZone(null)}>
                Cancel
              </AdminButton>
              <AdminButton variant="lime" size="sm" onClick={handleSaveZone}>
                Save Changes
              </AdminButton>
            </>
          }
        >
          <form onSubmit={handleSaveZone} className="space-y-3 text-xs">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Zone Name</label>
              <input
                type="text"
                value={editingZone.name}
                onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              />
            </div>
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Coverage Areas / Districts</label>
              <textarea
                rows={2}
                value={editingZone.districtName}
                onChange={(e) => setEditingZone({ ...editingZone, districtName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Delivery Charge (BDT ৳)</label>
                <input
                  type="number"
                  value={editingZone.charge}
                  onChange={(e) => setEditingZone({ ...editingZone, charge: Number(e.target.value) })}
                  required
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#8DA750]"
                />
              </div>
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Estimated Delivery Time</label>
                <input
                  type="text"
                  value={editingZone.estimatedDelivery}
                  onChange={(e) => setEditingZone({ ...editingZone, estimatedDelivery: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
                />
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="cod-toggle"
                checked={editingZone.isCodAvailable}
                onChange={(e) => setEditingZone({ ...editingZone, isCodAvailable: e.target.checked })}
                className="rounded bg-neutral-950 border-neutral-700 text-[#8DA750]"
              />
              <label htmlFor="cod-toggle" className="text-neutral-300 cursor-pointer">
                Enable Cash on Delivery (COD) for this zone
              </label>
            </div>
          </form>
        </AdminModal>
      )}

    </div>
  );
};
