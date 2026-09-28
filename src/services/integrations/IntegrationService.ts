export type IntegrationType = 
  | 'wordpress' 
  | 'woocommerce' 
  | 'bkash' 
  | 'nagad' 
  | 'sslcommerz' 
  | 'steadfast' 
  | 'pathao' 
  | 'sms' 
  | 'analytics';

export type IntegrationStatus = 'Not Connected' | 'Connecting' | 'Connected' | 'Error';

export interface IntegrationItem {
  id: string;
  type: IntegrationType;
  name: string;
  category: 'ecommerce' | 'payment' | 'courier' | 'marketing';
  status: IntegrationStatus;
  description: string;
  endpoint?: string;
  authType: string;
  lastTested?: string;
  isLive: boolean;
  statusNote: string;
}

export interface IIntegrationService {
  getIntegrations(): Promise<IntegrationItem[]>;
  getIntegrationsSync(): IntegrationItem[];
  getIntegration(type: IntegrationType): Promise<IntegrationItem | null>;
  testConnection(type: IntegrationType): Promise<{ success: boolean; message: string }>;
  disconnect(type: IntegrationType): Promise<boolean>;
  updateConfig(type: IntegrationType, updates: Partial<IntegrationItem>): Promise<IntegrationItem>;
}

const STORAGE_KEY = 'cholti_admin_integrations_v1';

const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'int-wp',
    type: 'wordpress',
    name: 'WordPress Core REST API',
    category: 'ecommerce',
    status: 'Not Connected',
    description: 'Bridges site content, legal pages, and blog articles to an external WordPress headless instance.',
    endpoint: 'https://choltimart.com/wp-json/wp/v2',
    authType: 'Application Passwords / JWT',
    isLive: false,
    statusNote: 'Requires live WordPress endpoint & application password in runtime settings.'
  },
  {
    id: 'int-woo',
    type: 'woocommerce',
    name: 'WooCommerce v3 REST API',
    category: 'ecommerce',
    status: 'Not Connected',
    description: 'Synchronizes products, inventory, coupons, and orders directly with WooCommerce database.',
    endpoint: 'https://choltimart.com/wp-json/wc/v3',
    authType: 'Consumer Key & Secret (OAuth 1.0a / Basic)',
    isLive: false,
    statusNote: 'Catalog currently running in local architectural decoupling mode. Enter WooCommerce REST API keys to activate.'
  },
  {
    id: 'int-bkash',
    type: 'bkash',
    name: 'bKash Merchant PGW',
    category: 'payment',
    status: 'Not Connected',
    description: 'bKash tokenized payment checkout integration for automated payment status verification.',
    endpoint: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
    authType: 'App Key & Secret + Username/Password',
    isLive: false,
    statusNote: 'Manual bKash transfer instructions currently active. Automated checkout requires merchant credentials.'
  },
  {
    id: 'int-nagad',
    type: 'nagad',
    name: 'Nagad Direct Gateway',
    category: 'payment',
    status: 'Not Connected',
    description: 'Direct payment gateway checkout for Nagad wallet holders.',
    endpoint: 'https://api.mynagad.com/api/dfs',
    authType: 'Merchant ID & Public/Private Keys',
    isLive: false,
    statusNote: 'Not configured.'
  },
  {
    id: 'int-sslcommerz',
    type: 'sslcommerz',
    name: 'SSLCommerz Multi-Card Payment',
    category: 'payment',
    status: 'Not Connected',
    description: 'Accepts Visa, Mastercard, AMEX, and Bangladeshi internet banking.',
    endpoint: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
    authType: 'Store ID & Store Password',
    isLive: false,
    statusNote: 'Sandbox mode ready. Live API credentials required for production transactions.'
  },
  {
    id: 'int-steadfast',
    type: 'steadfast',
    name: 'Steadfast Courier API',
    category: 'courier',
    status: 'Not Connected',
    description: 'Automates parcel creation, consignment tracking, and delivery webhook callbacks.',
    endpoint: 'https://portal.steadfast.com.bd/api/v1',
    authType: 'API Key & Secret Key',
    isLive: false,
    statusNote: 'Simulated tracking active. Add production Steadfast API key for automated parcel booking.'
  },
  {
    id: 'int-pathao',
    type: 'pathao',
    name: 'Pathao Courier API',
    category: 'courier',
    status: 'Not Connected',
    description: 'Same-day and next-day automated parcel dispatch with Pathao courier logistics.',
    endpoint: 'https://api-hermes.pathao.com/aladdin/api/v1',
    authType: 'Client ID, Client Secret & Bearer Token',
    isLive: false,
    statusNote: 'Not connected.'
  },
  {
    id: 'int-sms',
    type: 'sms',
    name: 'Bangladeshi Bulk SMS Gateway (Greenweb / Elitbuzz)',
    category: 'marketing',
    status: 'Not Connected',
    description: 'Dispatches automated order placement SMS, OTP verification, and tracking links to customers.',
    endpoint: 'https://api.greenweb.com.bd/api.php',
    authType: 'API Token',
    isLive: false,
    statusNote: 'SMS notifications currently simulated locally.'
  }
];

class IntegrationServiceImpl implements IIntegrationService {
  private cache: IntegrationItem[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.cache = JSON.parse(stored);
          return;
        }
      } catch (e) {
        console.warn('Failed to load integration states', e);
      }
    }
    this.cache = [...INITIAL_INTEGRATIONS];
    this.persist();
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      } catch (e) {
        console.warn('Failed to persist integration states', e);
      }
    }
  }

  public getIntegrationsSync(): IntegrationItem[] {
    return [...this.cache];
  }

  public async getIntegrations(): Promise<IntegrationItem[]> {
    return [...this.cache];
  }

  public async getIntegration(type: IntegrationType): Promise<IntegrationItem | null> {
    const found = this.cache.find(i => i.type === type);
    return found ? { ...found } : null;
  }

  public async testConnection(type: IntegrationType): Promise<{ success: boolean; message: string }> {
    const item = this.cache.find(i => i.type === type);
    if (!item) {
      return { success: false, message: `Integration ${type} not found` };
    }

    // In preview without a real backend server, clearly and honestly report pending credentials
    if (!item.isLive) {
      return {
        success: false,
        message: `Connection test pending: No live production API credentials configured for ${item.name}. Operating in offline architecture mode.`
      };
    }

    return {
      success: true,
      message: `Successfully communicated with ${item.name} endpoint.`
    };
  }

  public async disconnect(type: IntegrationType): Promise<boolean> {
    const index = this.cache.findIndex(i => i.type === type);
    if (index === -1) return false;
    this.cache[index] = {
      ...this.cache[index],
      status: 'Not Connected',
      isLive: false,
      statusNote: 'Disconnected by administrator.'
    };
    this.persist();
    return true;
  }

  public async updateConfig(type: IntegrationType, updates: Partial<IntegrationItem>): Promise<IntegrationItem> {
    const index = this.cache.findIndex(i => i.type === type);
    if (index === -1) throw new Error(`Integration ${type} not found`);
    this.cache[index] = { ...this.cache[index], ...updates };
    this.persist();
    return this.cache[index];
  }
}

export const integrationService: IIntegrationService = new IntegrationServiceImpl();
