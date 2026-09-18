import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';
import { TRUST_ITEMS } from '../../../data/siteContent';

export const TrustSection: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-emerald-600" />;
      case 'RefreshCw':
        return <RefreshCw className="w-6 h-6 text-emerald-600" />;
      case 'Headphones':
      default:
        return <Headphones className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-neutral-50/70 border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
            Safe & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
            Why Shop with Cholti Mart?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            We operate with strict quality standards to bring you reliable online shopping in Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_ITEMS.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                {getIcon(item.iconName)}
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
