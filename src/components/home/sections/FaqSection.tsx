import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { FAQS_DATA } from '../../../data/faqs';
import { useShop } from '../../../context/ShopContext';

export const FaqSection: React.FC = () => {
  const { navigateTo } = useShop();
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  // Display first 5 FAQs on homepage
  const displayFaqs = FAQS_DATA.slice(0, 5);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-800 uppercase mb-1">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Quick answers regarding delivery timelines, Cash on Delivery, and returns.
          </p>
        </div>

        <div className="space-y-3">
          {displayFaqs.map(faq => (
            <div
              key={faq.id}
              className="bg-neutral-50/70 rounded-2xl border border-neutral-200/80 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaqId(openFaqId === faq.id ? '' : faq.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-xs sm:text-sm font-bold text-neutral-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                    openFaqId === faq.id ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>

              {openFaqId === faq.id && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 border-t border-neutral-200/50 leading-relaxed bg-white/70">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigateTo('faq')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>View All FAQs & Support Guidelines</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
