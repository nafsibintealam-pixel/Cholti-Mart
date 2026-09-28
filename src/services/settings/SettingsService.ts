import {
  SiteSettingsConfig,
  ThemeColorsConfig,
  TypographyConfig,
  SectionsVisibilityConfig,
  SocialLinksConfig,
  FooterConfig,
  DEFAULT_MASTER_CONFIG,
  MasterStoreConfig
} from '../../data/masterConfig';
import { API_CONFIG } from '../api/config';
import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export interface ISettingsService {
  getConfigSync(): MasterStoreConfig;
  getSiteSettings(): Promise<SiteSettingsConfig>;
  updateSiteSettings(updates: Partial<SiteSettingsConfig>): Promise<SiteSettingsConfig>;

  getThemeColors(): Promise<ThemeColorsConfig>;
  updateThemeColors(updates: Partial<ThemeColorsConfig>): Promise<ThemeColorsConfig>;

  getTypography(): Promise<TypographyConfig>;
  updateTypography(updates: Partial<TypographyConfig>): Promise<TypographyConfig>;

  getSectionsVisibility(): Promise<SectionsVisibilityConfig>;
  updateSectionsVisibility(updates: Partial<SectionsVisibilityConfig>): Promise<SectionsVisibilityConfig>;

  getSocialLinks(): Promise<SocialLinksConfig>;
  updateSocialLinks(updates: Partial<SocialLinksConfig>): Promise<SocialLinksConfig>;

  getFooter(): Promise<FooterConfig>;
  updateFooter(updates: Partial<FooterConfig>): Promise<FooterConfig>;

  resetToDefaults(): Promise<MasterStoreConfig>;
}

const STORAGE_KEY = 'cholti_mart_master_config_v2';

class SettingsServiceImpl implements ISettingsService {
  private config: MasterStoreConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): MasterStoreConfig {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_MASTER_CONFIG,
            ...parsed,
            siteSettings: { ...DEFAULT_MASTER_CONFIG.siteSettings, ...(parsed.siteSettings || {}) },
            themeColors: { ...DEFAULT_MASTER_CONFIG.themeColors, ...(parsed.themeColors || {}) },
            typography: { ...DEFAULT_MASTER_CONFIG.typography, ...(parsed.typography || {}) },
            sectionsVisibility: { ...DEFAULT_MASTER_CONFIG.sectionsVisibility, ...(parsed.sectionsVisibility || {}) },
            socialLinks: { ...DEFAULT_MASTER_CONFIG.socialLinks, ...(parsed.socialLinks || {}) },
            footer: { ...DEFAULT_MASTER_CONFIG.footer, ...(parsed.footer || {}) },
          };
        }
      } catch (e) {
        console.warn('Failed to parse saved settings, using defaults', e);
      }
    }
    return { ...DEFAULT_MASTER_CONFIG };
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
      } catch (e) {
        console.warn('Failed to persist settings', e);
      }
    }
  }

  public getConfigSync(): MasterStoreConfig {
    return { ...this.config };
  }

  public async getSiteSettings(): Promise<SiteSettingsConfig> {
    return { ...this.config.siteSettings };
  }

  public async updateSiteSettings(updates: Partial<SiteSettingsConfig>): Promise<SiteSettingsConfig> {
    this.config.siteSettings = { ...this.config.siteSettings, ...updates };
    this.persist();
    return { ...this.config.siteSettings };
  }

  public async getThemeColors(): Promise<ThemeColorsConfig> {
    return { ...this.config.themeColors };
  }

  public async updateThemeColors(updates: Partial<ThemeColorsConfig>): Promise<ThemeColorsConfig> {
    this.config.themeColors = { ...this.config.themeColors, ...updates };
    this.persist();
    return { ...this.config.themeColors };
  }

  public async getTypography(): Promise<TypographyConfig> {
    return { ...this.config.typography };
  }

  public async updateTypography(updates: Partial<TypographyConfig>): Promise<TypographyConfig> {
    this.config.typography = { ...this.config.typography, ...updates };
    this.persist();
    return { ...this.config.typography };
  }

  public async getSectionsVisibility(): Promise<SectionsVisibilityConfig> {
    return { ...this.config.sectionsVisibility };
  }

  public async updateSectionsVisibility(updates: Partial<SectionsVisibilityConfig>): Promise<SectionsVisibilityConfig> {
    this.config.sectionsVisibility = { ...this.config.sectionsVisibility, ...updates };
    this.persist();
    return { ...this.config.sectionsVisibility };
  }

  public async getSocialLinks(): Promise<SocialLinksConfig> {
    return { ...this.config.socialLinks };
  }

  public async updateSocialLinks(updates: Partial<SocialLinksConfig>): Promise<SocialLinksConfig> {
    this.config.socialLinks = { ...this.config.socialLinks, ...updates };
    this.persist();
    return { ...this.config.socialLinks };
  }

  public async getFooter(): Promise<FooterConfig> {
    return { ...this.config.footer };
  }

  public async updateFooter(updates: Partial<FooterConfig>): Promise<FooterConfig> {
    this.config.footer = { ...this.config.footer, ...updates };
    this.persist();
    return { ...this.config.footer };
  }

  public async resetToDefaults(): Promise<MasterStoreConfig> {
    this.config = { ...DEFAULT_MASTER_CONFIG };
    this.persist();
    return { ...this.config };
  }
}

export const settingsService: ISettingsService = new SettingsServiceImpl();
