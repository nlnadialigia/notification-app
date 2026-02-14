'use client';

import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/card';
import type { Notification } from '@/types';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer hover:bg-accent transition-colors border-l-4',
        notification.read
          ? 'border-l-transparent bg-background'
          : 'border-l-fuchsia-600 bg-fuchsia-50/50 dark:bg-fuchsia-950/20'
      )}
      onClick={onClick}
    >
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold leading-none">{notification.title}</h4>
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-fuchsia-600 flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </Card>
  );
}
