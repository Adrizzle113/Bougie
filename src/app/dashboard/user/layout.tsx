// src/app/dashboard/user/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth';
import { UserTopNav } from '@/components/navigation/user/UserTopNav';
import { UserSidebar } from '@/components/navigation/user/UserSidebar';

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{
    given_name?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await getCurrentUser();
      const attributes = await fetchUserAttributes();
      setUserData(attributes);
    } catch (error) {
      console.log('Auth check failed, redirecting to login');
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ededed]">
      <UserTopNav 
        onMenuClick={() => setIsSidebarOpen(true)}
        userName={userData?.given_name || ''}
        onSignOut={handleSignOut}
      />
      
      <UserSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="pl-64 pt-16 min-h-screen bg-[#ededed]">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}