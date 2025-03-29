// src/components/dashboard/admin/AdminDashboardContext.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, PencilIcon } from 'lucide-react';
import styles from './AdminDashboard.module.css';

export function AdminDashboardContext(): React.JSX.Element {
  const router = useRouter();

  const mockStats = {
    totalTrips: 25,
    activeTrips: 8,
    draftTrips: 5,
    publishedTrips: 12,
    recentTrips: [
      {
        id: '1',
        title: 'Paris Adventure',
        subtitle: 'Experience the City of Light'
      },
      {
        id: '2',
        title: 'Tokyo Explorer',
        subtitle: 'Discover Modern Japan'
      },
      {
        id: '3',
        title: 'Rome Holiday',
        subtitle: 'Walk Through History'
      }
    ]
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>Admin Dashboard</h1>
          </div>
          <button
            className={styles.createButton}
            onClick={() => router.push('/dashboard/admin/trips/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Trip
          </button>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.primary}`}>
            <h3 className={styles.statTitle}>Active Trips</h3>
            <p className={`${styles.statValue} ${styles.primary}`}>{mockStats.activeTrips}</p>
          </div>

          <div className={`${styles.statCard} ${styles.secondary}`}>
            <h3 className={styles.statTitle}>Draft Trips</h3>
            <p className={`${styles.statValue} ${styles.secondary}`}>{mockStats.draftTrips}</p>
          </div>

          <div className={`${styles.statCard} ${styles.primary}`}>
            <h3 className={styles.statTitle}>Published Trips</h3>
            <p className={`${styles.statValue} ${styles.primary}`}>{mockStats.publishedTrips}</p>
          </div>
        </div>

        {/* Recent Trips */}
        <div className={styles.recentTrips}>
          <h3 className={styles.recentTripsTitle}>Recent Trips</h3>
          <div>
            {mockStats.recentTrips.map((trip) => (
              <div key={trip.id} className={styles.tripItem}>
                <div className={styles.tripDetails}>
                  <h4>{trip.title}</h4>
                  <p>{trip.subtitle}</p>
                </div>
                <div className={styles.tripActions}>
                  <button
                    className={styles.viewButton}
                    onClick={() => window.open(`/trips/${trip.id}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => router.push(`/dashboard/admin/trips/edit/${trip.id}`)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardContext;