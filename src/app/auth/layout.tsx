// src/app/auth/layout.tsx
'use client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}