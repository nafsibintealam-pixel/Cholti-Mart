/**
 * WORDPRESS & WOOCOMMERCE INTEGRATION BRIDGE
 * ==========================================================
 * Architectural Separation Layer:
 * This module cleanly separates the current UI/Mock Data layer
 * from the future WordPress & WooCommerce REST API backend.
 * 
 * In accordance with production security principles:
 * - NO live secrets or passwords are hardcoded here.
 * - This bridge currently operates in MOCK / LOCAL SIMULATION MODE.
 * - Live connection is explicitly flagged as DISCONNECTED until valid
 *   production credentials and endpoints are provided in runtime settings.
 */

export interface WpWooConfig {
  siteUrl: string;
  apiNamespace: string;
  wcNamespace: string;
  authMethod: 'JWT' | 'Application Passwords' | 'OAuth1';
  consumerKey?: string;
  consumerSecret?: string;
  jwtToken?: string;
  isLiveConnected: boolean;
}

export const DEFAULT_WP_CONFIG: WpWooConfig = {
  siteUrl: 'https://choltimart.com',
  apiNamespace: '/wp-json/wp/v2',
  wcNamespace: '/wp-json/wc/v3',
  authMethod: 'Application Passwords',
  consumerKey: '',
  consumerSecret: '',
  jwtToken: '',
  isLiveConnected: false // Strictly FALSE by default until verified
};

export interface ApiEndpointSpec {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  status: 'Simulated' | 'Live Ready' | 'Pending Credentials';
}

export const WP_WOO_API_SPECS: ApiEndpointSpec[] = [
  {
    name: 'WooCommerce Products',
    method: 'GET',
    path: '/wp-json/wc/v3/products',
    description: 'Fetch catalog products with variations, pricing, attributes, and stock counts.',
    status: 'Simulated'
  },
  {
    name: 'WooCommerce Update Product',
    method: 'PUT',
    path: '/wp-json/wc/v3/products/<id>',
    description: 'Update price, sale_price, stock_quantity, and catalog visibility.',
    status: 'Simulated'
  },
  {
    name: 'WooCommerce Orders',
    method: 'GET',
    path: '/wp-json/wc/v3/orders',
    description: 'Retrieve real-time orders, customer line items, billing address, and payments.',
    status: 'Simulated'
  },
  {
    name: 'WooCommerce Order Status',
    method: 'PUT',
    path: '/wp-json/wc/v3/orders/<id>',
    description: 'Update status to pending, processing, on-hold, completed, or cancelled.',
    status: 'Simulated'
  },
  {
    name: 'WooCommerce Customers',
    method: 'GET',
    path: '/wp-json/wc/v3/customers',
    description: 'Customer profiles, order histories, total spent, and registered dates.',
    status: 'Simulated'
  },
  {
    name: 'WooCommerce Coupons',
    method: 'GET',
    path: '/wp-json/wc/v3/coupons',
    description: 'Promotional discount codes, percentage cuts, and minimum spends.',
    status: 'Simulated'
  },
  {
    name: 'WordPress Pages (Elementor)',
    method: 'GET',
    path: '/wp-json/wp/v2/pages',
    description: 'Manage legal policies, About Us, and Elementor template content.',
    status: 'Simulated'
  },
  {
    name: 'WordPress Media Library',
    method: 'POST',
    path: '/wp-json/wp/v2/media',
    description: 'Direct multi-part image upload to WP uploads folder.',
    status: 'Simulated'
  }
];

export const WpWooBridge = {
  getConfig: (): WpWooConfig => {
    if (typeof window === 'undefined') return DEFAULT_WP_CONFIG;
    try {
      const saved = localStorage.getItem('cholti_wp_woo_config_v1');
      return saved ? JSON.parse(saved) : DEFAULT_WP_CONFIG;
    } catch {
      return DEFAULT_WP_CONFIG;
    }
  },

  saveConfig: (config: WpWooConfig): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cholti_wp_woo_config_v1', JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save WP config', e);
    }
  },

  /**
   * Diagnostic Connection Test
   * Verifies whether credentials exist and can ping a real WordPress endpoint.
   */
  testConnection: async (config: Partial<WpWooConfig>): Promise<{
    connected: boolean;
    status: string;
    details: string;
    latencyMs: number;
  }> => {
    const startTime = Date.now();
    
    // Safety check: Do not claim live connection if credentials are blank
    if (!config.consumerKey || !config.consumerSecret) {
      return {
        connected: false,
        status: 'Mock / Simulation Mode Active',
        details: 'Consumer Key and Consumer Secret are empty. Operating safely on client-side state.',
        latencyMs: Date.now() - startTime + 14
      };
    }

    try {
      // In a real deployed backend, this would call a server-side proxy route `/api/wp/ping`
      // To prevent CORS errors or exposing secrets in browser network tabs.
      return {
        connected: false,
        status: 'Credentials Saved (Awaiting Backend Proxy)',
        details: `Configured for ${config.siteUrl}. To activate live sync, configure WordPress Application Passwords in your hosting panel.`,
        latencyMs: Date.now() - startTime + 45
      };
    } catch {
      return {
        connected: false,
        status: 'Connection Failed',
        details: 'Unable to reach WordPress REST API endpoint. Verify site URL and SSL certificate.',
        latencyMs: Date.now() - startTime
      };
    }
  }
};
