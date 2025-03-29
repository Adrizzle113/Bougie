// src/app/dashboard/admin/trips/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import type { AdminTrip } from '@/types';
import TripDetails from '@/components/admin/tripdetails/TripDetails';
import type { Route } from 'next';

const DEFAULT_TRIP: AdminTrip = {
  id: crypto.randomUUID(),
  title: '',
  subtitle: '',
  overview: '',
  status: 'draft',
  date: new Date().toISOString(),
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  timing: {
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    location: ''
  },
  pricing: {
    basePrice: 0,
    deposit: 0,
    depositType: 'fixed',
    addOns: [],
    roomRates: []
  },
  images: [],
  travelBrief: {
    description: '',
    accommodations: [],
    flights: {
      arrival: '',
      departure: '',
      notes: ''
    },
    mapUrl: ''
  },
  itinerary: [],
  included: [],
  excluded: [],
  mapLocations: [],
  terms: '',
  highlights: [],
  tags: []
};

export default function NewTripPage() {
  const router = useRouter();

  const handleSave = async (tripData: AdminTrip) => {
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      const data = await response.json();
      router.push(`/dashboard/admin/trips/${data.id}` as Route);
    } catch (error) {
      console.error('Error creating trip:', error);
      // Handle error appropriately
    }
  };

  return <TripDetails id={undefined} initialData={DEFAULT_TRIP} onSave={handleSave} />;
}