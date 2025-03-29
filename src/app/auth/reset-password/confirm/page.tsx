// src/app/auth/reset-password/confirm/page.tsx
'use client';

import { Suspense } from 'react';
import ResetConfirmForm from '@/components/authpages/reset/ResetConfirmationForm';
import styles from './page.module.css';

interface PageProps {
  searchParams: { email?: string };
}

export default function ResetPasswordConfirmPage({ searchParams }: PageProps) {
  const email = searchParams.email || '';

  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetConfirmForm userEmail={email} />
      </Suspense>
    </div>
  );
}