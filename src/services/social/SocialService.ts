import { SocialLinksConfig, DEFAULT_MASTER_CONFIG } from '../../data/masterConfig';
import { settingsService } from '../settings/SettingsService';

export interface ISocialService {
  getSocialLinks(): Promise<SocialLinksConfig>;
  getSocialLinksSync(): SocialLinksConfig;
  updateSocialLinks(updates: Partial<SocialLinksConfig>): Promise<SocialLinksConfig>;
}

class SocialServiceImpl implements ISocialService {
  public getSocialLinksSync(): SocialLinksConfig {
    const config = settingsService.getConfigSync();
    return config.socialLinks || DEFAULT_MASTER_CONFIG.socialLinks;
  }

  public async getSocialLinks(): Promise<SocialLinksConfig> {
    return this.getSocialLinksSync();
  }

  public async updateSocialLinks(updates: Partial<SocialLinksConfig>): Promise<SocialLinksConfig> {
    return await settingsService.updateSocialLinks(updates);
  }
}

export const socialService = new SocialServiceImpl();
