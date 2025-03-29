// src/components/navigation/admin/Layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await getCurrentUser();
      const attributes = await fetchUserAttributes();
      // Specifically use given_name, fallback to email if not available
      setUserName(attributes.given_name || '');
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
      <TopNav 
        onMenuClick={() => setIsSidebarOpen(true)} 
        userName={userName}
        onSignOut={handleSignOut}
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <main className="ml-64 pt-16 min-h-screen bg-[#ededed] p-6">
        {children}
      </main>
    </div>
  );
}