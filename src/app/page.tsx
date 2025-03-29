// src/app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8">
      <h1>Test Navigation</h1>
      <div className="flex flex-col gap-4 mt-4">
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
        <Link href="/auth/signup" className="text-blue-500 hover:underline">
          Go to Signup
        </Link>
      </div>
    </div>
  );
}