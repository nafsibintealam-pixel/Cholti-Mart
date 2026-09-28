import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  ShoppingBag, 
  AlertTriangle, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  CheckCheck
} from 'lucide-react';
import { AdminNavSection } from '../../../types';
import { notificationService } from '../../../services';
import type { AdminNotificationItem } from '../../../services/notifications/NotificationService';

export type { AdminNotificationItem };

export interface AdminNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: AdminNavSection, subnav?: string) => void;
}

export const AdminNotificationsModal: React.FC<AdminNotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>(() => notificationService.getNotificationsSync());
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (isOpen) {
      setNotifications(notificationService.getNotificationsSync());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = notifications.filter(n => filter === 'all' || !n.isRead);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    notificationService.markAllAsRead().then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    });
  };

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    });
  };

  const getIcon = (cat: AdminNotificationItem['category']) => {
    switch (cat) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case 'stock':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'refund':
        return <RotateCcw className="w-4 h-4 text-purple-400" />;
      case 'courier':
        return <Truck className="w-4 h-4 text-blue-400" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Flyout Drawer */}
      <div className="fixed top-0 right-0 z-50 w-full max-w-sm sm:max-w-md h-full bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col animate-slideLeft">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2D5128] text-[#E4EB9C] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-mono border border-red-500/30">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-neutral-400">Store and administrative alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-4 py-2 border-b border-neutral-800/80 bg-neutral-950/30 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] text-[#E4EB9C] hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-xs text-neutral-400">
              No notifications to display
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  markAsRead(item.id);
                  onNavigate(item.navSection, item.subnav);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-1 ${
                  item.isRead
                    ? 'bg-neutral-950/40 border-neutral-800/60 opacity-80 hover:opacity-100 hover:bg-neutral-800/60'
                    : 'bg-neutral-800/60 border-neutral-700/80 hover:bg-neutral-800 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0">
                      {getIcon(item.category)}
                    </div>
                    <span className="text-xs font-bold text-white block">
                      {item.title}
                    </span>
                  </div>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#E4EB9C] shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-neutral-300 pl-7 leading-relaxed">
                  {item.message}
                </p>
                <div className="text-[10px] text-neutral-500 pl-7 font-mono pt-0.5">
                  {item.time}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-center text-[11px] text-neutral-400 shrink-0">
          Click any alert to jump directly to the relevant module
        </div>
      </div>
    </>
  );
};
