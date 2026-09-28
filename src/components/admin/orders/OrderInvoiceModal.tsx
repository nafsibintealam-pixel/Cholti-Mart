import React from 'react';
import { Printer, X, Download, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { Order } from '../../../types';
import { AdminModal, AdminButton } from '../common/AdminUiElements';
import { useCustomizer } from '../../../context/CustomizerContext';

export interface OrderInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const { config } = useCustomizer();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const deliveryCharge = typeof order.deliveryCharge === 'number' ? order.deliveryCharge : (order.shippingFee || 70);
  const discount = order.discount || 0;
  const subtotal = order.subtotal || order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = order.total || (subtotal + deliveryCharge - discount);

  const normalizeAddress = (
    addr: string | any, 
    fallbackName = '', 
    fallbackPhone = '', 
    fallbackEmail = '', 
    fallbackStreet = '', 
    fallbackCity = ''
  ) => {
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
    order.shippingAddress || order.billingAddress,
    order.customerName,
    order.phone,
    order.email,
    order.address,
    order.district || (order as any).city || 'Dhaka'
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Commercial Invoice #${order.id}`}
      subtitle={`Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-neutral-400">Official invoice format for Cholti Mart fulfillment</span>
          <div className="flex items-center gap-2">
            <AdminButton variant="outline" size="sm" onClick={onClose}>
              Close
            </AdminButton>
            <AdminButton 
              variant="lime" 
              size="sm" 
              icon={<Printer className="w-4 h-4" />} 
              onClick={handlePrint}
            >
              Print Invoice
            </AdminButton>
          </div>
        </div>
      }
    >
      <div className="bg-white text-neutral-900 p-8 rounded-2xl space-y-6 font-sans text-xs print:p-0 print:text-black">
        
        {/* Header Branding */}
        <div className="flex items-start justify-between border-b border-neutral-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#2D5128] tracking-tight">
                {config.siteSettings.storeName || 'CHOLTI MART'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Verified Vendor
              </span>
            </div>
            <p className="text-neutral-600 font-medium">National E-Commerce Logistics & Fulfillment</p>
            <p className="text-[11px] text-neutral-500 font-mono">
              Trade License: TRAD/DSCC/029182/2026 &bull; BIN: 002918294-0101
            </p>
            <p className="text-[11px] text-neutral-500">
              Hotline: +880 9612-445566 &bull; Email: orders@choltimart.com
            </p>
          </div>

          <div className="text-right space-y-1">
            <h2 className="text-lg font-black text-neutral-900 tracking-wider">TAX INVOICE</h2>
            <div className="font-mono text-sm font-bold text-[#2D5128]">#{order.id}</div>
            <div className="text-[11px] text-neutral-600">Order Date: <strong>{order.date}</strong></div>
            <div className="text-[11px] text-neutral-600">Payment: <strong className="uppercase">{order.paymentMethod}</strong></div>
            <div className="text-[11px]">
              Payment Status: 
              <span className={`ml-1 font-bold ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {(order.paymentStatus || 'unpaid').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider block">
              Billed To (Customer)
            </span>
            <div className="font-bold text-neutral-900 text-sm">{billing.fullName || order.customerName}</div>
            <div className="flex items-center gap-1 text-neutral-600 font-mono">
              <Phone className="w-3 h-3 text-neutral-400" />
              <span>{billing.phone || order.phone}</span>
            </div>
            {billing.email && (
              <div className="flex items-center gap-1 text-neutral-600">
                <Mail className="w-3 h-3 text-neutral-400" />
                <span>{billing.email}</span>
              </div>
            )}
            <div className="text-neutral-600 leading-relaxed pt-1">
              {billing.street || order.address}
              {billing.area ? `, ${billing.area}` : ''}
              {billing.district ? `, ${billing.district}` : ''}
              {billing.postalCode ? ` - ${billing.postalCode}` : ''}, Bangladesh.
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider block">
              Shipping & Courier Info
            </span>
            <div className="font-bold text-neutral-900 text-sm">{shipping.fullName || order.customerName}</div>
            <div className="text-neutral-600 leading-relaxed">
              {shipping.street || order.address}
              {shipping.area ? `, ${shipping.area}` : ''}
              {shipping.district ? `, ${shipping.district}` : ''}, Bangladesh.
            </div>
            <div className="pt-1.5 border-t border-neutral-200 text-[11px] text-neutral-700">
              Courier: <strong>{order.courierPartner || order.courier || 'Steadfast Courier'}</strong>
            </div>
            {(order.courierTrackingCode || order.trackingNumber) && (
              <div className="text-[11px] text-neutral-700 font-mono">
                Tracking: <strong>{order.courierTrackingCode || order.trackingNumber}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Customer Instruction Note if available */}
        {order.notes && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-[11px]">
            <strong>Customer Delivery Notes:</strong> {order.notes}
          </div>
        )}

        {/* Line Items Table */}
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100 text-neutral-700 text-[10px] uppercase font-bold border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-4">#</th>
                <th className="py-2.5 px-4">Product Details</th>
                <th className="py-2.5 px-4 font-mono">SKU</th>
                <th className="py-2.5 px-4 text-right">Unit Price</th>
                <th className="py-2.5 px-4 text-center">Qty</th>
                <th className="py-2.5 px-4 text-right">Total (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-800">
              {order.items.map((item, index) => {
                const itemSubtotal = item.subtotal || (item.price * item.quantity);
                return (
                  <tr key={index}>
                    <td className="py-3 px-4 font-mono text-neutral-400">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900">{item.productName}</div>
                      {item.variant && (
                        <div className="text-[10px] text-neutral-500 font-medium">Variant: {item.variant}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">
                      {item.sku || `CM-SKU-${index + 1}`}
                    </td>
                    <td className="py-3 px-4 font-mono text-right">
                      ৳{item.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-center font-bold">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-right text-neutral-900">
                      ৳{itemSubtotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pricing Math Summary */}
        <div className="flex justify-end pt-2">
          <div className="w-72 space-y-1.5 font-mono text-xs text-right">
            <div className="flex justify-between text-neutral-600">
              <span>Items Subtotal:</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Charge:</span>
              <span>৳{deliveryCharge.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount Applied:</span>
                <span>-৳{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-neutral-900 border-t-2 border-neutral-800 pt-2">
              <span>Grand Total:</span>
              <span>৳{total.toLocaleString()} BDT</span>
            </div>
            <div className="text-[10px] text-neutral-500 pt-1 font-sans">
              (All local taxes & duties included)
            </div>
          </div>
        </div>

        {/* Footer & Signature */}
        <div className="pt-8 border-t border-neutral-200 flex items-end justify-between text-[11px] text-neutral-500">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine Certified Goods</span>
            </div>
            <p>7-Day Easy Return Policy nationwide in Bangladesh.</p>
            <p>Generated by Cholti Mart Automated Commerce Engine.</p>
          </div>

          <div className="text-center space-y-1">
            <div className="w-40 border-b border-neutral-400 pb-8 font-serif text-neutral-400 italic">
              Authorized Signature
            </div>
            <div className="text-[10px] font-bold text-neutral-700 uppercase">Cholti Mart Logistics</div>
          </div>
        </div>

      </div>
    </AdminModal>
  );
};
