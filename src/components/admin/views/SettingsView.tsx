import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  DollarSign, 
  Mail, 
  Bell, 
  Phone, 
  MapPin, 
  Check, 
  Save 
} from 'lucide-react';
import { AdminCard, AdminButton } from '../common/AdminUiElements';
import { useCustomizer } from '../../../context/CustomizerContext';

export interface SettingsViewProps {
  subnav?: string;
  onNavigateSubnav: (sub: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  subnav = 'general',
  onNavigateSubnav
}) => {
  const { config, updateSiteSettings } = useCustomizer();
  const [storeName, setStoreName] = useState(config.siteSettings.storeName);
  const [phone, setPhone] = useState('+880 1700-000000');
  const [email, setEmail] = useState('support@choltimart.com');
  const [address, setAddress] = useState('Dhanmondi 27, Dhaka 1209, Bangladesh');
  const [currencySymbol, setCurrencySymbol] = useState('৳');
  const [currencyCode, setCurrencyCode] = useState('BDT');
  const [vatRate, setVatRate] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({ storeName });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Subnav Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 text-xs font-medium">
        {[
          { id: 'general', label: 'General Store Info' },
          { id: 'currency', label: 'Currency & Tax (VAT)' },
          { id: 'notifications', label: 'Order SMS & Email Alerts' }
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

      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>System settings updated successfully!</span>
        </div>
      )}

      {subnav === 'currency' ? (
        <div className="max-w-xl">
          <AdminCard title="Currency & VAT Taxation" subtitle="National currency formatting & NBR VAT standard">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Currency Code</label>
                  <input
                    type="text"
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">VAT / Tax Percentage (%)</label>
                <input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono"
                />
                <span className="text-[11px] text-neutral-500 mt-1 block">Prices on storefront can be configured to include or exclude VAT.</span>
              </div>

              <AdminButton variant="lime" size="sm" onClick={handleSave}>
                Save Currency Settings
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      ) : subnav === 'notifications' ? (
        <div className="max-w-xl">
          <AdminCard title="SMS & Email Alerts" subtitle="Automated notifications sent upon order placement & dispatch">
            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-neutral-900 border-neutral-700 text-[#8DA750]" />
                <div>
                  <span className="text-white font-semibold block">Send SMS confirmation upon order receipt</span>
                  <span className="text-neutral-400 text-[11px]">Includes Order ID & total amount to shopper's mobile</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-neutral-900 border-neutral-700 text-[#8DA750]" />
                <div>
                  <span className="text-white font-semibold block">Send SMS with Courier Tracking link upon parcel dispatch</span>
                  <span className="text-neutral-400 text-[11px]">Provides Steadfast/Pathao tracking link</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-neutral-900 border-neutral-700 text-[#8DA750]" />
                <div>
                  <span className="text-white font-semibold block">Notify store managers on low stock warnings</span>
                  <span className="text-neutral-400 text-[11px]">Triggers when SKU falls below 5 items</span>
                </div>
              </label>

              <AdminButton variant="lime" size="sm">
                Save Alert Rules
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      ) : (
        /* General Store Info */
        <div className="max-w-xl">
          <AdminCard title="Storefront Legal & Contact Profile" subtitle="Public store details shown on invoices, footer, and checkout">
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Official Brand Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Customer Support Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#8DA750]"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Support Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Physical Warehouse / Office Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
                />
              </div>

              <AdminButton variant="lime" size="sm" onClick={handleSave}>
                Save General Settings
              </AdminButton>
            </form>
          </AdminCard>
        </div>
      )}

    </div>
  );
};
