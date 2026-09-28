import {
  ThemeColorsConfig,
  TypographyConfig,
  SocialLinksConfig,
  FooterConfig,
  SiteSettingsConfig,
  DEFAULT_MASTER_CONFIG,
  MasterStoreConfig
} from '../../data/masterConfig';
import { settingsService } from '../settings/SettingsService';

export interface HeaderSettings {
  announcementText: string;
  showLanguageSwitcher: boolean;
  showCurrencyNotice: boolean;
  phone: string;
  showPhone: boolean;
}

export interface SiteDesignConfig {
  storeName: string;
  storeTagline: string;
  logo: string;
  favicon: string;
  colors: ThemeColorsConfig;
  typography: TypographyConfig;
  header: HeaderSettings;
  footer: FooterConfig;
  socialLinks: SocialLinksConfig;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    helplineHours: string;
  };
  seoDefaults: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
}

export interface ISiteDesignService {
  getDesignConfigSync(): SiteDesignConfig;
  getDesignConfig(): Promise<SiteDesignConfig>;
  updateDesignConfig(updates: Partial<SiteDesignConfig>): Promise<SiteDesignConfig>;
  updateColors(colors: Partial<ThemeColorsConfig>): Promise<ThemeColorsConfig>;
  updateTypography(typography: Partial<TypographyConfig>): Promise<TypographyConfig>;
  updateContactInfo(contact: Partial<SiteDesignConfig['contactInfo']>): Promise<SiteDesignConfig['contactInfo']>;
  updateSocialLinks(social: Partial<SocialLinksConfig>): Promise<SocialLinksConfig>;
  updateHeader(header: Partial<HeaderSettings>): Promise<HeaderSettings>;
  updateFooter(footer: Partial<FooterConfig>): Promise<FooterConfig>;
  subscribe(listener: (config: SiteDesignConfig) => void): () => void;
}

class SiteDesignServiceImpl implements ISiteDesignService {
  private listeners: Set<(config: SiteDesignConfig) => void> = new Set();

  public getDesignConfigSync(): SiteDesignConfig {
    const full = settingsService.getConfigSync();
    return this.mapToDesignConfig(full);
  }

  public async getDesignConfig(): Promise<SiteDesignConfig> {
    return this.getDesignConfigSync();
  }

  private mapToDesignConfig(full: MasterStoreConfig): SiteDesignConfig {
    return {
      storeName: full.siteSettings?.storeName || 'Cholti Mart',
      storeTagline: full.siteSettings?.tagline || 'Everyday Finds. Better Choices.',
      logo: full.siteSettings?.logoImageUrl || '/logo.png',
      favicon: '/favicon.ico',
      colors: full.themeColors || DEFAULT_MASTER_CONFIG.themeColors,
      typography: full.typography || DEFAULT_MASTER_CONFIG.typography,
      header: {
        announcementText: full.siteSettings?.announcementTextEn || 'Cash on Delivery (COD) Available Across Bangladesh',
        showLanguageSwitcher: true,
        showCurrencyNotice: true,
        phone: full.siteSettings?.phone || '+880 1700-000000',
        showPhone: true
      },
      footer: full.footer || DEFAULT_MASTER_CONFIG.footer,
      socialLinks: full.socialLinks || DEFAULT_MASTER_CONFIG.socialLinks,
      contactInfo: {
        address: full.siteSettings?.address || 'House 42, Road 7, Sector 3, Uttara, Dhaka-1230, Bangladesh',
        phone: full.siteSettings?.phone || '+880 1700-000000',
        email: full.siteSettings?.email || 'support@choltimart.com',
        whatsapp: full.siteSettings?.phone || '+880 1700-000000',
        helplineHours: '10 AM - 10 PM (Everyday)'
      },
      seoDefaults: {
        metaTitle: full.siteSettings?.storeName ? `${full.siteSettings.storeName} | Modern Shopping in Bangladesh` : 'Cholti Mart | Modern Shopping in Bangladesh',
        metaDescription: full.siteSettings?.tagline || 'Discover curated fashion, jewelry, gadgets, and everyday essentials with dependable nationwide Cash on Delivery.',
        metaKeywords: 'ecommerce, bangladesh, online shopping, cash on delivery, gadgets, kurti, jewelry'
      }
    };
  }

  private notify() {
    const cfg = this.getDesignConfigSync();
    this.listeners.forEach(l => l(cfg));
  }

  public subscribe(listener: (config: SiteDesignConfig) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async updateDesignConfig(updates: Partial<SiteDesignConfig>): Promise<SiteDesignConfig> {
    if (updates.colors) await this.updateColors(updates.colors);
    if (updates.typography) await this.updateTypography(updates.typography);
    if (updates.contactInfo) await this.updateContactInfo(updates.contactInfo);
    if (updates.socialLinks) await this.updateSocialLinks(updates.socialLinks);
    if (updates.header) await this.updateHeader(updates.header);
    if (updates.footer) await this.updateFooter(updates.footer);
    this.notify();
    return this.getDesignConfigSync();
  }

  public async updateColors(colors: Partial<ThemeColorsConfig>): Promise<ThemeColorsConfig> {
    const updated = await settingsService.updateThemeColors(colors);
    this.notify();
    return updated;
  }

  public async updateTypography(typography: Partial<TypographyConfig>): Promise<TypographyConfig> {
    const updated = await settingsService.updateTypography(typography);
    this.notify();
    return updated;
  }

  public async updateContactInfo(contact: Partial<SiteDesignConfig['contactInfo']>): Promise<SiteDesignConfig['contactInfo']> {
    await settingsService.updateSiteSettings({
      address: contact.address,
      phone: contact.phone,
      email: contact.email
    });
    this.notify();
    return this.getDesignConfigSync().contactInfo;
  }

  public async updateSocialLinks(social: Partial<SocialLinksConfig>): Promise<SocialLinksConfig> {
    const updated = await settingsService.updateSocialLinks(social);
    this.notify();
    return updated;
  }

  public async updateHeader(header: Partial<HeaderSettings>): Promise<HeaderSettings> {
    if (header.phone) {
      await settingsService.updateSiteSettings({ phone: header.phone });
    }
    this.notify();
    return this.getDesignConfigSync().header;
  }

  public async updateFooter(footer: Partial<FooterConfig>): Promise<FooterConfig> {
    const updated = await settingsService.updateFooter(footer);
    this.notify();
    return updated;
  }
}

export const siteDesignService = new SiteDesignServiceImpl();
