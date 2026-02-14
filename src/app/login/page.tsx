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

export default function LoginPage() {
  const router = useRouter();
  const {setAuth, isAuthenticated} = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const loginMutation = useMutation({
    mutationFn: async (credential: string) => {
      // Login with backend using the ID token
      return authApi.loginWithGoogle(credential);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      toast.success('Bem-vindo!', {
        description: `Logado como ${data.user.email}`,
      });
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast.error('Falha no login', {
        description: error.response?.data?.message || 'Por favor, tente novamente',
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-950 dark:to-purple-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-fuchsia-600 rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl">Real-Time Notifications</CardTitle>
          <CardDescription>
            Entre com sua conta Google para começar
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
                toast.error('Falha no login com Google');
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
