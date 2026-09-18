/**
 * CHOLTI MART — CENTRAL BRAND & THEME CONFIGURATION SYSTEM
 * ==========================================================
 * This file is the single, centralized source of truth for:
 * 1. The Official 5-Color Brand Palette:
 *    - Dark Green:      #142C14 (Primary brand elements, primary buttons, header accents, footer)
 *    - Cal Poly Green:  #2D5128 (Secondary buttons, navigation highlights, supporting areas)
 *    - Fern Green:      #537B2F (Accent CTAs, product badges, active states, highlights)
 *    - Asparagus:       #8DA750 (Secondary accents, borders, subtle tags, card accents)
 *    - Mindaro:         #E4EB9C (Soft background sections, promotional highlights, badge tints)
 * 2. Typography System (Heading, Body, Button, Nav, Bangla)
 * 3. Spacing, Geometric Radii, Shadows, and Button Styles
 *
 * Any update here cascades across the entire website via CSS variables!
 */

export const BRAND_PALETTE = {
  darkGreen: '#142C14',     // Primary
  calPolyGreen: '#2D5128',  // Secondary
  fernGreen: '#537B2F',     // Accent
  asparagus: '#8DA750',     // Supporting
  mindaro: '#E4EB9C',       // Light Accent
} as const;

export interface ThemeConfig {
  branding: {
    storeName: string;
    tagline: string;
    logoAlt: string;
    currencySymbol: string;
    currencyCode: string;
    supportPhone: string;
    supportEmail: string;
  };
  colors: {
    // 1. Official 5-Color System
    primary: string;         // #142C14 - Dark Green (Primary buttons, key headings, brand anchors)
    primaryHover: string;    // Deeper shade on hover (#0B1B0B)
    primaryLight: string;    // #E4EB9C - Mindaro soft tint for badges & subtle highlights
    secondary: string;       // #2D5128 - Cal Poly Green (Secondary buttons, nav items)
    secondaryHover: string;  // Darker shade (#203A1C)
    accent: string;          // #537B2F - Fern Green (CTA elements, active states, key badges)
    accentHover: string;     // #426325
    supporting: string;      // #8DA750 - Asparagus (Secondary accents, decorative badges, card accents)
    lightAccent: string;     // #E4EB9C - Mindaro (Soft background sections, hero highlights)

    // 2. Layout & Surfaces
    background: string;      // Body canvas background
    surface: string;         // Card, modal, and drawer white surface
    headerBg: string;        // Header navigation bar background
    footerBg: string;        // Footer background (#142C14)

    // 3. Text Hierarchy
    textPrimary: string;     // Headings, titles, heavy text (#0F172A)
    textSecondary: string;   // Body descriptions, meta text (#475569)
    textMuted: string;       // Placeholder, timestamp, subtle breadcrumbs (#94A3B8)
    textInverse: string;     // Text on dark backgrounds (#FFFFFF)

    // 4. Borders & Dividers
    border: string;          // Standard card & input border (#E2E8F0)
    borderLight: string;     // Very subtle dividers (#F1F5F9)
    borderAccent: string;    // #8DA750 / #537B2F

    // 5. Button Tokens
    btnPrimaryBg: string;
    btnPrimaryText: string;
    btnPrimaryHover: string;
    btnSecondaryBg: string;
    btnSecondaryText: string;
    btnSecondaryHover: string;

    // 6. Feedback & Status Colors
    success: string;
    warning: string;
    error: string;
    info: string;
  };

