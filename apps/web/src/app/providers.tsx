'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { setApiConfig } from '@medagil/api-client';

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setApiConfig({
      baseUrl,
      getToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('user_token') ?? null;
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
