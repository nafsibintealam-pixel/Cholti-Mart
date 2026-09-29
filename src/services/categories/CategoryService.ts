import { apiClient } from '../api/apiClient';
import { Category } from '../../types';

class CategoryService {
  private categories: Category[] = [];

  // Get all categories from backend
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<{items: Category[]}>('/api/products/categories/all');
      if (response.isSuccess && response.data?.items) {
        this.categories = response.data.items.map(cat => {
          // Parse extra metadata saved in description column
          try {
            if (cat.description && cat.description.startsWith('{')) {
              const meta = JSON.parse(cat.description);
              cat.banglaName = meta.banglaName || '';
              cat.subcategories = typeof meta.subcategories === 'string' 
                ? JSON.parse(meta.subcategories) 
                : meta.subcategories;
            }
          } catch (e) {}
          return cat;
        });
        return this.categories;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }

  getCategoriesSync(): Category[] {
    return this.categories;
  }

  // Create category via FormData (supports Image Upload)
  async createCategory(data: FormData | any): Promise<boolean> {
    try {
      const response = await apiClient.post('/api/products/categories', data);
      if (response.isSuccess) {
        await this.getCategories(); // Refresh list after create
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create category:', error);
      return false;
    }
  }

  // Update category via FormData
  async updateCategory(data: FormData | any): Promise<boolean> {
    try {
      const id = data instanceof FormData ? data.get('id') : data.id;
      const response = await apiClient.put(`/api/products/categories/${id}`, data);
      if (response.isSuccess) {
        await this.getCategories(); // Refresh list
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update category:', error);
      return false;
    }
  }

  // Delete category
  async deleteCategory(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/api/products/categories/${id}`);
      if (response.isSuccess) {
        await this.getCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete category:', error);
      return false;
    }
  }
}

export const categoryService = new CategoryService();