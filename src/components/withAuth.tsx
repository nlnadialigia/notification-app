'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

    useEffect(() => {
      if (!isAuthenticated()) {
        router.push('/login');
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated()) {
      return null;
    }

    return <Component {...props} />;
  };
}
