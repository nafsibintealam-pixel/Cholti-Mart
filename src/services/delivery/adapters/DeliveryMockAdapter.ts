import { DeliveryZone, CourierServiceConfig } from '../../../types';
import { IDeliveryAdapter } from './IDeliveryAdapter';

const ZONES_KEY = 'cholti_admin_delivery_zones_v1';
const COURIERS_KEY = 'cholti_admin_couriers_v1';

const INITIAL_ZONES: DeliveryZone[] = [
  {
    id: 'zone-dhaka',
    name: 'Inside Dhaka Metropolitan',
    districtName: 'Dhaka',
    charge: 60,
    estimatedDelivery: '24-48 Hours',
    isCodAvailable: true,
    courierPartner: 'Steadfast / Pathao',
    isActive: true
  },
  {
    id: 'zone-sub-dhaka',
    name: 'Dhaka Suburbs (Savar, Gazipur, Narayanganj)',
    districtName: 'Gazipur, Narayanganj, Savar',
    charge: 100,
    estimatedDelivery: '36-48 Hours',
    isCodAvailable: true,
    courierPartner: 'Steadfast Courier',
    isActive: true
  },
  {
    id: 'zone-nationwide',
    name: 'Outside Dhaka (All 63 Districts)',
    districtName: 'All Other Districts',
    charge: 130,
    estimatedDelivery: '48-72 Hours',
    isCodAvailable: true,
    courierPartner: 'Steadfast / RedX',
    isActive: true
  }
];

const INITIAL_COURIERS: CourierServiceConfig[] = [
  {
    id: 'courier-steadfast',
    name: 'Steadfast Courier Ltd.',
    code: 'steadfast',
    apiKey: '',
    secretKey: '',
    webhookUrl: 'https://api.choltimart.com/webhooks/steadfast',
    isEnabled: true,
    isSandboxed: true,
    statusText: 'Configured (Sandbox / Testing)',
    avgDeliveryHours: 36
  },
  {
    id: 'courier-pathao',
    name: 'Pathao Courier API',
    code: 'pathao',
    apiKey: '',
    secretKey: '',
    webhookUrl: 'https://api.choltimart.com/webhooks/pathao',
    isEnabled: true,
    isSandboxed: true,
    statusText: 'Configured (Sandbox / Testing)',
    avgDeliveryHours: 28
  },
  {
    id: 'courier-redx',
    name: 'RedX Delivery Services',
    code: 'redx',
    apiKey: '',
    secretKey: '',
    webhookUrl: 'https://api.choltimart.com/webhooks/redx',
    isEnabled: false,
    isSandboxed: true,
    statusText: 'Inactive',
    avgDeliveryHours: 48
  }
];

export class DeliveryMockAdapter implements IDeliveryAdapter {
  private zonesCache: DeliveryZone[] = [];
  private couriersCache: CourierServiceConfig[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const storedZones = localStorage.getItem(ZONES_KEY);
        this.zonesCache = storedZones ? JSON.parse(storedZones) : [...INITIAL_ZONES];

        const storedCouriers = localStorage.getItem(COURIERS_KEY);
        this.couriersCache = storedCouriers ? JSON.parse(storedCouriers) : [...INITIAL_COURIERS];
        return;
      } catch (e) {
        console.warn('Failed to load delivery settings from storage', e);
      }
    }
    this.zonesCache = [...INITIAL_ZONES];
    this.couriersCache = [...INITIAL_COURIERS];
  }

  public getDeliveryZonesSync(): DeliveryZone[] {
    return [...this.zonesCache];
  }

  public async getDeliveryZones(): Promise<DeliveryZone[]> {
    return [...this.zonesCache];
  }

  public async updateDeliveryZone(id: string, updates: Partial<DeliveryZone>): Promise<DeliveryZone> {
    const index = this.zonesCache.findIndex(z => z.id === id);
    if (index === -1) throw new Error(`Delivery zone ${id} not found`);
    this.zonesCache[index] = { ...this.zonesCache[index], ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem(ZONES_KEY, JSON.stringify(this.zonesCache));
    }
    return this.zonesCache[index];
  }

  public async createDeliveryZone(zone: Omit<DeliveryZone, 'id'>): Promise<DeliveryZone> {
    const created: DeliveryZone = {
      ...zone,
      id: `zone-${Date.now().toString(36)}`
    };
    this.zonesCache.push(created);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ZONES_KEY, JSON.stringify(this.zonesCache));
    }
    return created;
  }

  public saveDeliveryZones(zones: DeliveryZone[]): void {
    this.zonesCache = zones;
    if (typeof window !== 'undefined') {
      localStorage.setItem(ZONES_KEY, JSON.stringify(zones));
    }
  }

  public getCourierConfigsSync(): CourierServiceConfig[] {
    return [...this.couriersCache];
  }

  public async getCourierConfigs(): Promise<CourierServiceConfig[]> {
    return [...this.couriersCache];
  }

  public async updateCourierConfig(id: string, updates: Partial<CourierServiceConfig>): Promise<CourierServiceConfig> {
    const index = this.couriersCache.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Courier config ${id} not found`);
    this.couriersCache[index] = { ...this.couriersCache[index], ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem(COURIERS_KEY, JSON.stringify(this.couriersCache));
    }
    return this.couriersCache[index];
  }

  public saveCourierConfigs(couriers: CourierServiceConfig[]): void {
    this.couriersCache = couriers;
    if (typeof window !== 'undefined') {
      localStorage.setItem(COURIERS_KEY, JSON.stringify(couriers));
    }
  }
}
