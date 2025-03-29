// src/components/providers/AuthProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import { configureAmplify } from '@/lib/auth/amplify-config';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (!isConfigured) {
      configureAmplify();
      setIsConfigured(true);
    }
  }, [isConfigured]);

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}