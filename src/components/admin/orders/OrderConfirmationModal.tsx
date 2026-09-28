import React from 'react';
import { AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';
import { AdminModal, AdminButton } from '../common/AdminUiElements';

export interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'warning',
  loading = false
}) => {
  const iconMap = {
    danger: <AlertCircle className="w-6 h-6 text-red-400" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-400" />,
    primary: <Info className="w-6 h-6 text-[#E4EB9C]" />
  };

  const buttonVariant = variant === 'danger' ? 'danger' : variant === 'primary' ? 'lime' : 'primary';

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </AdminButton>
          <AdminButton
            variant={buttonVariant}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </AdminButton>
        </div>
      }
    >
      <div className="flex items-start gap-4 p-2">
        <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shrink-0">
          {iconMap[variant]}
        </div>
        <div className="space-y-1.5 text-xs text-neutral-300">
          <p className="font-medium text-white text-sm">{title}</p>
          <p className="text-neutral-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </AdminModal>
  );
};
