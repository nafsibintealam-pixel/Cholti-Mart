import { ContentPageRecord } from '../../types';
import { contentService } from '../content/ContentService';

export interface IPageService {
  getPages(): Promise<ContentPageRecord[]>;
  getPagesSync(): ContentPageRecord[];
  getPageBySlug(slug: string): Promise<ContentPageRecord | null>;
  getPageById(id: string): Promise<ContentPageRecord | null>;
  createPage(page: Omit<ContentPageRecord, 'id' | 'lastModified' | 'views'>): Promise<ContentPageRecord>;
  updatePage(id: string, updates: Partial<ContentPageRecord>): Promise<ContentPageRecord>;
  deletePage(id: string): Promise<boolean>;
}

class PageServiceImpl implements IPageService {
  public getPagesSync(): ContentPageRecord[] {
    return contentService.getPagesSync();
  }

  public async getPages(): Promise<ContentPageRecord[]> {
    return await contentService.getPages();
  }

  public async getPageBySlug(slug: string): Promise<ContentPageRecord | null> {
    const pages = await contentService.getPages();
    return pages.find(p => p.slug === slug) || null;
  }

  public async getPageById(id: string): Promise<ContentPageRecord | null> {
    const pages = await contentService.getPages();
    return pages.find(p => p.id === id) || null;
  }

  public async createPage(page: Omit<ContentPageRecord, 'id' | 'lastModified' | 'views'>): Promise<ContentPageRecord> {
    const newPage: ContentPageRecord = {
      ...page,
      id: `page-${Date.now().toString(36)}`,
      lastModified: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      views: 0
    };
    const current = await contentService.getPages();
    current.push(newPage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cholti_admin_content_pages_v1', JSON.stringify(current));
    }
    return newPage;
  }

  public async updatePage(id: string, updates: Partial<ContentPageRecord>): Promise<ContentPageRecord> {
    return await contentService.updatePage(id, updates);
  }

  public async deletePage(id: string): Promise<boolean> {
    const pages = await contentService.getPages();
    const updated = pages.filter(p => p.id !== id);
    if (updated.length !== pages.length) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cholti_admin_content_pages_v1', JSON.stringify(updated));
      }
      return true;
    }
    return false;
  }
}

export const pageService = new PageServiceImpl();
