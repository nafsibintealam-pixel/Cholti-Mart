import { API_CONFIG } from './config';

/**
 * PRODUCTION-READY HTTP API CLIENT
 * =================================
 * Standard fetch wrapper with interceptors, bearer token authorization,
 * error normalization, FormData support, and mock-adapter fallback.
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  isSuccess: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = API_CONFIG.baseUrl) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('cholti_admin_session_token');
      } catch {
        return null;
      }
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(options.headers as Record<string, string> || {}),
    };

    // 💡 ম্যাজিক ফিক্স: যদি ডেটা FormData হয়, তবে ডিফল্ট JSON হেডার মুছে দেওয়া হলো,
    // যাতে ব্রাউজার নিজে থেকে ফাইল আপলোডের সঠিক boundary সেট করতে পারে।
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw {
          status: response.status,
          message: (data && data.message) || `HTTP error ${response.status}`,
          errors: data?.errors,
        } as ApiError;
      }

      return {
        data: data as T,
        status: response.status,
        isSuccess: true,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw {
          status: 408,
          message: 'Request timed out. Please verify your connection and try again.',
        } as ApiError;
      }
      throw err;
    }
  }

  public get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    // 💡 ফিক্স: FormData হলে JSON.stringify করা বন্ধ করা হলো
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  public put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    // 💡 ফিক্স: FormData হলে JSON.stringify করা বন্ধ করা হলো
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  public patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  public delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Singleton global API client instance
export const apiClient = new ApiClient();