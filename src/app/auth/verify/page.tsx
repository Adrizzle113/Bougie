// src/app/auth/verify/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import VerifyForm from '@/components/authpages/verify/VerifyForm';
import ImageSlider from '@/components/authpages/layout/ImageSlider';
import styles from './page.module.css';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <>
      <ImageSlider />
      <div className={styles.container}>
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyForm userEmail={email} />
        </Suspense>
      </div>
    </>
  );
}