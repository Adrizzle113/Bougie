// src/app/auth/reset-password/page.tsx
'use client';

import { Suspense } from 'react';
import ResetPasswordForm from '@/components/authpages/reset/ResetPasswordForm';
import styles from './page.module.css';

export default function ResetPasswordPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}