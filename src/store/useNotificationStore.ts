import { create } from 'zustand';
import type { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) => {
    set((state) => {
      const newNotifications = [notification, ...state.notifications];
      const unreadCount = newNotifications.filter((n) => !n.read).length;
      return { notifications: newNotifications, unreadCount };
    });
  },
  
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount });
  },
  
  markAsRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    });
  },
  
  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
