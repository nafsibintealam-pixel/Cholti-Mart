import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MasterStoreConfig, 
  DEFAULT_MASTER_CONFIG, 
  SiteSettingsConfig, 
  ThemeColorsConfig, 
  TypographyConfig, 
  SectionsVisibilityConfig, 
  HeroConfig, 
  PromoBannerConfig, 
  SocialLinksConfig, 
  FooterConfig 
} from '../data/masterConfig';
import { CategoryItem, Product } from '../types';

interface CustomizerContextType {
  config: MasterStoreConfig;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  activeCustomizerTab: string;
  setActiveCustomizerTab: (tab: string) => void;

  // Granular update methods
  updateSiteSettings: (settings: Partial<SiteSettingsConfig>) => void;
  updateThemeColors: (colors: Partial<ThemeColorsConfig>) => void;
  updateTypography: (typography: Partial<TypographyConfig>) => void;
  toggleSectionVisibility: (section: keyof SectionsVisibilityConfig) => void;
  updateHero: (hero: Partial<HeroConfig>) => void;
  updatePromoBanner: (banner: Partial<PromoBannerConfig>) => void;
  updateSocialLinks: (links: Partial<SocialLinksConfig>) => void;
  updateFooter: (footer: Partial<FooterConfig>) => void;

  // Content entities
  updateCategory: (category: CategoryItem) => void;
  updateProduct: (product: Product) => void;
  updateFaq: (index: number, question: string, answer: string) => void;

  // Backup, Import & Export
  exportConfigJson: () => string;
  downloadConfigJson: () => void;
  importConfigJson: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const CustomizerContext = createContext<CustomizerContextType | undefined>(undefined);

const STORAGE_KEY = 'cholti_mart_master_config_v2';

export const CustomizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<MasterStoreConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults in case of missing keys
        return {
          ...DEFAULT_MASTER_CONFIG,
          ...parsed,
          siteSettings: { ...DEFAULT_MASTER_CONFIG.siteSettings, ...(parsed.siteSettings || {}) },
          themeColors: { ...DEFAULT_MASTER_CONFIG.themeColors, ...(parsed.themeColors || {}) },
          typography: { ...DEFAULT_MASTER_CONFIG.typography, ...(parsed.typography || {}) },
          sectionsVisibility: { ...DEFAULT_MASTER_CONFIG.sectionsVisibility, ...(parsed.sectionsVisibility || {}) },
          hero: { ...DEFAULT_MASTER_CONFIG.hero, ...(parsed.hero || {}) },
          promoBanner: { ...DEFAULT_MASTER_CONFIG.promoBanner, ...(parsed.promoBanner || {}) },
          socialLinks: { ...DEFAULT_MASTER_CONFIG.socialLinks, ...(parsed.socialLinks || {}) },
          footer: { ...DEFAULT_MASTER_CONFIG.footer, ...(parsed.footer || {}) },
          categories: parsed.categories?.length ? parsed.categories : DEFAULT_MASTER_CONFIG.categories,
          products: parsed.products?.length ? parsed.products : DEFAULT_MASTER_CONFIG.products,
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved store configuration, using defaults.', e);
    }
    return DEFAULT_MASTER_CONFIG;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [activeCustomizerTab, setActiveCustomizerTab] = useState('general');

