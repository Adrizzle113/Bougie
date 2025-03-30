// src/app/auth/reset-password/confirm/page.tsx
'use client';

import { Suspense } from 'react';
import ResetConfirmForm from '@/components/authpages/reset/ResetConfirmationForm';
import styles from './page.module.css';

type PageProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function ResetPasswordConfirmPage({ searchParams }: PageProps) {
  const email = typeof searchParams.email === 'string' ? searchParams.email : '';

  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetConfirmForm userEmail={email} />
      </Suspense>
    </div>
  );
}