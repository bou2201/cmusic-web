'use client';

import { useAuthStore } from '@/modules/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

const MINUTE = 1000 * 60;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 30 * MINUTE,
      staleTime: 25 * MINUTE,
      retry: 2,
      retryDelay: 2000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const rehydrate = useAuthStore((state) => state.loadFromCookies);

  useEffect(() => {
    rehydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
