// src/components/authpages/reset/ResetConfirmationForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/hooks';
import styles from './ResetPasswordForm.module.css';

interface ResetConfirmationFormProps {
  userEmail: string;
}

export default function ResetConfirmationForm({ userEmail }: ResetConfirmationFormProps) {
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { confirmResetPassword, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      // Handle password mismatch
      return;
    }

    try {
      await confirmResetPassword({
        username: userEmail,
        newPassword: formData.newPassword,
        confirmationCode: formData.code
      });
      router.push('/auth/login');
    } catch (err) {
      console.error('Reset password confirmation error:', err);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.header}>Reset Password</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.inputGroup}>
        <label htmlFor="code">Verification Code</label>
        <input
          id="code"
          type="text"
          className={styles.input}
          value={formData.code}
          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          className={styles.input}
          value={formData.newPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          className={styles.input}
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          required
        />
      </div>

      <button
        type="submit"
        className={styles.button}
        disabled={isLoading}
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </button>
    </form>
  );
}