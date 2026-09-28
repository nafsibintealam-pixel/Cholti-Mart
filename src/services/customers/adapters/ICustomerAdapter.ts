import { CustomerProfile, CustomerGroupItem } from '../../../types';

export interface ICustomerAdapter {
  getCustomers(): Promise<CustomerProfile[]>;
  getCustomersSync(): CustomerProfile[];
  getCustomerById(id: string): Promise<CustomerProfile | null>;
  createCustomer(profile: Omit<CustomerProfile, 'id' | 'joinedDate'>): Promise<CustomerProfile>;
  updateCustomer(id: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile>;
  toggleBlockStatus(id: string): Promise<CustomerProfile>;
  getCustomerGroups(): Promise<CustomerGroupItem[]>;
  getCustomerGroupsSync(): CustomerGroupItem[];
}
