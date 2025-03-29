// src/app/dashboard/admin/layout.tsx
'use client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main>
        {children}
      </main>
    </div>
  );
}