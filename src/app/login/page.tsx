'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {authApi} from '@/lib/api';
import {useAuthStore} from '@/store/useAuthStore';
import {GoogleLogin} from '@react-oauth/google';
import {useMutation} from '@tanstack/react-query';
import {Bell} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {toast} from 'sonner';
import type {ApiError} from '@/types';
import {useTranslations} from 'next-intl';
import {LanguageSwitcher} from '@/components/LanguageSwitcher';

export default function LoginPage() {
  const router = useRouter();
  const {setAuth, isAuthenticated} = useAuthStore();
  const t = useTranslations('login');

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const loginMutation = useMutation({
    mutationFn: async (credential: string) => {
      return authApi.loginWithGoogle(credential);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      toast.success('Welcome!', {
        description: `Logged in as ${data.user.email}`,
      });
      router.push('/dashboard');
    },
    onError: (error: ApiError) => {
      console.error('Login error:', error);
      toast.error(t('error'));
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-950 dark:to-purple-950 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-fuchsia-600 rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl">{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <div className="cursor-pointer">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  loginMutation.mutate(credentialResponse.credential);
                }
              }}
              onError={() => {
                toast.error(t('error'));
              }}
              theme="filled_blue"
              shape="pill"
              text="signin_with"
              size="large"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
