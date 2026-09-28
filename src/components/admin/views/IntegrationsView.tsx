import React, { useState } from 'react';
import { 
  Puzzle, 
  Globe, 
  Share2, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Save,
  Check,
  Zap
} from 'lucide-react';
import { AdminCard, AdminBadge, AdminButton } from '../common/AdminUiElements';
import { WpWooBridge } from '../../../services/wpWooBridge';

export interface IntegrationsViewProps {
  subnav?: string;
  onNavigateSubnav: (sub: string) => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  subnav = 'all',
  onNavigateSubnav
}) => {
  const [wooUrl, setWooUrl] = useState('https://choltimart.com');
  const [consumerKey, setConsumerKey] = useState('ck_982f1b8a97c6d4e21a0038491');
  const [consumerSecret, setConsumerSecret] = useState('cs_********************************');
  const [isWooTesting, setIsWooTesting] = useState(false);
  const [wooTestResult, setWooTestResult] = useState<string | null>(null);

  // Marketing & Analytics
  const [fbPixelId, setFbPixelId] = useState('9812739481239');
  const [ga4Id, setGa4Id] = useState('G-8XZ91K0LQ');
  const [smsApiKey, setSmsApiKey] = useState('gw_secret_token_live_bd');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTestWooConnection = async () => {
    setIsWooTesting(true);
    setWooTestResult(null);
    try {
      const res = await WpWooBridge.testConnection({
        siteUrl: wooUrl,
        consumerKey,
        consumerSecret
      });
      setWooTestResult(`${res.status}: ${res.details}`);
    } catch (e) {
      setWooTestResult('Failed to connect to WooCommerce endpoint.');
    } finally {
      setIsWooTesting(false);
    }
  };

  const handleSaveIntegrations = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Subnav Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 text-xs font-medium">
        {[
          { id: 'all', label: 'All Third-Party Integrations' },
          { id: 'woocommerce', label: 'WordPress / WooCommerce API Bridge' },
          { id: 'analytics', label: 'Meta Pixel & Google Analytics' },
          { id: 'sms_gateway', label: 'Bangladesh SMS Gateway' }
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

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Integration API keys saved securely!</span>
        </div>
      )}

      {/* WooCommerce Bridge Card */}
      {(subnav === 'all' || subnav === 'woocommerce') && (
        <AdminCard
          title="WordPress & WooCommerce REST API Sync"
          subtitle="Bi-directional synchronization of products, inventory stock, and customer orders"
          action={
            <AdminBadge variant="warning" size="xs" dot>
              Mock / Standalone Mode
            </AdminBadge>
          }
        >
          <div className="space-y-4 text-xs max-w-2xl">
            <p className="text-neutral-300 leading-relaxed">
              When enabled, your Cholti Mart React storefront seamlessly pushes incoming checkout orders into your WooCommerce dashboard and fetches catalog stock in real time.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">WordPress / WooCommerce Site URL</label>
                <input
                  type="url"
                  value={wooUrl}
                  onChange={(e) => setWooUrl(e.target.value)}
                  placeholder="https://yourstore.com"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#8DA750]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Consumer Key (ck_...)</label>
                  <input
                    type="text"
                    value={consumerKey}
                    onChange={(e) => setConsumerKey(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#8DA750]"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Consumer Secret (cs_...)</label>
                  <input
                    type="password"
                    value={consumerSecret}
                    onChange={(e) => setConsumerSecret(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#8DA750]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={handleTestWooConnection}
                disabled={isWooTesting}
              >
                {isWooTesting ? 'Pinging WooCommerce...' : 'Test API Connection'}
              </AdminButton>
              <AdminButton variant="lime" size="sm" onClick={handleSaveIntegrations}>
                Save WooCommerce Keys
              </AdminButton>
            </div>

            {wooTestResult && (
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-mono">
                {wooTestResult}
              </div>
            )}
          </div>
        </AdminCard>
      )}

      {/* Meta Pixel & GA4 */}
      {(subnav === 'all' || subnav === 'analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminCard title="Meta Pixel & Conversions API" subtitle="Track storefront page views, add to cart, and purchase events">
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={fbPixelId}
                  onChange={(e) => setFbPixelId(e.target.value)}
                  placeholder="e.g. 9812739481239"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono"
                />
              </div>
              <AdminButton variant="lime" size="sm" onClick={handleSaveIntegrations}>
                Save Pixel
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard title="Google Analytics 4 (GA4)" subtitle="E-commerce revenue and funnel performance">
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">GA4 Measurement ID</label>
                <input
                  type="text"
                  value={ga4Id}
                  onChange={(e) => setGa4Id(e.target.value)}
                  placeholder="e.g. G-8XZ91K0LQ"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono"
                />
              </div>
              <AdminButton variant="lime" size="sm" onClick={handleSaveIntegrations}>
                Save GA4
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      )}

      {/* SMS Gateway Card */}
      {(subnav === 'all' || subnav === 'sms_gateway') && (
        <AdminCard title="Bangladesh Masking SMS Gateway" subtitle="Greenweb, BulkSMSBD, or Onnorokom SMS token">
          <div className="space-y-3 text-xs max-w-lg">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">SMS API Token / Secret</label>
              <input
                type="password"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono"
              />
            </div>
            <AdminButton variant="lime" size="sm" onClick={handleSaveIntegrations}>
              Save SMS Gateway
            </AdminButton>
          </div>
        </AdminCard>
      )}

    </div>
  );
};