  // Persist to localStorage whenever config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to persist store config to localStorage', e);
    }
  }, [config]);

  // Dynamically inject CSS variables into document.documentElement (:root)
  useEffect(() => {
    const root = document.documentElement;
    const colors = config.themeColors;
    const typo = config.typography;

    // Apply color palette tokens
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--supporting-color', colors.softAccent);
    root.style.setProperty('--light-accent-color', colors.lightAccent);

    // Apply neutral tokens
    root.style.setProperty('--background-color', colors.background);
    root.style.setProperty('--surface-color', colors.surface);
    root.style.setProperty('--text-primary', colors.mainText);
    root.style.setProperty('--text-secondary', colors.secondaryText);
    root.style.setProperty('--border-color', colors.border);

    // Apply system status
    root.style.setProperty('--success-color', colors.success);
    root.style.setProperty('--warning-color', colors.warning);
    root.style.setProperty('--error-color', colors.error);

    // Apply radii
    root.style.setProperty('--radius-btn', typo.buttonRadius);
    root.style.setProperty('--radius-card', typo.cardRadius);

    // Also update body background
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.mainText;
  }, [config.themeColors, config.typography]);

  const updateSiteSettings = (settings: Partial<SiteSettingsConfig>) => {
    setConfig(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      siteSettings: { ...prev.siteSettings, ...settings },
    }));
  };

  const updateThemeColors = (colors: Partial<ThemeColorsConfig>) => {
    setConfig(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      themeColors: { ...prev.themeColors, ...colors },
    }));
  };

  const updateTypography = (typography: Partial<TypographyConfig>) => {
    setConfig(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      typography: { ...prev.typography, ...typography },
    }));
  };

  const toggleSectionVisibility = (section: keyof SectionsVisibilityConfig) => {
    setConfig(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      sectionsVisibility: {
        ...prev.sectionsVisibility,
        [section]: !prev.sectionsVisibility[section],
      },
    }));
  };

  const updateHero = (hero: Partial<HeroConfig>) => {
    setConfig(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      hero: { ...prev.hero, ...hero },
    }));
  };

  const updatePromoBanner = (banner: Partial<PromoBannerConfig>) => {
    setConfig(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      promoBanner: { ...prev.promoBanner, ...banner },
    }));
  };

  const updateSocialLinks = (links: Partial<SocialLinksConfig>) => {
    setConfig(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      socialLinks: { ...prev.socialLinks, ...links },
    }));
  };

  const updateFooter = (footer: Partial<FooterConfig>) => {
    setConfig(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      footer: { ...prev.footer, ...footer },
    }));
  };

  const updateCategory = (category: CategoryItem) => {
    setConfig(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      categories: prev.categories.map(c => c.id === category.id ? category : c),
    }));
  };

  const updateProduct = (product: Product) => {
    setConfig(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      products: prev.products.map(p => p.id === product.id ? product : p),
    }));
  };

  const updateFaq = (index: number, question: string, answer: string) => {
    setConfig(prev => {
      const newFaqs = [...prev.faqs];
      if (newFaqs[index]) {
        newFaqs[index] = { ...newFaqs[index], question, answer };
      }
      return {
        ...prev,
        lastUpdated: new Date().toISOString(),
        faqs: newFaqs,
      };
    });
  };

  const exportConfigJson = (): string => {
    return JSON.stringify(config, null, 2);
  };

  const downloadConfigJson = () => {
    const jsonStr = exportConfigJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cholti-mart-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importConfigJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return false;
      }
      // Validate core blocks
      const merged: MasterStoreConfig = {
        ...DEFAULT_MASTER_CONFIG,
        ...parsed,
        siteSettings: { ...DEFAULT_MASTER_CONFIG.siteSettings, ...(parsed.siteSettings || {}) },
        themeColors: { ...DEFAULT_MASTER_CONFIG.themeColors, ...(parsed.themeColors || {}) },
        typography: { ...DEFAULT_MASTER_CONFIG.typography, ...(parsed.typography || {}) },
        sectionsVisibility: { ...DEFAULT_MASTER_CONFIG.sectionsVisibility, ...(parsed.sectionsVisibility || {}) },
        hero: { ...DEFAULT_MASTER_CONFIG.hero, ...(parsed.hero || {}) },
        promoBanner: { ...DEFAULT_MASTER_CONFIG.promoBanner, ...(parsed.promoBanner || {}) },
        socialLinks: { ...DEFAULT_MASTER_CONFIG.socialLinks, ...(parsed.socialLinks || {}) },
        footer: { ...DEFAULT_MASTER_CONFIG.footer, ...(parsed.footer || {}) },
        categories: parsed.categories?.length ? parsed.categories : DEFAULT_MASTER_CONFIG.categories,
        products: parsed.products?.length ? parsed.products : DEFAULT_MASTER_CONFIG.products,
        lastUpdated: new Date().toISOString(),
      };
      setConfig(merged);
      return true;
    } catch (e) {
      console.error('Failed to import config:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all site customizations back to factory default? Any unsaved edits will be restored.')) {
      setConfig({
        ...DEFAULT_MASTER_CONFIG,
        lastUpdated: new Date().toISOString(),
      });
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <CustomizerContext.Provider
      value={{
        config,
        isCustomizerOpen,
        setIsCustomizerOpen,
        activeCustomizerTab,
        setActiveCustomizerTab,
        updateSiteSettings,
        updateThemeColors,
        updateTypography,
        toggleSectionVisibility,
        updateHero,
        updatePromoBanner,
        updateSocialLinks,
        updateFooter,
        updateCategory,
        updateProduct,
        updateFaq,
        exportConfigJson,
        downloadConfigJson,
        importConfigJson,
        resetToDefaults,
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
};

export const useCustomizer = () => {
  const context = useContext(CustomizerContext);
  if (!context) {
    throw new Error('useCustomizer must be used within a CustomizerProvider');
  }
  return context;
};
