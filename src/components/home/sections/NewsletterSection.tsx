import React, { useState } from 'react';
import { Mail, Check, Bell } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section className="py-12 sm:py-16 bg-neutral-50/70 border-b border-neutral-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs text-center space-y-4">
          
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Get Notified on New Drops & Exclusive Flash Sales
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto mt-1">
              Join our subscriber list for secret coupons, newly restocked gadgets, and seasonal discounts. No spam, ever.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>
            <button
              type="submit"
              disabled={submitted}
              className="px-6 py-3 bg-[#0B6B3A] hover:bg-[#07502B] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-2xs shrink-0 flex items-center justify-center gap-1.5"
            >
              {submitted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </form>

          <span className="text-[11px] text-neutral-400 block">
            Instant ৳100 discount coupon sent right after subscribing.
          </span>

        </div>
      </div>
    </section>
  );
};
