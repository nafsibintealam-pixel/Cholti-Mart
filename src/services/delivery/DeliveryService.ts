import { DeliveryZone, CourierServiceConfig } from '../../types';
import { API_CONFIG } from '../api/config';
import { IDeliveryAdapter } from './adapters/IDeliveryAdapter';
import { DeliveryMockAdapter } from './adapters/DeliveryMockAdapter';
import { DeliveryApiAdapter } from './adapters/DeliveryApiAdapter';

export const FREE_DELIVERY_THRESHOLD = 2500;

export interface IDeliveryService {
  getDeliveryZones(): Promise<DeliveryZone[]>;
  getDeliveryZonesSync(): DeliveryZone[];
  calculateDeliveryFee(district: string, subtotal: number): number;
  updateDeliveryZone(id: string, updates: Partial<DeliveryZone>): Promise<DeliveryZone>;
  createDeliveryZone(zone: Omit<DeliveryZone, 'id'>): Promise<DeliveryZone>;
  saveDeliveryZones(zones: DeliveryZone[]): void;
  getCourierConfigs(): Promise<CourierServiceConfig[]>;
  getCourierConfigsSync(): CourierServiceConfig[];
  updateCourierConfig(id: string, updates: Partial<CourierServiceConfig>): Promise<CourierServiceConfig>;
  saveCourierConfigs(couriers: CourierServiceConfig[]): void;
  getAdapterType(): 'mock' | 'api';
}

class DeliveryServiceImpl implements IDeliveryService {
  private mockAdapter: DeliveryMockAdapter;
  private apiAdapter: DeliveryApiAdapter | null = null;

  constructor() {
    this.mockAdapter = new DeliveryMockAdapter();
  }

  private getAdapter(): IDeliveryAdapter {
    if (API_CONFIG.isMockMode) {
      return this.mockAdapter;
    }
    if (!this.apiAdapter) {
      this.apiAdapter = new DeliveryApiAdapter();
    }
    return this.apiAdapter;
  }

  public getAdapterType(): 'mock' | 'api' {
    return API_CONFIG.isMockMode ? 'mock' : 'api';
  }

  public getDeliveryZonesSync(): DeliveryZone[] {
    return this.getAdapter().getDeliveryZonesSync();
  }

  public async getDeliveryZones(): Promise<DeliveryZone[]> {
    return this.getAdapter().getDeliveryZones();
  }

  public calculateDeliveryFee(district: string, subtotal: number): number {
    if (subtotal >= FREE_DELIVERY_THRESHOLD) {
      return 0;
    }

    const zones = this.getDeliveryZonesSync();
    const dist = (district || '').toLowerCase().trim();

    if (dist === 'dhaka') {
      const dhakaZone = zones.find(z => z.id === 'zone-dhaka' && z.isActive);
      return dhakaZone ? dhakaZone.charge : 60;
    }
    if (dist === 'gazipur' || dist === 'narayanganj' || dist === 'savar') {
      const subZone = zones.find(z => z.id === 'zone-sub-dhaka' && z.isActive);
      return subZone ? subZone.charge : 100;
    }

    const nationZone = zones.find(z => z.id === 'zone-nationwide' && z.isActive);
    return nationZone ? nationZone.charge : 130;
  }

  public async updateDeliveryZone(id: string, updates: Partial<DeliveryZone>): Promise<DeliveryZone> {
    return this.getAdapter().updateDeliveryZone(id, updates);
  }

  public async createDeliveryZone(zone: Omit<DeliveryZone, 'id'>): Promise<DeliveryZone> {
    return this.getAdapter().createDeliveryZone(zone);
  }

  public saveDeliveryZones(zones: DeliveryZone[]): void {
    this.getAdapter().saveDeliveryZones(zones);
  }

  public getCourierConfigsSync(): CourierServiceConfig[] {
    return this.getAdapter().getCourierConfigsSync();
  }

  public async getCourierConfigs(): Promise<CourierServiceConfig[]> {
    return this.getAdapter().getCourierConfigs();
  }

  public async updateCourierConfig(id: string, updates: Partial<CourierServiceConfig>): Promise<CourierServiceConfig> {
    return this.getAdapter().updateCourierConfig(id, updates);
  }

  public saveCourierConfigs(couriers: CourierServiceConfig[]): void {
    this.getAdapter().saveCourierConfigs(couriers);
  }
}

export const deliveryService: IDeliveryService = new DeliveryServiceImpl();
