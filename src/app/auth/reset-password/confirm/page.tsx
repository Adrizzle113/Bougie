// src/app/auth/reset-password/confirm/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ResetConfirmForm from '@/components/authpages/reset/ResetConfirmationForm';
import styles from './page.module.css';

export default function ResetPasswordConfirmPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetConfirmForm userEmail={email} />
      </Suspense>
    </div>
  );
}