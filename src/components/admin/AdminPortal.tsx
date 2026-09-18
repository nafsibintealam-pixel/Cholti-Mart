import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLoginView } from './AdminLoginView';
import { AdminDashboard } from './AdminDashboard';

/**
 * SECURE ADMIN PORTAL ROUTE
 * ==========================================================
 * Strict authentication boundary:
 * Unauthenticated users are presented with the AdminLoginView.
 * Only authenticated administrators with valid session tokens
 * can access the AdminDashboard management interfaces.
 */
export const AdminPortal: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLoginView />;
  }

  return <AdminDashboard />;
};
