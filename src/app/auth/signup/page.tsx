// src/app/auth/signup/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import SignupForm from '@/components/authpages/signup/SignupForm';
import { AuthProvider } from '@/components/providers/AuthProvider';

export default function SignupPage() {
  const router = useRouter();

  return (
    <AuthProvider>
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
        <SignupForm />
      </div>
    </AuthProvider>
  );
}