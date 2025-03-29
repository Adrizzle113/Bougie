// src/components/ui/form-input.tsx
import React from 'react';
import styles from './form-input.module.css';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function FormField({ label, error, children, required, className = '' }: FormFieldProps) {
  return (
    <div className={`${styles.formField} ${className}`}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}