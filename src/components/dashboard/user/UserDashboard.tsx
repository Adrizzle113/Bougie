// src/components/dashboard/user/UserDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { fetchUserAttributes, signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import styles from './UserDashboard.module.css';

interface UserProfile {
  given_name?: string;
  family_name?: string;
  email?: string;
}

interface Trip {
  id: string;
  title: string;
  subtitle?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  date: string;
  location?: string;
}

export default function UserDashboard() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const attributes = await fetchUserAttributes();
        setUserData(attributes);
      } catch (error) {
        console.error('Error loading user data:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleNewTrip = () => {
    router.push('/dashboard/user/trips/new' as Route);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Mock trip data - replace with real data later
  const mockTrips: Trip[] = [
    {
      id: '1',
      title: 'Upcoming Adventure',
      subtitle: 'Explore new destinations',
      status: 'upcoming',
      date: '2025-02-15',
      location: 'Paris, France'
    },
    {
      id: '2',
      title: 'Summer Getaway',
      subtitle: 'Beach vacation',
      status: 'upcoming',
      date: '2025-07-01',
      location: 'Bali, Indonesia'
    }
  ];

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <h1>Welcome, {userData?.given_name || 'Traveler'}!</h1>
          <p>{userData?.email}</p>
        </div>
        <button onClick={handleSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.dashboardSection}>
          <h2>Your Upcoming Trips</h2>
          <div className={styles.tripGrid}>
            {mockTrips.map((trip) => (
              <div key={trip.id} className={styles.tripCard}>
                <div className={styles.tripHeader}>
                  <h3>{trip.title}</h3>
                  <span className={`${styles.status} ${styles[trip.status]}`}>
                    {trip.status}
                  </span>
                </div>
                <div className={styles.tripContent}>
                  {trip.subtitle && <p>{trip.subtitle}</p>}
                  <div className={styles.tripDetails}>
                    <span>{trip.location}</span>
                    <span>{new Date(trip.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.dashboardSection}>
          <h2>Quick Actions</h2>
          <div className={styles.actionGrid}>
          <button onClick={handleNewTrip}>
           Create New Trip
         </button>
            <button onClick={() => router.push('/dashboard/user/profile')} 
                    className={styles.actionButton}>
              Edit Profile
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}