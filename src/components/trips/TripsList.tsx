// src/components/trips/TripsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Plus, Eye, PencilIcon } from 'lucide-react';
import styles from './TripList.module.css';

interface Trip {
  id: string;
  title: string;
  subtitle?: string;
  status: 'draft' | 'published' | 'archived';
  date: string;
  images?: {
    src: string;
    alt: string;
  }[];
  type: 'group' | 'private';
}

export default function TripsList() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips');
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      const data = await response.json();
      if (data.success) {
        setTrips(data.trips);
      } else {
        throw new Error(data.error || 'Failed to fetch trips');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const filterTrips = (tripsToFilter: Trip[]) => {
    return tripsToFilter.filter(trip => {
      const titleLower = trip.title?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = titleLower.includes(searchLower);
      const matchesFilter = activeFilter === 'all' || 
                        (activeFilter === 'group' && trip.type === 'group') ||
                        (activeFilter === 'private' && trip.type === 'private') ||
                        (activeFilter === 'draft' && trip.status === 'draft') ||
                        (activeFilter === 'published' && trip.status === 'published');
      return matchesSearch && matchesFilter;
    });
  };

  const handleViewItinerary = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    router.push(`/itineraries/${id}`);
  };

  const filteredTrips = filterTrips(trips);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>Trips</h1>
        <Button
          onClick={() => router.push('/dashboard/admin/trips/new')}
          className={styles.createButton}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Trip
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <Input
            type="text"
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterButtons}>
          {['all', 'group', 'private', 'draft', 'published'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className={`${styles.filterButton} ${activeFilter === filter ? styles.activeFilter : ''}`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>
          {error}
        </div>
      ) : (
        <div className={styles.tripGrid}>
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => router.push(`/dashboard/admin/trips/${trip.id}/edit`)}
              className={styles.tripCard}
            >
              <Card className={styles.card}>
                <div className={styles.imageWrapper}>
                  {trip.status === 'draft' && (
                    <div className={styles.draftBadge}>
                      <span>Draft</span>
                    </div>
                  )}
                  <div className={styles.imageOverlay} />
                  <img
                    src={trip.images?.[0]?.src || '/api/placeholder/400/320'}
                    alt={trip.images?.[0]?.alt || trip.title}
                    className={styles.image}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.tripTitle}>{trip.title}</h3>
                  <p className={styles.tripDate}>
                    {new Date(trip.date).toLocaleDateString()}
                  </p>
                  <div className={styles.cardActions}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleViewItinerary(trip.id, e)}
                      className="mr-2"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Itinerary
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/admin/trips/${trip.id}/edit`);
                      }}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {filteredTrips.length === 0 && !loading && !error && (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>No trips found.</p>
          <p className={styles.emptyStateText}>Create your first trip to get started.</p>
        </div>
      )}
    </div>
  );
}