import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Code2, AlertCircle, Info, Database } from 'lucide-react';
import { Order } from '../../../types';
import { AdminModal, AdminButton, AdminBadge } from '../common/AdminUiElements';
import { orderService } from '../../../services';

export interface WooCommerceOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WooCommerceOrderModal: React.FC<WooCommerceOrderModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const wcPayload = orderService.toWooCommerceOrderPayload(order);
  const jsonString = JSON.stringify(wcPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="WooCommerce REST API v3 Integration"
      subtitle={`REST payload mapped for Order #${order.id}`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <AdminBadge variant="neutral" size="xs">
              MOCK DATA LAYER
            </AdminBadge>
            <span className="text-[11px] text-neutral-400">Ready for WooCommerce REST API binding</span>
          </div>
          <div className="flex items-center gap-2">
            <AdminButton
              variant="secondary"
              size="sm"
              icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied to Clipboard' : 'Copy JSON Payload'}
            </AdminButton>
            <AdminButton variant="outline" size="sm" onClick={onClose}>
              Done
            </AdminButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Architecture & Clear Separation Notice */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-amber-300">WooCommerce REST API Data Layer Prepared</h5>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              This payload conforms exactly to the <code>POST /wp-json/wc/v3/orders</code> schema. In accordance with platform standards,
              mock data is strictly separated from backend synchronization. Once the WooCommerce Consumer Key and Consumer Secret are configured
              in Settings &gt; Integrations, this serialized payload will be dispatched to your live WordPress instance.
            </p>
          </div>
        </div>

        {/* API Endpoint Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Target Endpoint</span>
            <div className="font-mono text-emerald-400 font-medium">/wp-json/wc/v3/orders</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">HTTP Method</span>
            <div className="font-mono text-blue-400 font-bold">POST (or PUT for updates)</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Sync State</span>
            <div className="font-mono text-amber-400 font-medium">Mock Layer (Awaiting Keys)</div>
          </div>
        </div>

        {/* JSON Payload Inspector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-[#E4EB9C]" />
              Serialized Order Payload (JSON)
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              Schema: WooCommerce v3 Orders
            </span>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
            <pre className="p-4 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-80 leading-relaxed">
              {jsonString}
            </pre>
          </div>
        </div>
      </div>
    </AdminModal>
  );
};
