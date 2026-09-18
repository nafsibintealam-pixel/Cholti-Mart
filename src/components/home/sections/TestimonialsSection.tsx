import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../../../data/siteContent';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-neutral-50/50 border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
            Real Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
            Customer Feedback
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Read what shoppers from Dhaka, Chittagong, and across Bangladesh say about us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 italic leading-relaxed">
                  {item.comment}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">{item.name}</span>
                  <span className="text-[11px] text-neutral-400 block">{item.role}</span>
                </div>
                {item.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Order</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
