/**
 * API CONFIGURATION & ENVIRONMENT ABSTRACTION
 * ===========================================
 * Centralizes endpoint URLs, backend connectivity settings, and runtime flags.
 * 
 * ARCHITECTURAL PRINCIPLES:
 * 1. Never exposes private API secrets, database passwords, or private keys in the browser.
 * 2. Explicitly differentiates between 'development' mock driver and 'production' live endpoints.
 * 3. In production mode (VITE_APP_ENV === 'production'), silent fallback to mock data is strictly prevented.
 * 4. Missing backend configuration in production yields a clean, non-sensitive configuration error.
 */

export type AppEnvironment = 'development' | 'staging' | 'production';

export interface ApiConfig {
  baseUrl: string;
  wpBaseUrl: string;
  wcEndpoint: string;
  authApiUrl: string;
  isMockMode: boolean;
  timeoutMs: number;
  environment: AppEnvironment;
}

// Derive environment safely
const rawEnv = (import.meta.env.VITE_APP_ENV as string) || (import.meta.env.MODE as string) || 'development';
const environment: AppEnvironment = 
  rawEnv === 'production' ? 'production' :
  rawEnv === 'staging' ? 'staging' : 'development';

// Check if mock mode is requested or active
const rawUseMock = import.meta.env.VITE_USE_MOCK_DATA;
const isProduction = environment === 'production';

// Production safety rule: In production, mock mode is disabled unless explicitly set in testing.
// In development, default to mock mode so preview works offline/without backend.
const isMockMode: boolean = isProduction
  ? rawUseMock === 'true' // In production, only true if explicitly forced (logs warning below)
  : rawUseMock !== 'false'; // In development, default to true

if (isProduction && isMockMode) {
  console.warn(
    '[SECURITY WARNING] Application is running in PRODUCTION environment with MOCK DATA enabled. ' +
    'This mode should only be used for testing and never with real customer transactions.'
  );
}

export const API_CONFIG: ApiConfig = {
  // Public base URL configured via environment variable, or fallback to relative API proxy
  baseUrl: (import.meta.env.VITE_API_BASE_URL as string) || '/api/v1',
  wpBaseUrl: (import.meta.env.VITE_WORDPRESS_API_URL as string) || (import.meta.env.VITE_WP_URL as string) || 'https://choltimart.com/wp-json/wp/v2',
  wcEndpoint: (import.meta.env.VITE_WOOCOMMERCE_API_URL as string) || (import.meta.env.VITE_WOO_ENDPOINT as string) || 'https://choltimart.com/wp-json/wc/v3',
  authApiUrl: (import.meta.env.VITE_AUTH_API_URL as string) || '/api/v1/auth',
  
  isMockMode,
  timeoutMs: 15000,
  environment,
};

export type ConnectionStatus = 'not_connected' | 'connecting' | 'connected' | 'error';

/**
 * Production Readiness Validator:
 * Validates whether live API parameters are properly configured without leaking any sensitive keys.
 */
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateBackendConfig(): ConfigValidationResult {
  const errors: string[] = [];

  if (!API_CONFIG.isMockMode) {
    if (!API_CONFIG.baseUrl || API_CONFIG.baseUrl === '/api/v1') {
      errors.push('VITE_API_BASE_URL is not configured for live backend connectivity.');
    }
    if (!API_CONFIG.wpBaseUrl || API_CONFIG.wpBaseUrl.includes('choltimart.com/wp-json')) {
      errors.push('VITE_WORDPRESS_API_URL points to default placeholder.');
    }
    if (!API_CONFIG.wcEndpoint || API_CONFIG.wcEndpoint.includes('choltimart.com/wp-json')) {
      errors.push('VITE_WOOCOMMERCE_API_URL points to default placeholder.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Safe Assertion for Live Adapters:
 * If the application is running in production or live mode, ensures required endpoints are present.
 * Throws a clean error without revealing any server infrastructure details.
 */
export function assertLiveApiReady(): void {
  if (API_CONFIG.isMockMode) {
    return;
  }

  const validation = validateBackendConfig();
  if (!validation.isValid && API_CONFIG.environment === 'production') {
    throw new Error(
      'Service Unavailable: Backend API endpoints are not configured for production. ' +
      'Please verify environment configuration with your system administrator.'
    );
  }
}
