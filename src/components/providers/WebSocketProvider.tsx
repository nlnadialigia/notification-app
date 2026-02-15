'use client';

import { useEffect, useState } from 'react';
import { socketService } from '@/lib/socket';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { toast } from 'sonner';
import type { Notification } from '@/types';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');

  useEffect(() => {
    if (!token || !isAuthenticated) return;

    socketService.connect(token);

    const cleanupNotification = socketService.on('notification', (notification: Notification) => {
      addNotification(notification);
      toast.success(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    });

    const cleanupStatus = socketService.onStatusChange((status) => {
      setConnectionStatus(status);
      if (status === 'error') {
        toast.error('Connection lost', {
          description: 'Trying to reconnect...',
        });
      } else if (status === 'connected' && connectionStatus === 'error') {
        toast.success('Reconnected', {
          description: 'Connection restored',
        });
      }
    });

    return () => {
      cleanupNotification();
      cleanupStatus();
      socketService.disconnect();
    };
  }, [token, isAuthenticated, addNotification]);

  return <>{children}</>;
}