  typography: {
    fontFamilyPrimary: string;
    fontFamilyHeading: string;
    fontFamilyBody: string;
    fontFamilyButton: string;
    fontFamilyNav: string;
    fontFamilyBangla: string;

    baseFontSize: string;
    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    fontWeights: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
    };
    lineHeights: {
      tight: string;
      normal: string;
      relaxed: string;
      heading: string;
    };
  };

  spacing: {
    containerMaxWidth: string; // Max width for content wrappers (1280px)
    sectionSpacingY: string;   // Vertical space between homepage sections
    cardPadding: string;       // Internal padding for product & info cards
    buttonPaddingY: string;    // Vertical button padding
    buttonPaddingX: string;    // Horizontal button padding (2x vertical rule)
  };

  radii: {
    sm: string;        // 6px for small tags
    md: string;        // 8px for inputs
    lg: string;        // 12px for standard buttons
    xl: string;        // 16px for cards
    full: string;      // Pill badges
    button: string;    // Configurable button roundness
    card: string;      // Configurable card roundness
  };

  shadows: {
    card: string;
    cardHover: string;
    modal: string;
    dropdown: string;
  };
}

export const BRAND_THEME: ThemeConfig = {
  branding: {
    storeName: 'Cholti Mart',
    tagline: 'Shop Smart, Shop Cholti Mart',
    logoAlt: 'Cholti Mart - Official Logo',
    currencySymbol: '৳',
    currencyCode: 'BDT',
    supportPhone: '+880 1700-000000',
    supportEmail: 'support@choltimart.com',
  },

  colors: {
    // Official 5-Color Palette Implementation:
    primary: BRAND_PALETTE.darkGreen,          // #142C14 (Dark Green)
    primaryHover: '#0B1B0B',
    primaryLight: '#F3F6EC',                   // Ultra-soft Mindaro-infused background tint
    secondary: BRAND_PALETTE.calPolyGreen,     // #2D5128 (Cal Poly Green)
    secondaryHover: '#203A1C',
    accent: BRAND_PALETTE.fernGreen,           // #537B2F (Fern Green)
    accentHover: '#426325',
    supporting: BRAND_PALETTE.asparagus,       // #8DA750 (Asparagus)
    lightAccent: BRAND_PALETTE.mindaro,        // #E4EB9C (Mindaro)

    // Layout Canvas
    background: '#F9FAF7',                     // Clean natural surface
    surface: '#FFFFFF',
    headerBg: '#FFFFFF',
    footerBg: BRAND_PALETTE.darkGreen,         // #142C14

    // Typography Colors
    textPrimary: '#142C14',                    // Dark green-slate contrast
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

    // Borders
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderAccent: BRAND_PALETTE.asparagus,

    // Buttons
    btnPrimaryBg: BRAND_PALETTE.darkGreen,
    btnPrimaryText: '#FFFFFF',
    btnPrimaryHover: BRAND_PALETTE.calPolyGreen,
    btnSecondaryBg: BRAND_PALETTE.calPolyGreen,
    btnSecondaryText: '#FFFFFF',
    btnSecondaryHover: BRAND_PALETTE.darkGreen,

    // Status / System Feedback
    success: '#537B2F',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
  },

  typography: {
    fontFamilyPrimary: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilyHeading: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    fontFamilyBody: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    fontFamilyButton: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    fontFamilyNav: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    fontFamilyBangla: "'Hind Siliguri', 'Plus Jakarta Sans', system-ui, sans-serif",

    baseFontSize: '16px',
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeights: {
      tight: '1.15',
      normal: '1.5',
      relaxed: '1.65',
      heading: '1.2',
    },
  },

  spacing: {
    containerMaxWidth: '1280px',
    sectionSpacingY: '4rem',
    cardPadding: '1.5rem',
    buttonPaddingY: '0.75rem',
    buttonPaddingX: '1.5rem',
  },

  radii: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
    button: '0.75rem',
    card: '1rem',
  },

  shadows: {
    card: '0 1px 3px 0 rgba(20, 44, 20, 0.05), 0 1px 2px -1px rgba(20, 44, 20, 0.05)',
    cardHover: '0 10px 15px -3px rgba(20, 44, 20, 0.08), 0 4px 6px -4px rgba(20, 44, 20, 0.04)',
    modal: '0 25px 50px -12px rgba(20, 44, 20, 0.25)',
    dropdown: '0 10px 25px -5px rgba(20, 44, 20, 0.1), 0 8px 10px -6px rgba(20, 44, 20, 0.1)',
  },
};

