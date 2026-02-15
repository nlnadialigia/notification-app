'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';

export function useNotifications() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const setNotifications = useNotificationStore((state) => state.setNotifications);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getAll,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data, setNotifications]);

  return {
    notifications: data || [],
    isLoading,
    error,
    refetch,
  };
}
