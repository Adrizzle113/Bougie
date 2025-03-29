// src/components/authpages/signup/SignupForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/hooks';
import styles from './SignupForm.module.css';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  given_name: string;
  family_name: string;
  name: string;
  nickname: string;
  picture: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    given_name: '',
    family_name: '',
    name: '',
    nickname: '',
    picture: 'https://example.com/default-profile.jpg'
  });
  
  const { signUp, isLoading, error } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates: FormData = {
        ...prev,
        [name]: value
      };
      
      if (name === 'given_name' || name === 'family_name') {
        updates.name = `${name === 'given_name' ? value : prev.given_name} ${name === 'family_name' ? value : prev.family_name}`.trim();
        if (!prev.nickname && name === 'given_name') {
          updates.nickname = value;
        }
      }
      
      return updates;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // Handle password mismatch
      return;
    }

    try {
      await signUp(formData);
      router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.header}>Create Account</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.inputGroup}>
        <label htmlFor="given_name">First Name</label>
        <input
          id="given_name"
          name="given_name"
          type="text"
          className={styles.input}
          value={formData.given_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="family_name">Last Name</label>
        <input
          id="family_name"
          name="family_name"
          type="text"
          className={styles.input}
          value={formData.family_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="nickname">Nickname (Optional)</label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          className={styles.input}
          value={formData.nickname}
          onChange={handleChange}
          placeholder="Your preferred name"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className={styles.input}
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className={styles.input}
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className={styles.input}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className={styles.button}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>

      <div className={styles.loginLink}>
        Already have an account?{' '}
        <Link href="/auth/login">Sign in</Link>
      </div>
    </form>
  );
}