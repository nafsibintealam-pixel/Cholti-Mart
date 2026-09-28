import { PaymentTransactionRecord, RefundItemRecord } from '../../types';
import { INITIAL_TRANSACTIONS, INITIAL_REFUNDS } from '../adminMockService';

export interface IPaymentService {
  getTransactions(): Promise<PaymentTransactionRecord[]>;
  getTransactionsSync(): PaymentTransactionRecord[];
  saveTransactions(txs: PaymentTransactionRecord[]): void;

  getRefunds(): Promise<RefundItemRecord[]>;
  getRefundsSync(): RefundItemRecord[];
  saveRefunds(refunds: RefundItemRecord[]): void;
  updateRefundStatus(id: string, newStatus: RefundItemRecord['status']): Promise<RefundItemRecord[]>;
  updateRefundStatusSync(id: string, newStatus: RefundItemRecord['status']): RefundItemRecord[];
}

const STORAGE_KEYS = {
  TRANSACTIONS: 'cholti_admin_transactions_v1',
  REFUNDS: 'cholti_admin_refunds_v1'
};

class PaymentServiceImpl implements IPaymentService {
  private transactionsCache: PaymentTransactionRecord[] = [];
  private refundsCache: RefundItemRecord[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        this.transactionsCache = storedTx ? JSON.parse(storedTx) : INITIAL_TRANSACTIONS;

        const storedRef = localStorage.getItem(STORAGE_KEYS.REFUNDS);
        this.refundsCache = storedRef ? JSON.parse(storedRef) : INITIAL_REFUNDS;
      } catch (e) {
        console.warn('Failed to load payments data from storage', e);
        this.transactionsCache = INITIAL_TRANSACTIONS;
        this.refundsCache = INITIAL_REFUNDS;
      }
    } else {
      this.transactionsCache = INITIAL_TRANSACTIONS;
      this.refundsCache = INITIAL_REFUNDS;
    }
  }

  public getTransactionsSync(): PaymentTransactionRecord[] {
    return [...this.transactionsCache];
  }

  public async getTransactions(): Promise<PaymentTransactionRecord[]> {
    return [...this.transactionsCache];
  }

  public saveTransactions(txs: PaymentTransactionRecord[]): void {
    this.transactionsCache = txs;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
    }
  }

  public getRefundsSync(): RefundItemRecord[] {
    return [...this.refundsCache];
  }

  public async getRefunds(): Promise<RefundItemRecord[]> {
    return [...this.refundsCache];
  }

  public saveRefunds(refunds: RefundItemRecord[]): void {
    this.refundsCache = refunds;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.REFUNDS, JSON.stringify(refunds));
    }
  }

  public updateRefundStatusSync(id: string, newStatus: RefundItemRecord['status']): RefundItemRecord[] {
    this.refundsCache = this.refundsCache.map(r => r.id === id ? { ...r, status: newStatus } : r);
    this.saveRefunds(this.refundsCache);
    return [...this.refundsCache];
  }

  public async updateRefundStatus(id: string, newStatus: RefundItemRecord['status']): Promise<RefundItemRecord[]> {
    return this.updateRefundStatusSync(id, newStatus);
  }
}

export const paymentService: IPaymentService = new PaymentServiceImpl();
