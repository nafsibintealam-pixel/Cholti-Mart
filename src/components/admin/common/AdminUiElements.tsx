import React, { useState } from 'react';
import { 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Printer, 
  AlertTriangle, 
  Check, 
  Loader2,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';

// ==========================================
// 1. ADMIN BADGE
// ==========================================
export interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral' | 'lime';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'xs',
  dot = false,
  className = ''
}) => {
  const variantStyles = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-400 border-red-500/30',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    neutral: 'bg-neutral-800 text-neutral-300 border-neutral-700',
    lime: 'bg-[#E4EB9C]/15 text-[#E4EB9C] border-[#8DA750]/40'
  };

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wider uppercase',
    sm: 'text-xs px-2.5 py-1 rounded-lg font-medium',
    md: 'text-sm px-3 py-1 rounded-xl font-medium'
  };

  const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    purple: 'bg-purple-400',
    neutral: 'bg-neutral-400',
    lime: 'bg-[#E4EB9C]'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0 animate-pulse`} />}
      {children}
    </span>
  );
};

// ==========================================
// 2. ADMIN CARD
// ==========================================
export interface AdminCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  noPadding = false
}) => {
  return (
    <div className={`bg-neutral-900/95 border border-neutral-800/80 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
    </div>
  );
};

// ==========================================
// 3. ADMIN BUTTON
// ==========================================
export interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'lime';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[#2D5128] hover:bg-[#537B2F] text-[#E4EB9C] font-bold border border-[#8DA750]/40 shadow-sm',
    lime: 'bg-[#E4EB9C] hover:bg-[#d5dc8b] text-[#142C14] font-bold shadow-md',
    secondary: 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700',
    outline: 'bg-transparent hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700',
    danger: 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30',
    ghost: 'bg-transparent hover:bg-neutral-800/60 text-neutral-400 hover:text-white'
  };

  const sizeStyles = {
    xs: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
    sm: 'text-xs px-3.5 py-2 rounded-xl gap-2 font-medium',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2.5 font-medium',
    lg: 'text-base px-6 py-3 rounded-2xl gap-3 font-semibold'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

// ==========================================
// 4. ADMIN SEARCH INPUT
// ==========================================
export interface AdminSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const AdminSearchInput: React.FC<AdminSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8DA750] focus:ring-1 focus:ring-[#8DA750] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

// ==========================================
// 5. ADMIN PAGINATION
// ==========================================
export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = totalItems !== undefined ? Math.min(currentPage * itemsPerPage, totalItems) : (currentPage * itemsPerPage);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-neutral-800 text-xs text-neutral-400">
      <div>
        {totalItems !== undefined ? (
          <>
            Showing <span className="text-white font-medium">{startIdx}</span> to{' '}
            <span className="text-white font-medium">{endIdx}</span> of{' '}
            <span className="text-white font-medium">{totalItems}</span> entries
          </>
        ) : (
          <>
            Page <span className="text-white font-medium">{currentPage}</span> of{' '}
            <span className="text-white font-medium">{totalPages}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 text-neutral-300 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
          Math.max(0, currentPage - 3),
          Math.min(totalPages, currentPage + 2)
        ).map((pg) => (
          <button
            key={pg}
            onClick={() => onPageChange(pg)}
            className={`w-7 h-7 rounded-lg text-xs font-medium ${
              pg === currentPage
                ? 'bg-[#2D5128] text-[#E4EB9C] border border-[#8DA750]/40'
                : 'border border-neutral-800 hover:bg-neutral-800 text-neutral-300'
            }`}
          >
            {pg}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 text-neutral-300 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 6. ADMIN MODAL
// ==========================================
export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'lg'
}) => {
  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full ${maxWidthStyles[maxWidth]} bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div>
            <div className="text-base font-bold text-white tracking-tight">{title}</div>
            {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-950/50 flex items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 7. CONFIRMATION DIALOG
// ==========================================
export interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  variant?: 'danger' | 'warning' | 'primary' | string;
}

export const AdminConfirmDialog: React.FC<AdminConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  confirmText,
  cancelLabel = 'Cancel',
  isDanger = false,
  variant
}) => {
  if (!isOpen) return null;

  const resolvedConfirmLabel = confirmText || confirmLabel || 'Confirm';
  const resolvedIsDanger = isDanger || variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${resolvedIsDanger ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <AdminButton variant="outline" size="sm" onClick={onClose}>
            {cancelLabel}
          </AdminButton>
          <AdminButton
            variant={resolvedIsDanger ? 'danger' : 'primary'}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {resolvedConfirmLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. EMPTY STATE
// ==========================================
export interface AdminEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-3">
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 text-neutral-400 flex items-center justify-center mb-1">
          {icon}
        </div>
      )}
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-neutral-400 leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

// ==========================================
// 9. LOADING SKELETON
// ==========================================
export const AdminLoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-neutral-800 rounded w-1/3" />
            <div className="h-2.5 bg-neutral-800/60 rounded w-2/3" />
          </div>
          <div className="w-16 h-6 bg-neutral-800 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 10. EXPORT BUTTON
// ==========================================
export interface AdminExportButtonProps {
  onExportCsv?: () => void;
  onExportJson?: () => void;
  onPrint?: () => void;
  label?: string;
}

export const AdminExportButton: React.FC<AdminExportButtonProps> = ({
  onExportCsv,
  onExportJson,
  onPrint,
  label = 'Export'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <AdminButton
        variant="outline"
        size="sm"
        icon={<Download className="w-3.5 h-3.5" />}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </AdminButton>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-1 z-30 space-y-0.5 text-xs">
            {onExportCsv && (
              <button
                onClick={() => {
                  onExportCsv();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-lg text-left text-neutral-200 hover:bg-neutral-800 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            )}
            {onExportJson && (
              <button
                onClick={() => {
                  onExportJson();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-lg text-left text-neutral-200 hover:bg-neutral-800 flex items-center gap-2"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>Export JSON</span>
              </button>
            )}
            {onPrint && (
              <button
                onClick={() => {
                  onPrint();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-lg text-left text-neutral-200 hover:bg-neutral-800 flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print / PDF View</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
