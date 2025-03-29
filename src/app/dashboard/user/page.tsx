// src/app/dashboard/user/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import UserDashboard from '@/components/dashboard/user/UserDashboard';

export default function UserDashboardPage() {
  const [userData, setUserData] = useState<{
    given_name?: string;
    family_name?: string;
    email?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const attributes = await fetchUserAttributes();
        setUserData(attributes);
      } catch (error) {
        console.error('Error loading user data:', error);
        window.location.assign('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Just return the UserDashboard component without any props
  return <UserDashboard />;
}