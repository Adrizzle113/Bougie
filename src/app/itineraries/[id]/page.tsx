// src/app/itineraries/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { AdminTrip } from '@/types/trip';
import LuxuryTravelPage from '@/components/itineraries/LuxuryTravelPage';
import { Loader2 } from 'lucide-react';

export default function TripItineraryPage() {
  const params = useParams();
  const [tripData, setTripData] = useState<AdminTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!params.id) return;

      try {
        const response = await fetch(`/api/trips/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trip details');
        }

        const data = await response.json();
        if (data.success && data.trip) {
          // Ensure overview is a string before passing to AdminTrip
          const processedTrip: AdminTrip = {
            ...data.trip,
            overview: data.trip.overview || '' // Provide default empty string if undefined
          };
          setTripData(processedTrip);
        } else {
          throw new Error(data.error || 'Failed to load trip');
        }
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Trip not found'}
          </h2>
          <p className="text-gray-500">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return <LuxuryTravelPage tripData={tripData} />;
}