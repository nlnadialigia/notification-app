'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationsApi } from '@/lib/api';
import { socketService } from '@/lib/socket';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import type { Notification } from '@/types';

export function useNotifications() {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const { setNotifications, addNotification } = useNotificationStore();

  // Fetch notifications
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getAll,
    enabled: isAuthenticated,
  });

  // Set notifications in store when data is fetched
  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data, setNotifications]);

  // Connect to WebSocket and listen for new notifications
  useEffect(() => {
    if (!token || !isAuthenticated) return;

    // Connect to WebSocket
    socketService.connect(token);

    // Listen for new notifications
    const cleanup = socketService.on('notification', (notification: Notification) => {
      addNotification(notification);
      
      // Show toast notification
      toast.success(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    });

    // Cleanup on unmount
    return () => {
      cleanup();
      socketService.disconnect();
    };
  }, [token, isAuthenticated, addNotification]);

  return {
    notifications: data || [],
    isLoading,
    error,
    refetch,
  };
}
