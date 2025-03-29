// src/app/dashboard/admin/trips/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { LuxuryTripData, LuxuryTripModel } from '@/types/luxuryTrip.types';
import TripDetails from '@/components/admin/tripdetails/TripDetails';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export default function EditTripPage() {
  const params = useParams();
  const router = useRouter();
  const [tripData, setTripData] = useState<LuxuryTripModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/trips/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch trip');
        
        const result = await response.json();
        if (result.success) {
          setTripData(result.trip);
        } else {
          throw new Error(result.error || 'Failed to fetch trip');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading trip');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTrip();
    }
  }, [params.id]);

  const handleUpdateTrip = async (updatedTripData: LuxuryTripData) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/trips/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTripData),
      });

      if (!response.ok) {
        throw new Error('Failed to update trip');
      }

      const result = await response.json();
      if (result.success) {
        router.push(ROUTES.ADMIN.TRIPS);
      } else {
        throw new Error(result.error || 'Failed to update trip');
      }
    } catch (err) {
      console.error('Error updating trip:', err);
      setError(err instanceof Error ? err.message : 'Failed to update trip');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Card>
          <CardContent className="p-6">
            <div className="text-red-500 mb-4">{error}</div>
            <Button
              variant="outline"
              onClick={() => router.push(ROUTES.ADMIN.TRIPS)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div>
        <Card>
          <CardContent className="p-6">
            <div className="text-gray-500 mb-4">Trip not found</div>
            <Button
              variant="outline"
              onClick={() => router.push(ROUTES.ADMIN.TRIPS)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <TripDetails 
            id={params.id as string}
            initialData={tripData}
            onSave={handleUpdateTrip}
            loading={saving}
          />
        </CardContent>
      </Card>
    </div>
  );
}