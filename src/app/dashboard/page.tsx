'use client';

import { NotificationBell } from '@/components/notifications/NotificationBell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useNotifications } from '@/hooks/useNotifications';
import { notificationsApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useMutation } from '@tanstack/react-query';
import { Loader2, LogOut, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { ApiError } from '@/types';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const notifications = useNotificationStore(state => state.notifications);
  const { isLoading: isQueryLoading } = useNotifications();
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');

  // Local state for custom notification dialog
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const sendNotificationMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('User not found');
      return notificationsApi.create({
        userId: user.id,
        title: title || t('newNotification'),
        message: message || `${t('notificationSent')} ${new Date().toLocaleTimeString()}`,
      });
    },
    onSuccess: () => {
      toast.success(t('notificationSent'), {
        description: t('checkBell'),
      });
      setIsOpen(false);
      setTitle('');
      setMessage('');
    },
    onError: (error: ApiError) => {
      toast.error(t('sendFailed'), {
        description: error.response?.data?.message || t('tryAgain'),
      });
    },
  });

  const handleLogout = () => {
    logout();
    toast.info(t('loggedOut'));
    router.push('/login');
  };

  const handleSendNotification = () => {
    sendNotificationMutation.mutate();
  };

  if (!user || isQueryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-950 dark:to-purple-950">
        <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-48" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
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
              <LanguageSwitcher />
              <NotificationBell />
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label={tc('logout')}>
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
              <CardTitle>{t('welcome')}</CardTitle>
              <CardDescription>
                {t('description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-fuchsia-600 hover:bg-fuchsia-700">
                    <Send className="mr-2 h-4 w-4" />
                    {t('sendCustomNotification')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('newNotification')}</DialogTitle>
                    <DialogDescription>
                      {t('notificationDetails')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">{t('title')}</Label>
                      <Input
                        id="title"
                        placeholder={t('titlePlaceholder')}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('message')}</Label>
                      <Textarea
                        id="message"
                        placeholder={t('messagePlaceholder')}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>{tc('cancel')}</Button>
                    <Button
                      onClick={handleSendNotification}
                      disabled={sendNotificationMutation.isPending}
                      className="bg-fuchsia-600 hover:bg-fuchsia-700"
                    >
                      {sendNotificationMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {tc('sending')}
                        </>
                      ) : (
                        tc('send')
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('stats.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-950/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('stats.total')}</p>
                  <div className="text-3xl font-bold text-fuchsia-600">
                    {isQueryLoading ? <Skeleton className="h-9 w-16" /> : notifications.length}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('stats.unread')}</p>
                  <div className="text-3xl font-bold text-purple-600">
                    {isQueryLoading ? (
                      <Skeleton className="h-9 w-16" />
                    ) : (
                      notifications.filter((n) => !n.read).length
                    )}
                  </div>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('stats.read')}</p>
                  <div className="text-3xl font-bold text-pink-600">
                    {isQueryLoading ? (
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
              <CardTitle>{t('howItWorks.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">{t('howItWorks.step1.title')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('howItWorks.step1.description')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">{t('howItWorks.step2.title')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('howItWorks.step2.description')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">{t('howItWorks.step3.title')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('howItWorks.step3.description')}
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
