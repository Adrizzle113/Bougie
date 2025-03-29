// src/components/authpages/reset/ResetPasswordForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/hooks';
import styles from './ResetPasswordForm.module.css';

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const { resetPassword, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      router.push(`/auth/reset-password/confirm?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error('Reset password error:', err);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.header}>Reset Password</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className={styles.button}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Reset Code'}
      </button>
    </form>
  );
}