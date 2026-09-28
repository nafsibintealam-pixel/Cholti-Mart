import { CustomerProfile, CustomerGroupItem } from '../../types';
import { API_CONFIG } from '../api/config';
import { ICustomerAdapter } from './adapters/ICustomerAdapter';
import { CustomerMockAdapter } from './adapters/CustomerMockAdapter';
import { CustomerApiAdapter } from './adapters/CustomerApiAdapter';

export interface ICustomerService {
  getCustomers(): Promise<CustomerProfile[]>;
  getCustomersSync(): CustomerProfile[];
  getCustomerById(id: string): Promise<CustomerProfile | null>;
  createCustomer(profile: Omit<CustomerProfile, 'id' | 'joinedDate'>): Promise<CustomerProfile>;
  updateCustomer(id: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile>;
  toggleBlockStatus(id: string): Promise<CustomerProfile>;
  getCustomerGroups(): Promise<CustomerGroupItem[]>;
  getCustomerGroupsSync(): CustomerGroupItem[];
  getAdapterType(): 'mock' | 'api';
}

class CustomerServiceImpl implements ICustomerService {
  private mockAdapter: CustomerMockAdapter;
  private apiAdapter: CustomerApiAdapter | null = null;

  constructor() {
    this.mockAdapter = new CustomerMockAdapter();
  }

  private getAdapter(): ICustomerAdapter {
    if (API_CONFIG.isMockMode) {
      return this.mockAdapter;
    }
    if (!this.apiAdapter) {
      this.apiAdapter = new CustomerApiAdapter();
    }
    return this.apiAdapter;
  }

  public getAdapterType(): 'mock' | 'api' {
    return API_CONFIG.isMockMode ? 'mock' : 'api';
  }

  public getCustomersSync(): CustomerProfile[] {
    return this.getAdapter().getCustomersSync();
  }

  public async getCustomers(): Promise<CustomerProfile[]> {
    return this.getAdapter().getCustomers();
  }

  public async getCustomerById(id: string): Promise<CustomerProfile | null> {
    return this.getAdapter().getCustomerById(id);
  }

  public async createCustomer(profile: Omit<CustomerProfile, 'id' | 'joinedDate'>): Promise<CustomerProfile> {
    return this.getAdapter().createCustomer(profile);
  }

  public async updateCustomer(id: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
    return this.getAdapter().updateCustomer(id, updates);
  }

  public async toggleBlockStatus(id: string): Promise<CustomerProfile> {
    return this.getAdapter().toggleBlockStatus(id);
  }

  public getCustomerGroupsSync(): CustomerGroupItem[] {
    return this.getAdapter().getCustomerGroupsSync();
  }

  public async getCustomerGroups(): Promise<CustomerGroupItem[]> {
    return this.getAdapter().getCustomerGroups();
  }
}

export const customerService: ICustomerService = new CustomerServiceImpl();
