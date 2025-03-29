// src/app/trips/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TripDetails from '@/components/admin/tripdetails/TripDetails';
import { EMPTY_TRIP } from '@/lib/constants';

export default function CreateTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTrip = async (tripData: typeof EMPTY_TRIP) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tripData,
          status: 'draft'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      const result = await response.json();

      if (result.success) {
        router.push('/dashboard/admin/trips');
      } else {
        throw new Error(result.error || 'Failed to create trip');
      }
    } catch (err) {
      console.error('Error creating trip:', err);
      setError(err instanceof Error ? err.message : 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <TripDetails 
        initialData={EMPTY_TRIP}
        onSave={handleCreateTrip}
        loading={loading}
      />
    </div>
  );
}