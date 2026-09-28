import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  User, 
  Code2, 
  Package, 
  ArrowRight,
  ShieldCheck,
  Send,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  Order, 
  OrderStatus, 
  DeliveryStatus, 
  PaymentStatus, 
  OrderAdminNote, 
  OrderTimelineEvent,
  OrderAddress
} from '../../../types';
import { 
  AdminBadge, 
  AdminButton, 
  AdminCard, 
  AdminModal 
} from '../common/AdminUiElements';
import { OrderConfirmationModal } from './OrderConfirmationModal';

export interface OrderDetailsDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrderStatus: (
    orderId: string, 
    status: OrderStatus, 
    trackingNumber?: string,
    courierPartner?: string,
    deliveryStatus?: DeliveryStatus,
    note?: string
  ) => void;
  onAddAdminNote?: (orderId: string, text: string) => void;
  onOpenInvoice: () => void;
  onOpenWooCommerce: () => void;
}

const ALL_ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Returned',
  'Refunded'
];

const COURIER_OPTIONS = [
  'Steadfast Courier',
  'Pathao Courier',
  'RedX',
  'Paperfly',
  'Sundarban'
];

const DELIVERY_STATUS_OPTIONS: { id: DeliveryStatus; label: string }[] = [
  { id: 'pending', label: 'Pending Dispatch' },
  { id: 'processing', label: 'Processing at Hub' },
  { id: 'dispatched', label: 'Dispatched to Courier' },
  { id: 'in_transit', label: 'In Transit' },
  { id: 'out_for_delivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'returned', label: 'Returned to Warehouse' },
  { id: 'failed', label: 'Failed Delivery' }
];

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateOrderStatus,
  onAddAdminNote,
  onOpenInvoice,
  onOpenWooCommerce
}) => {
  if (!order || !isOpen) return null;

  // Local state for interactive editing
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [selectedCourier, setSelectedCourier] = useState<string>(order.courierPartner || order.courier || 'Steadfast Courier');
  const [trackingNumber, setTrackingNumber] = useState<string>(order.courierTrackingCode || order.trackingNumber || '');
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(order.deliveryStatus || 'pending');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus || 'unpaid');
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Confirmation modal state for sensitive statuses (Cancelled, Refunded, Returned)
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    pendingStatus: OrderStatus | null;
    title: string;
    description: string;
    variant: 'danger' | 'warning' | 'primary';
  }>({
    isOpen: false,
    pendingStatus: null,
    title: '',
    description: '',
    variant: 'warning'
  });

  const normalizeAddress = (
    addr: string | OrderAddress | undefined, 
    fallbackName = '', 
    fallbackPhone = '', 
    fallbackEmail = '', 
    fallbackStreet = '', 
    fallbackCity = ''
  ): OrderAddress => {
    if (!addr) {
      return {
        fullName: fallbackName,
        phone: fallbackPhone,
        email: fallbackEmail,
        street: fallbackStreet,
        area: '',
        district: fallbackCity,
        postalCode: '1200',
        country: 'Bangladesh'
      };
    }
    if (typeof addr === 'string') {
      return {
        fullName: fallbackName,
        phone: fallbackPhone,
        email: fallbackEmail,
        street: addr,
        area: '',
        district: fallbackCity,
        postalCode: '1200',
        country: 'Bangladesh'
      };
    }
    return {
      fullName: addr.fullName || fallbackName,
      phone: addr.phone || fallbackPhone,
      email: addr.email || fallbackEmail,
      street: addr.street || fallbackStreet,
      area: addr.area || '',
      district: addr.district || fallbackCity,
      postalCode: addr.postalCode || '1200',
      country: addr.country || 'Bangladesh'
    };
  };

  const billing = normalizeAddress(
    order.billingAddress,
    order.customerName,
    order.phone,
    order.email,
    order.address,
    order.district || (order as any).city || 'Dhaka'
  );

  const shipping = normalizeAddress(
    order.shippingAddress,
    order.customerName,
    order.phone,
    order.email,
    order.address,
    order.district || (order as any).city || 'Dhaka'
  );

  const deliveryCharge = typeof order.deliveryCharge === 'number' ? order.deliveryCharge : (order.shippingFee || 70);
  const discount = order.discount || 0;
  const subtotal = order.subtotal || order.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const total = order.total || (subtotal + deliveryCharge - discount);

  const statusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Shipped': return 'purple';
      case 'Confirmed':
      case 'Processing': return 'info';
      case 'Cancelled':
      case 'Refunded':
      case 'Returned': return 'danger';
      case 'Pending':
      default: return 'warning';
    }
  };

  const paymentBadgeVariant = (pStatus: PaymentStatus) => {
    switch (pStatus) {
      case 'paid': return 'success';
      case 'refunded':
      case 'partially_refunded': return 'danger';
      case 'unpaid':
      default: return 'warning';
    }
  };

  const handleStatusButtonClick = (targetStatus: OrderStatus) => {
    if (targetStatus === order.status) return;

    if (['Cancelled', 'Refunded', 'Returned'].includes(targetStatus)) {
      setConfirmModalState({
        isOpen: true,
        pendingStatus: targetStatus,
        title: `Confirm Order ${targetStatus}`,
        description: `Are you sure you want to mark Order #${order.id} as ${targetStatus}? This will trigger inventory and accounting adjustments.`,
        variant: targetStatus === 'Refunded' || targetStatus === 'Cancelled' ? 'danger' : 'warning'
      });
    } else {
      applyStatusUpdate(targetStatus);
    }
  };

  const applyStatusUpdate = (targetStatus: OrderStatus) => {
    setSelectedStatus(targetStatus);
    onUpdateOrderStatus(
      order.id, 
      targetStatus, 
      trackingNumber, 
      selectedCourier, 
      deliveryStatus
    );
  };

  const handleSaveLogistics = () => {
    onUpdateOrderStatus(
      order.id,
      selectedStatus,
      trackingNumber,
      selectedCourier,
      deliveryStatus
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsSubmittingNote(true);
    if (onAddAdminNote) {
      onAddAdminNote(order.id, newNoteText.trim());
    } else {
      onUpdateOrderStatus(
        order.id,
        selectedStatus,
        trackingNumber,
        selectedCourier,
        deliveryStatus,
        newNoteText.trim()
      );
    }
    setNewNoteText('');
    setIsSubmittingNote(false);
  };

  return (
    <>
      <AdminModal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-base font-black text-white">Order #{order.id}</span>
            <AdminBadge variant={statusBadgeVariant(order.status)} size="xs">
              {order.status}
            </AdminBadge>
            <AdminBadge variant={paymentBadgeVariant(order.paymentStatus || 'unpaid')} size="xs">
              Payment: {order.paymentStatus || 'unpaid'}
            </AdminBadge>
            {order.wooCommerceOrderId && (
              <AdminBadge variant="purple" size="xs">
                WC #{order.wooCommerceOrderId}
              </AdminBadge>
            )}
          </div>
        }
        subtitle={`Created: ${order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB') : order.date} • Last Updated: ${order.updatedAt ? new Date(order.updatedAt).toLocaleString('en-GB') : order.date}`}
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <AdminButton
                variant="outline"
                size="sm"
                icon={<Code2 className="w-3.5 h-3.5 text-purple-400" />}
                onClick={onOpenWooCommerce}
              >
                WooCommerce API Payload
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                icon={<Printer className="w-3.5 h-3.5 text-amber-400" />}
                onClick={onOpenInvoice}
              >
                Print Invoice
              </AdminButton>
            </div>
            <div className="flex items-center gap-2">
              <AdminButton variant="secondary" size="sm" onClick={onClose}>
                Close
              </AdminButton>
            </div>
          </div>
        }
      >
        <div className="space-y-6 text-xs text-neutral-300">

          {/* Section 1: Order Lifecycle Status Stepper */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-[#E4EB9C]" />
                Order Status Pipeline
              </span>
              <span className="text-[11px] text-neutral-400">
                Click any status to update immediately
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
              {ALL_ORDER_STATUSES.map((st) => {
                const isCurrent = order.status.toLowerCase() === st.toLowerCase();
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusButtonClick(st)}
                    className={`px-2.5 py-2 rounded-xl text-center font-bold text-[11px] transition-all border ${
                      isCurrent
                        ? 'bg-[#2D5128] text-[#E4EB9C] border-[#8DA750]/60 shadow-lg shadow-[#2D5128]/20'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Courier & Delivery Dispatch Settings */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#E4EB9C]" />
                Logistics & Courier Assignment
              </span>
              <AdminButton
                variant="primary"
                size="xs"
                onClick={handleSaveLogistics}
              >
                Save Dispatch Info
              </AdminButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Courier Partner */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Courier Partner</label>
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
                >
                  {COURIER_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Tracking Number */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Tracking Code / Consignment ID</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. STDF-881923"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#8DA750]"
                />
              </div>

              {/* Delivery Status */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Delivery Status</label>
                <select
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value as DeliveryStatus)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
                >
                  {DELIVERY_STATUS_OPTIONS.map((ds) => (
                    <option key={ds.id} value={ds.id}>{ds.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Customer & Address Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Billing Address Card */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#E4EB9C]" />
                  Billing Address & Customer Details
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Cust ID: {order.customerId || 'c-guest'}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-sm font-bold text-white">{billing.fullName || order.customerName}</div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-mono text-emerald-400">{billing.phone || order.phone}</span>
                </div>
                {billing.email && (
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{billing.email}</span>
                  </div>
                )}
                <div className="flex items-start gap-2 text-neutral-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  <span>
                    {billing.street || order.address}
                    {billing.area ? `, ${billing.area}` : ''}
                    {billing.district ? `, ${billing.district}` : ''}
                    {billing.postalCode ? ` - ${billing.postalCode}` : ''}, {billing.country || 'Bangladesh'}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#E4EB9C]" />
                  Shipping Destination
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {order.district || shipping.district || 'Dhaka'} Zone
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-sm font-bold text-white">{shipping.fullName || order.customerName}</div>
                <div className="flex items-start gap-2 text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-[#E4EB9C] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {shipping.street || order.address}
                    {shipping.area ? `, ${shipping.area}` : ''}
                    {shipping.district ? `, ${shipping.district}` : ''}
                    {shipping.postalCode ? ` - ${shipping.postalCode}` : ''}, {shipping.country || 'Bangladesh'}
                  </span>
                </div>
                {order.notes && (
                  <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                    <strong>Delivery Instructions:</strong> {order.notes}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Products & Line Items Table */}
          <div className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-950">
            <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-[#E4EB9C]" />
                Purchased Products ({order.items.length} unique items &bull; {order.itemCount || order.items.reduce((a, b) => a + b.quantity, 0)} total pcs)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/80 text-neutral-400 text-[10px] uppercase font-bold border-b border-neutral-800">
                  <tr>
                    <th className="px-4 py-2.5">Product</th>
                    <th className="px-4 py-2.5 font-mono">SKU</th>
                    <th className="px-4 py-2.5 text-right">Price</th>
                    <th className="px-4 py-2.5 text-center">Qty</th>
                    <th className="px-4 py-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                  {order.items.map((item, i) => (
                    <tr key={i} className="hover:bg-neutral-900/40">
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&auto=format&fit=crop&q=80'} 
                          alt={item.productName} 
                          className="w-10 h-10 rounded-xl object-cover bg-neutral-800 border border-neutral-700/60 shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{item.productName}</div>
                          {item.variant && (
                            <span className="text-[10px] text-neutral-400 font-medium">Variant: {item.variant}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-neutral-400">
                        {item.sku || `CM-SKU-${i + 1}`}
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-neutral-300">
                        ৳{item.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-center font-bold text-white">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-right text-white">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Calculation Bar */}
            <div className="p-4 bg-neutral-900/90 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-neutral-400">Payment:</span>
                <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-neutral-800">
                  {order.paymentMethod}
                </span>
                <AdminBadge variant={paymentBadgeVariant(order.paymentStatus || 'unpaid')} size="xs">
                  {order.paymentStatus || 'unpaid'}
                </AdminBadge>
              </div>

              <div className="space-y-1 text-right font-mono text-xs w-full sm:w-64">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span className="text-white">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Charge:</span>
                  <span className="text-white">৳{deliveryCharge.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span>-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#E4EB9C] border-t border-neutral-800 pt-1">
                  <span>Grand Total:</span>
                  <span>৳{total.toLocaleString()} BDT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Admin Notes & Activity Timeline Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Admin Notes Box */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#E4EB9C]" />
                    Internal Admin Notes ({order.adminNotes?.length || 0})
                  </span>
                  <span className="text-[10px] text-neutral-400">Private staff notes</span>
                </div>

                {/* Existing Notes List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {order.adminNotes && order.adminNotes.length > 0 ? (
                    order.adminNotes.map((note) => (
                      <div key={note.id} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] space-y-1">
                        <p className="text-neutral-200">{note.text}</p>
                        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-1 border-t border-neutral-800/60">
                          <span>{note.author}</span>
                          <span>{note.createdAt}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-neutral-400 text-[11px]">
                      No admin notes recorded for this order yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="pt-2 border-t border-neutral-800 space-y-2">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add internal note regarding call verification, packaging, or courier handoff..."
                  rows={2}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750] resize-none"
                />
                <div className="flex justify-end">
                  <AdminButton
                    type="submit"
                    variant="lime"
                    size="xs"
                    icon={<Send className="w-3 h-3" />}
                    loading={isSubmittingNote}
                    disabled={!newNoteText.trim()}
                  >
                    Post Note
                  </AdminButton>
                </div>
              </form>
            </div>

            {/* Order Timeline */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E4EB9C]" />
                  Activity Timeline ({order.timeline?.length || 0})
                </span>
                <span className="text-[10px] text-neutral-400">Chronological audit trace</span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {order.timeline && order.timeline.length > 0 ? (
                  order.timeline.map((event, idx) => (
                    <div key={event.id || idx} className="flex items-start gap-3 text-xs">
                      <div className="mt-1 w-2 h-2 rounded-full bg-[#8DA750] shrink-0" />
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-[11px]">{event.title}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">{event.timestamp}</span>
                        </div>
                        <p className="text-neutral-400 text-[11px]">{event.description}</p>
                        {event.user && (
                          <span className="text-[10px] text-neutral-500 font-mono block">By: {event.user}</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-neutral-400 text-[11px]">
                    No activity timeline recorded yet.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </AdminModal>

      {/* Confirmation Dialog for Destructive / Sensitive Statuses */}
      <OrderConfirmationModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (confirmModalState.pendingStatus) {
            applyStatusUpdate(confirmModalState.pendingStatus);
          }
          setConfirmModalState(prev => ({ ...prev, isOpen: false }));
        }}
        title={confirmModalState.title}
        description={confirmModalState.description}
        variant={confirmModalState.variant}
        confirmLabel="Yes, Update Status"
      />
    </>
  );
};
