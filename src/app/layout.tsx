// src/app/layout.tsx
'use client';

import { Suspense } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { configureAmplify } from '@/lib/auth/amplify-config';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  configureAmplify();

  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}