import { DeliveryZone, CourierServiceConfig } from '../../../types';
import { IDeliveryAdapter } from './IDeliveryAdapter';
import { apiClient } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';
import { assertLiveApiReady, API_CONFIG } from '../../api/config';

export class DeliveryApiAdapter implements IDeliveryAdapter {
  private zonesCache: DeliveryZone[] = [];
  private couriersCache: CourierServiceConfig[] = [];

  constructor() {
    assertLiveApiReady();
  }

  public getDeliveryZonesSync(): DeliveryZone[] {
    return [...this.zonesCache];
  }

  public async getDeliveryZones(): Promise<DeliveryZone[]> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<DeliveryZone[]>(ENDPOINTS.DELIVERY.ZONES);
      this.zonesCache = res.data;
      return res.data;
    } catch (err: any) {
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load delivery zones: ${err.message || 'Service unavailable'}`);
      }
      return this.zonesCache;
    }
  }

  public async updateDeliveryZone(id: string, updates: Partial<DeliveryZone>): Promise<DeliveryZone> {
    assertLiveApiReady();
    const res = await apiClient.put<DeliveryZone>(`${ENDPOINTS.DELIVERY.ZONES}/${id}`, updates);
    return res.data;
  }

  public async createDeliveryZone(zone: Omit<DeliveryZone, 'id'>): Promise<DeliveryZone> {
    assertLiveApiReady();
    const res = await apiClient.post<DeliveryZone>(ENDPOINTS.DELIVERY.ZONES, zone);
    return res.data;
  }

  public saveDeliveryZones(zones: DeliveryZone[]): void {
    this.zonesCache = zones;
  }

  public getCourierConfigsSync(): CourierServiceConfig[] {
    return [...this.couriersCache];
  }

  public async getCourierConfigs(): Promise<CourierServiceConfig[]> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<CourierServiceConfig[]>(ENDPOINTS.DELIVERY.COURIERS);
      this.couriersCache = res.data;
      return res.data;
    } catch (err: any) {
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load courier configurations: ${err.message || 'Service unavailable'}`);
      }
      return this.couriersCache;
    }
  }

  public async updateCourierConfig(id: string, updates: Partial<CourierServiceConfig>): Promise<CourierServiceConfig> {
    assertLiveApiReady();
    const res = await apiClient.put<CourierServiceConfig>(`${ENDPOINTS.DELIVERY.COURIERS}/${id}`, updates);
    return res.data;
  }

  public saveCourierConfigs(couriers: CourierServiceConfig[]): void {
    this.couriersCache = couriers;
  }
}
