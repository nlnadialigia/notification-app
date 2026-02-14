'use client';

import {NotificationBell} from '@/components/notifications/NotificationBell';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {useNotifications} from '@/hooks/useNotifications';
import {notificationsApi} from '@/lib/api';
import {useAuthStore} from '@/store/useAuthStore';
import {useMutation} from '@tanstack/react-query';
import {Loader2, LogOut, Send} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {toast} from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const {user, logout, isAuthenticated} = useAuthStore();
  const {notifications, isLoading} = useNotifications();

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const sendTestNotification = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('User not found');
      return notificationsApi.create({
        userId: user.id,
        title: 'Test Notification',
        message: `This is a test notification sent at ${new Date().toLocaleTimeString()}`,
      });
    },
    onSuccess: () => {
      toast.success('Test notification sent!', {
        description: 'Check your notification bell',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to send notification', {
        description: error.response?.data?.message || 'Please try again',
      });
    },
  });

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-950 dark:to-purple-950">
        <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-950 dark:to-purple-950">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={user.picture} alt={user.name || user.email} />
                <AvatarFallback className="bg-fuchsia-600 text-white">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{user.name || 'User'}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Real-Time Notifications! 🎉</CardTitle>
              <CardDescription>
                Your notification system is connected and ready to receive updates in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => sendTestNotification.mutate()}
                disabled={sendTestNotification.isPending}
                className="bg-fuchsia-600 hover:bg-fuchsia-700"
              >
                {sendTestNotification.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Test Notification
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-950/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Notifications</p>
                  <div className="text-3xl font-bold text-fuchsia-600">
                    {isLoading ? <Skeleton className="h-9 w-16" /> : notifications.length}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <div className="text-3xl font-bold text-purple-600">
                    {isLoading ? (
                      <Skeleton className="h-9 w-16" />
                    ) : (
                      notifications.filter((n) => !n.read).length
                    )}
                  </div>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Read</p>
                  <div className="text-3xl font-bold text-pink-600">
                    {isLoading ? (
                      <Skeleton className="h-9 w-16" />
                    ) : (
                      notifications.filter((n) => n.read).length
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Real-Time Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    Your browser is connected to the server via WebSocket for instant updates.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Instant Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    When a notification is created, you&apos;ll see it immediately without refreshing.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Toast Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    New notifications appear as toast messages in the top-right corner.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
