// src/components/authpages/verify/VerifyForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/hooks';
import styles from './VerifyForm.module.css';

interface VerifyFormProps {
  userEmail: string;
}

interface CognitoError extends Error {
  name: string;
  message: string;
  code?: string;
}

export default function VerifyForm({ userEmail }: VerifyFormProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { confirmSignUp, resendSignUp, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await confirmSignUp(userEmail, code);
      // After successful verification, redirect to user dashboard
      router.push('/dashboard/user');
    } catch (err) {
      console.error('Verification error:', err);
      const cognitoError = err as CognitoError;
      
      switch (cognitoError.name) {
        case 'CodeMismatchException':
          setError('Invalid verification code. Please try again.');
          break;
        case 'ExpiredCodeException':
          setError('This code has expired. Please request a new one.');
          break;
        case 'UserLambdaValidationException':
          // Even if there's a Lambda trigger error, the user is likely verified
          setError('Account verified. Redirecting to dashboard...');
          setTimeout(() => router.push('/dashboard/user'), 2000);
          break;
        case 'LimitExceededException':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError(cognitoError.message || 'An error occurred during verification');
      }
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignUp(userEmail);
      setError('A new verification code has been sent to your email.');
    } catch (err) {
      console.error('Resend code error:', err);
      const cognitoError = err as CognitoError;
      setError(cognitoError.message || 'Failed to resend verification code');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.header}>Verify Your Email</h1>
      
      {error && (
        <div className={`${styles.error} ${
          error.includes('Redirecting') ? styles.success : ''
        }`}>
          {error}
        </div>
      )}
      
      <div className={styles.inputGroup}>
        <label htmlFor="code">Verification Code</label>
        <input
          id="code"
          type="text"
          className={styles.input}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          required
        />
        <p className={styles.helperText}>
          Please check your email for the verification code
        </p>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className={styles.loadingSpinner}>
              Verifying...
            </span>
          ) : (
            'Verify Email'
          )}
        </button>

        <button
          type="button"
          onClick={handleResendCode}
          className={`${styles.button} ${styles.secondary}`}
          disabled={isLoading}
        >
          Resend Code
        </button>
      </div>

      <div className={styles.footer}>
        <p>
          Didn't receive the code? Check your spam folder or click "Resend Code"
        </p>
      </div>
    </form>
  );
}