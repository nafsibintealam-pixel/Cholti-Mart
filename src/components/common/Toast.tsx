import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Toast: React.FC = () => {
  const { toast } = useShop();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="bg-neutral-900/95 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 max-w-sm border border-neutral-700 backdrop-blur-sm">
        {icons[toast.type]}
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
