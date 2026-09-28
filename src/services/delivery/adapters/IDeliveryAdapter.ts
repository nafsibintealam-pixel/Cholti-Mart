import { DeliveryZone, CourierServiceConfig } from '../../../types';

export interface IDeliveryAdapter {
  getDeliveryZones(): Promise<DeliveryZone[]>;
  getDeliveryZonesSync(): DeliveryZone[];
  updateDeliveryZone(id: string, updates: Partial<DeliveryZone>): Promise<DeliveryZone>;
  createDeliveryZone(zone: Omit<DeliveryZone, 'id'>): Promise<DeliveryZone>;
  saveDeliveryZones(zones: DeliveryZone[]): void;
  getCourierConfigs(): Promise<CourierServiceConfig[]>;
  getCourierConfigsSync(): CourierServiceConfig[];
  updateCourierConfig(id: string, updates: Partial<CourierServiceConfig>): Promise<CourierServiceConfig>;
  saveCourierConfigs(couriers: CourierServiceConfig[]): void;
}
