import React, { useState } from 'react';
import { 
  FileCode, 
  Layers, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Cpu, 
  ShoppingBag, 
  Database, 
  Server, 
  Code2, 
  ChevronRight,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
import { WP_MAPPING } from '../../data/wpMapping';
import { useShop } from '../../context/ShopContext';

export const WpGuideView: React.FC = () => {
  const { navigateTo } = useShop();
  const [activeSection, setActiveSection] = useState<'overview' | 'plugins' | 'mapping' | 'checkout' | 'bangladesh'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 mb-6 flex items-center gap-2">
        <button onClick={() => navigateTo('home')} className="hover:text-neutral-700">Home</button>
        <span>/</span>
        <span className="text-neutral-800 font-medium">WordPress & WooCommerce Blueprint</span>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Deployment Source of Truth</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            WordPress + WooCommerce + Elementor Migration Guide
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            This live prototype of <strong>Cholti Mart</strong> was specifically built to map 1:1 with native WooCommerce data structures and Elementor Theme Builder templates. No proprietary dependencies or hidden APIs required.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 overflow-x-auto gap-2 sm:gap-6 pb-2 mb-8">
        {[
          { id: 'overview', label: '1. Recommended Stack' },
          { id: 'plugins', label: '2. Plugin Blueprint' },
          { id: 'mapping', label: '3. Elementor Widget Mapping' },
          { id: 'checkout', label: '4. BD Checkout Fields' },
          { id: 'bangladesh', label: '5. Courier & Payments' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`py-2 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-2.5 ${
              activeSection === tab.id
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Base Theme</span>
              <h3 className="text-lg font-bold text-neutral-900">Hello Elementor / Astra</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Use a featherlight blank canvas theme to keep page generation speeds under 1.2 seconds on standard LiteSpeed servers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Page Builder</span>
              <h3 className="text-lg font-bold text-neutral-900">Elementor Pro</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Utilize Elementor Theme Builder for dynamic Header, Footer, Single Product templates, and the custom Loop Grid Builder.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">E-Commerce Engine</span>
              <h3 className="text-lg font-bold text-neutral-900">WooCommerce Core</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Native products, attributes (Color, Size), customer accounts, discount coupons, and inventory management.
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">Deployment Workflow (5 Step Process):</h3>
            <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-neutral-700">
              <li><strong>Hosting Setup:</strong> Provision hosting with LiteSpeed Web Server, PHP 8.2+, and MariaDB/MySQL.</li>
              <li><strong>Core Installation:</strong> Install WordPress, enable HTTPS/SSL, and set permalinks to <code>/%postname%/</code>.</li>
              <li><strong>Activate WooCommerce:</strong> Set Store Country to Bangladesh, Currency to Bangladeshi Taka (৳, BDT).</li>
              <li><strong>Elementor Theme Builder:</strong> Recreate the Header, Footer, Homepage, and Shop templates matching the layout in this app.</li>
              <li><strong>Integrate Gateways:</strong> Install bKash/Nagad or SSLCommerz plugin along with Steadfast/Pathao Courier API for automated parcel dispatch.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Tab 2: Plugins */}
      {activeSection === 'plugins' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-base font-bold text-neutral-900">Recommended Plugin Ecosystem</h2>
            <span className="text-xs text-neutral-500">Free & lightweight prioritized</span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Feature / Role</th>
                  <th className="py-3 px-4">Recommended Plugin</th>
                  <th className="py-3 px-4">Purpose in Cholti Mart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {WP_MAPPING.plugins.map(p => (
                  <tr key={p.name} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-bold text-neutral-900">{p.role}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">{p.name}</td>
                    <td className="py-3 px-4 text-neutral-600">{p.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Widget Mapping */}
      {activeSection === 'mapping' && (
        <div className="space-y-6">
          <div className="pb-2">
            <h2 className="text-base font-bold text-neutral-900">Component to Elementor Widget Conversion</h2>
            <p className="text-xs text-neutral-500">Exact widgets to drag-and-drop inside Elementor</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WP_MAPPING.pages.map(page => (
              <div key={page.name} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h3 className="text-sm font-bold text-neutral-900">{page.name}</h3>
                  <span className="text-[10px] bg-neutral-100 text-neutral-700 font-mono px-2 py-0.5 rounded">
                    {page.type}
                  </span>
                </div>

                <div className="space-y-2">
                  {page.sections.map((sec, idx) => (
                    <div key={idx} className="text-xs bg-neutral-50 p-2.5 rounded-xl flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-neutral-800 block">{sec.section}</span>
                        <span className="text-emerald-700 font-mono text-[11px] block">{sec.elementorWidget}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 max-w-[120px] text-right">{sec.notes}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: BD Checkout Fields */}
      {activeSection === 'checkout' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-neutral-900">
              Bangladesh Localized Checkout Fields (Checkout Field Editor)
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Standard WooCommerce checkout includes unnecessary fields like State/Zip Code. For Bangladesh high-converting checkout, configure these fields:
            </p>

            <div className="bg-neutral-900 text-neutral-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <pre>{`// Suggested functions.php snippet to streamline BD checkout:
add_filter( 'woocommerce_checkout_fields' , 'choltimart_custom_bd_checkout_fields' );

function choltimart_custom_bd_checkout_fields( $fields ) {
    // Make phone number mandatory for courier verification
    $fields['billing']['billing_phone']['required'] = true;
    $fields['billing']['billing_phone']['placeholder'] = '017XXXXXXXX';
    
    // Set district label
    $fields['billing']['billing_city']['label'] = 'District / City';
    
    // Remove postal code (unnecessary in BD)
    unset($fields['billing']['billing_postcode']);
    
    return $fields;
}`}</pre>
            </div>

            <button
              onClick={() => copyToClipboard(`add_filter( 'woocommerce_checkout_fields' , 'choltimart_custom_bd_checkout_fields' );`, 'snippet')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition-colors"
            >
              {copiedKey === 'snippet' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'snippet' ? 'Copied to Clipboard!' : 'Copy Code Snippet'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Bangladesh Specific */}
      {activeSection === 'bangladesh' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-neutral-900">
              Bangladesh Logistics & Courier API Integration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                <span className="font-bold text-neutral-900 block">Steadfast Courier Plugin</span>
                <p className="text-neutral-600 text-xs">
                  Official WordPress plugin automatically pushes WooCommerce orders directly to Steadfast rider dispatch with consignment tracking IDs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                <span className="font-bold text-neutral-900 block">Pathao Courier Plugin</span>
                <p className="text-neutral-600 text-xs">
                  Enables on-demand express dispatch in Dhaka, Chittagong, and Sylhet with automated tracking links sent via SMS.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
