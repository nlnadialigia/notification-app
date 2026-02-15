'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationItem } from './NotificationItem';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Skeleton } from '@/components/ui/skeleton';
import { notificationsApi } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiError } from '@/types';
import { useTranslations } from 'next-intl';

export function NotificationList() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const t = useTranslations('notifications');
  const tc = useTranslations('common');

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: (data) => {
      markAsRead(data.id);
    },
    onError: (error: ApiError) => {
      toast.error(t('markAsReadError'), {
        description: error.response?.data?.message,
      });
    },
  });

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsReadMutation.mutate(id);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{tc('notifications')}</h3>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="p-2 space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification.id, notification.read)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export function NotificationListSkeleton() {
  return (
    <div className="p-2 space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      ))}
    </div>
  );
}
