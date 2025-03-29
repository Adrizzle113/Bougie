// src/app/auth/verify/page.tsx
import { Suspense } from 'react';
import VerifyForm from '@/components/authpages/verify/VerifyForm';
import ImageSlider from '@/components/authpages/layout/ImageSlider';
import styles from './page.module.css';

export default function VerifyPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const email = searchParams.email || '';

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
