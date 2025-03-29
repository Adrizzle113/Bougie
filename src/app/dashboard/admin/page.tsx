// src/app/dashboard/admin/page.tsx
import { Metadata } from 'next';
import { AdminDashboardContext } from '@/components/dashboard/admin/AdminDashboardContext';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing trips and content'
}

export default function AdminDashboardPage() {
  return (
    <div>
      <AdminDashboardContext />
    </div>
  );
}