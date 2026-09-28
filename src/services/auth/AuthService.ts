import {
  adminAuthService,
  IAdminAuthService,
  AdminLoginCredentials,
  AdminAuthResult,
  BackendAuthStatus
} from '../adminAuthService';

export interface IAuthService extends IAdminAuthService {}

export const authService: IAuthService = adminAuthService;
export type { AdminLoginCredentials, AdminAuthResult, BackendAuthStatus };
