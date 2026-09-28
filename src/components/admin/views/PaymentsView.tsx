import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Download,
  Filter,
  Check,
  X
} from 'lucide-react';
import { PaymentTransactionRecord, RefundItemRecord } from '../../../types';
import { 
  AdminCard, 
  AdminBadge, 
  AdminButton, 
  AdminSearchInput, 
  AdminPagination, 
  AdminExportButton 
} from '../common/AdminUiElements';
import { paymentService } from '../../../services';

export interface PaymentsViewProps {
  subnav?: string;
  onNavigateSubnav: (sub: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  subnav = 'methods',
  onNavigateSubnav
}) => {
  const [transactions] = useState<PaymentTransactionRecord[]>(() => paymentService.getTransactionsSync());
  const [refunds, setRefunds] = useState<RefundItemRecord[]>(() => paymentService.getRefundsSync());
  const [searchQuery, setSearchQuery] = useState('');

  // COD config state
  const [codMaxLimit, setCodMaxLimit] = useState(15000);
  const [requirePhoneOtp, setRequirePhoneOtp] = useState(true);
  const [advanceShippingFee, setAdvanceShippingFee] = useState(false);

  const handleUpdateRefund = (id: string, newStatus: RefundItemRecord['status']) => {
    const updated = paymentService.updateRefundStatusSync(id, newStatus);
    setRefunds(updated);
  };

  const handleExportTransactions = () => {
    const headers = ['Trx ID', 'Order ID', 'Customer', 'Method', 'Amount (BDT)', 'Gateway Fee', 'Net Amount', 'Date', 'Status'];
    const rows = transactions.map(t => [
      t.trxId,
      t.orderId,
      `"${t.customerName.replace(/"/g, '""')}"`,
      t.method,
      t.amount,
      t.gatewayFee,
      t.netAmount,
      t.date,
      t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cholti_mart_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Subnav Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'methods', label: 'Payment Gateways' },
            { id: 'cod_settings', label: 'Cash on Delivery Rules' },
            { id: 'transactions', label: `Transactions Log (${transactions.length})` },
            { id: 'refunds', label: `Refund Requests (${refunds.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigateSubnav(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl transition-colors font-medium ${
                subnav === tab.id
                  ? 'bg-[#2D5128] text-[#E4EB9C] font-bold border border-[#8DA750]/40'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {subnav === 'transactions' && (
          <AdminExportButton onExportCsv={handleExportTransactions} />
        )}
      </div>

      {subnav === 'cod_settings' ? (
        /* COD Settings Form */
        <div className="max-w-2xl">
          <AdminCard title="Cash on Delivery (COD) Rules & Safeguards" subtitle="Protect your store against frivolous orders and delivery rejections">
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Maximum Order Limit for COD (BDT ৳)</label>
                <input
                  type="number"
                  value={codMaxLimit}
                  onChange={(e) => setCodMaxLimit(Number(e.target.value))}
                  className="w-full max-w-xs px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#8DA750]"
                />
                <span className="text-[11px] text-neutral-500 mt-1 block">Orders above this threshold require online prepayment.</span>
              </div>

              <div className="pt-2 space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requirePhoneOtp}
                    onChange={(e) => setRequirePhoneOtp(e.target.checked)}
                    className="rounded bg-neutral-900 border-neutral-700 text-[#8DA750]"
                  />
                  <div>
                    <span className="text-white font-semibold block">Phone Number Verification for 1st-Time Shoppers</span>
                    <span className="text-neutral-400 text-[11px]">Require SMS OTP verification before order creation</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={advanceShippingFee}
                    onChange={(e) => setAdvanceShippingFee(e.target.checked)}
                    className="rounded bg-neutral-900 border-neutral-700 text-[#8DA750]"
                  />
                  <div>
                    <span className="text-white font-semibold block">Advance Shipping Fee for Outside Dhaka</span>
                    <span className="text-neutral-400 text-[11px]">Prompt customer to pay ৳130 delivery fee via bKash to confirm order</span>
                  </div>
                </label>
              </div>

              <div className="pt-3">
                <AdminButton variant="lime" size="sm">
                  Save COD Safeguards
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        </div>
      ) : subnav === 'refunds' ? (
        /* Refund Requests View */
        <AdminCard title="Customer Refund & Return Requests" subtitle="Manage returns, product exchanges, and payout transactions" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 text-[10px] uppercase font-bold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3">Refund ID</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                {refunds.map((ref) => (
                  <tr key={ref.id} className="hover:bg-neutral-800/40">
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      {ref.refundNumber}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-neutral-400">
                      #{ref.orderId}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-white">
                      {ref.customerName}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-[#E4EB9C]">
                      ৳{ref.amount.toLocaleString()} ({ref.method})
                    </td>
                    <td className="px-4 py-3.5 text-neutral-300 max-w-xs truncate">
                      {ref.reason}
                    </td>
                    <td className="px-4 py-3.5">
                      <AdminBadge
                        variant={ref.status === 'Approved' ? 'info' : ref.status === 'Processed' ? 'success' : 'warning'}
                        size="xs"
                      >
                        {ref.status}
                      </AdminBadge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {ref.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleUpdateRefund(ref.id, 'Approved')}
                            className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                            title="Approve Refund"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleUpdateRefund(ref.id, 'Rejected')}
                            className="p-1 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25"
                            title="Reject Refund"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      {ref.status === 'Approved' && (
                        <button
                          onClick={() => handleUpdateRefund(ref.id, 'Processed')}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[#E4EB9C] text-[10px] font-bold"
                        >
                          Mark Processed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      ) : subnav === 'transactions' ? (
        /* Transactions Log View */
        <AdminCard title="Payment Gateway Transactions" subtitle="Official bKash, Nagad, Card and COD transaction records" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 text-[10px] uppercase font-bold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Gross</th>
                  <th className="px-4 py-3">Gateway Fee</th>
                  <th className="px-4 py-3">Net</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                {transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-neutral-800/40">
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      {trx.trxId}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-neutral-400">
                      #{trx.orderId}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-white">
                      {trx.customerName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[11px]">{trx.method}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-white">
                      ৳{trx.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-neutral-400">
                      ৳{trx.gatewayFee}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-400">
                      ৳{trx.netAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-neutral-400 text-[11px] whitespace-nowrap">
                      {trx.date}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <AdminBadge variant={trx.status === 'Completed' ? 'success' : 'warning'} size="xs">
                        {trx.status}
                      </AdminBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      ) : (
        /* Payment Methods Overview */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <AdminCard
            title="bKash Merchant API"
            subtitle="Direct tokenized checkout"
            action={<AdminBadge variant="success" size="xs">Active</AdminBadge>}
          >
            <div className="space-y-3 text-xs">
              <p className="text-neutral-300">Instant bKash payment verification with automated IPN callbacks.</p>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] space-y-1">
                <div>Gateway Fee: <strong className="text-white">1.5%</strong></div>
                <div>Status: <span className="text-emerald-400 font-bold">Live Ready</span></div>
              </div>
            </div>
          </AdminCard>

          <AdminCard
            title="Nagad Direct Pay"
            subtitle="Government Postal MFS gateway"
            action={<AdminBadge variant="success" size="xs">Active</AdminBadge>}
          >
            <div className="space-y-3 text-xs">
              <p className="text-neutral-300">Seamless Nagad checkout for national debit transfers.</p>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] space-y-1">
                <div>Gateway Fee: <strong className="text-white">1.2%</strong></div>
                <div>Status: <span className="text-emerald-400 font-bold">Live Ready</span></div>
              </div>
            </div>
          </AdminCard>

          <AdminCard
            title="Cash on Delivery (COD)"
            subtitle="Nationwide courier collection"
            action={<AdminBadge variant="success" size="xs">Active</AdminBadge>}
          >
            <div className="space-y-3 text-xs">
              <p className="text-neutral-300">Customers pay cash upon parcel handover at their doorstep.</p>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] space-y-1">
                <div>Collection Fee: <strong className="text-white">0% (Handled by Courier)</strong></div>
                <div>Status: <span className="text-emerald-400 font-bold">Enabled</span></div>
              </div>
            </div>
          </AdminCard>

        </div>
      )}

    </div>
  );
};
