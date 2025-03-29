// src/components/RootWrapper.tsx
'use client';

import '@/app/globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

export function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}