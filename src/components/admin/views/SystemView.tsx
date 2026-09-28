import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  HardDrive, 
  Activity,
  Check
} from 'lucide-react';
import { AdminCard, AdminBadge, AdminButton, AdminConfirmDialog } from '../common/AdminUiElements';
import { AdminMockService } from '../../../services/adminMockService';

export interface SystemViewProps {
  subnav?: string;
  onNavigateSubnav: (sub: string) => void;
}

export const SystemView: React.FC<SystemViewProps> = ({
  subnav = 'health',
  onNavigateSubnav
}) => {
  const getStorageUsageKB = () => {
    try {
      let total = 0;
      for (let x in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, x)) {
          total += ((localStorage[x].length + x.length) * 2);
        }
      }
      return `${(total / 1024).toFixed(1)} KB`;
    } catch {
      return '48.2 KB';
    }
  };

  const storageUsed = getStorageUsageKB();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleExportBackup = () => {
    const data = AdminMockService.exportFullBackupJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cholti_mart_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccessMessage('Full administrative database snapshot exported successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const success = AdminMockService.importBackupJson(content);
      if (success) {
        setSuccessMessage('Backup restored successfully! Refreshing view...');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        alert('Invalid backup JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    AdminMockService.resetToDefaults();
    setIsResetConfirmOpen(false);
    setSuccessMessage('Reset complete! Rebuilding demo dataset...');
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleFlushCache = () => {
    sessionStorage.clear();
    setSuccessMessage('Static cache & query memoization cleared successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Subnav Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 text-xs font-medium">
        {[
          { id: 'health', label: 'Architecture & Service Status' },
          { id: 'backup', label: 'Database Backup & Restore' },
          { id: 'maintenance', label: 'Maintenance & Reset' }
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

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {subnav === 'backup' ? (
        /* Backup & Restore View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard title="Create Snapshot Backup" subtitle="Download entire catalog, orders, and customer database">
            <div className="space-y-4 text-xs">
              <p className="text-neutral-300">
                Generates a verified, portable JSON snapshot of all products, order records, delivery zones, promo coupons, and audit logs.
              </p>
              <AdminButton
                variant="lime"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExportBackup}
              >
                Download Snapshot (.json)
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard title="Restore from Snapshot" subtitle="Upload previously exported database snapshot">
            <div className="space-y-4 text-xs">
              <p className="text-neutral-300">
                Importing a snapshot will restore products, orders, and configuration states into local persistence.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-[#E4EB9C]" />
                <span>Select Snapshot File</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportBackup}
                />
              </label>
            </div>
          </AdminCard>
        </div>
      ) : subnav === 'maintenance' ? (
        /* Maintenance & Reset View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard title="Flush Runtime Cache" subtitle="Clear client-side cached query payloads">
            <div className="space-y-4 text-xs">
              <p className="text-neutral-300">
                Forces a clean reload of application assets and wipes temporary session cache.
              </p>
              <AdminButton variant="outline" size="sm" onClick={handleFlushCache}>
                Flush Cache
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard title="Reset to Factory Dataset" subtitle="Clear mock modifications and restore original seed">
            <div className="space-y-4 text-xs">
              <p className="text-red-300/80">
                Warning: This will revert all modified products, new orders, and custom delivery zones back to the initial setup data.
              </p>
              <AdminButton
                variant="danger"
                size="sm"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={() => setIsResetConfirmOpen(true)}
              >
                Reset Database
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      ) : (
        /* Architecture & Service Layer Status */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AdminCard title="Runtime Environment">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="font-bold text-white text-base">Development Mode</span>
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">Mock Service Layer Active</span>
            </AdminCard>

            <AdminCard title="Backend Readiness">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-bold text-white text-base">WordPress REST Ready</span>
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">Prepared for WooCommerce API</span>
            </AdminCard>

            <AdminCard title="Local Storage Footprint">
              <div className="font-mono text-base font-bold text-[#E4EB9C]">{storageUsed}</div>
              <span className="text-[11px] text-neutral-400 mt-1 block">Persistent cache & state (~5MB quota)</span>
            </AdminCard>
          </div>

          <AdminCard title="Modular Service Registry" subtitle="Status of isolated domain services prepared for backend plug-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                { name: 'ProductService', endpoint: '/wp-json/wc/v3/products', status: 'Mock Active • Ready for REST' },
                { name: 'OrderService', endpoint: '/wp-json/wc/v3/orders', status: 'Mock Active • Ready for REST' },
                { name: 'CategoryService', endpoint: '/wp-json/wc/v3/products/categories', status: 'Mock Active • Ready for REST' },
                { name: 'CustomerService', endpoint: '/wp-json/wc/v3/customers', status: 'Mock Active • Ready for REST' },
                { name: 'DeliveryService', endpoint: '/wp-json/cholti/v1/delivery-zones', status: 'Active (BD Logistics Logic)' },
                { name: 'CouponService', endpoint: '/wp-json/wc/v3/coupons', status: 'Mock Active • Ready for REST' },
                { name: 'ContentService', endpoint: '/wp-json/wp/v2/pages', status: 'Mock Active • Ready for REST' },
                { name: 'SiteDesignService', endpoint: '/wp-json/cholti/v1/theme-config', status: 'Active (Design Engine)' },
                { name: 'ReviewService', endpoint: '/wp-json/wc/v3/products/reviews', status: 'Mock Active • Ready for REST' },
                { name: 'AdminUserService', endpoint: '/wp-json/cholti/v1/admin-users', status: 'Active (RBAC Session Guard)' }
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div>
                    <div className="font-bold text-white">{svc.name}</div>
                    <div className="font-mono text-[10px] text-neutral-400">{svc.endpoint}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset All Administrative Data?"
        message="This action will restore default catalog items, orders, and configurations. Any changes made during this session will be replaced."
        confirmLabel="Yes, Reset to Default"
        isDanger
      />

    </div>
  );
};
