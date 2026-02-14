'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { NotificationItem } from './NotificationItem';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Skeleton } from '@/components/ui/skeleton';

export function NotificationList() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Notifications</h3>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="p-2 space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification.id)}
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
