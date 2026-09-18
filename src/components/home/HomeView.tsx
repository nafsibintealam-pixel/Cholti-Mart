import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { CategorySection } from './sections/CategorySection';
import { FeaturedProductsSection } from './sections/FeaturedProductsSection';
import { OffersBannerSection } from './sections/OffersBannerSection';
import { DualShowcaseSection } from './sections/DualShowcaseSection';
import { TrustSection } from './sections/TrustSection';
import { PromoCategorySection } from './sections/PromoCategorySection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { FaqSection } from './sections/FaqSection';
import { NewsletterSection } from './sections/NewsletterSection';
import { CtaSection } from './sections/CtaSection';
import { useCustomizer } from '../../context/CustomizerContext';

/**
 * CHOLTI MART — MODULAR HOMEPAGE COMPOSITION
 * ==========================================================
 * Each section is encapsulated as an independent, reusable component.
 * Section visibility is controlled in real-time via the Site Customizer.
 */
export const HomeView: React.FC = () => {
  const { config } = useCustomizer();
  const { sectionsVisibility } = config;

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero & Value Proposition Banner */}
      {sectionsVisibility.hero && <HeroSection />}

      {/* 2. Shop by Category Grid */}
      {sectionsVisibility.categories && <CategorySection />}

      {/* 3. Featured & Handpicked Products */}
      {sectionsVisibility.featuredProducts && <FeaturedProductsSection />}

      {/* 4. Promotional Campaign Deals & Coupons */}
      {sectionsVisibility.offersBanner && <OffersBannerSection />}

      {/* 5. Fresh Arrivals & Trending Showcase */}
      {sectionsVisibility.dualShowcase && <DualShowcaseSection />}

      {/* 6. Why Shop With Cholti Mart - Trust Pillars */}
      {sectionsVisibility.trustSection && <TrustSection />}

      {/* 7. Category Focus: Adornments & Desk Tech */}
      {sectionsVisibility.promoCategory && <PromoCategorySection />}

      {/* 8. Verified Customer Testimonials */}
      {sectionsVisibility.testimonials && <TestimonialsSection />}

      {/* 9. Interactive FAQ Accordion */}
      {sectionsVisibility.faq && <FaqSection />}

      {/* 10. Newsletter & Discount Voucher Subscription */}
      {sectionsVisibility.newsletter && <NewsletterSection />}

      {/* 11. Final Call-to-Action */}
      {sectionsVisibility.ctaSection && <CtaSection />}
    </div>
  );
};
