// src/app/trips/[id]/book/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import BookingFlow from '@/components/bookingflow/BookingFlow';
import type { Trip, RoomRate, PricingAddOn } from '@/types';

interface PageProps {
  params: { id: string };
}

interface ApiRoomRate {
  id: string;
  type: 'single' | 'double' | 'triple' | 'quad';
  price: number;
  description?: string;
  isAvailable: boolean;
}

interface ApiResponse {
  success: boolean;
  trip: {
    id: string;
    title: string;
    subtitle?: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    date: string;
    startDate: string;
    endDate: string;
    timing: {
      startDate: string;
      endDate: string;
      location?: string;
    };
    pricing?: {
      basePrice: number;
      deposit: number;
      depositType: 'percentage' | 'fixed';
      addOns: PricingAddOn[];
      roomRates: ApiRoomRate[];
    };
    itinerary: any[];
    included: string[];
    excluded: string[];
    mapLocations: any[];
    terms: string;
    images: any[];
    travelBrief: {
      description: string;
      accommodations: any[];
      flights: {
        arrival: string;
        departure: string;
        notes: string;
      };
      mapUrl: string;
    };
  };
}

const transformRoomRate = (rate: ApiRoomRate): RoomRate => ({
  ...rate,
  description: rate.description || `${rate.type} Room`
});

export default function BookPage({ params }: PageProps) {
  const [tripData, setTripData] = useState<{ success: boolean; trip: Trip } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`/api/trips/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch trip data');

        const data: ApiResponse = await response.json();

        if (!data.success || !data.trip) {
          router.push('/auth/login' as Route);
          return;
        }

        // Transform API response to match Trip type
        const transformedTrip: Trip = {
          ...data.trip,
          status: data.trip.status,
          date: data.trip.date,
          startDate: data.trip.startDate,
          endDate: data.trip.endDate,
          timing: {
            startDate: data.trip.timing.startDate,
            endDate: data.trip.timing.endDate,
            location: data.trip.timing.location
          },
          pricing: data.trip.pricing ? {
            ...data.trip.pricing,
            roomRates: data.trip.pricing.roomRates.map(transformRoomRate)
          } : {
            basePrice: 0,
            deposit: 0,
            depositType: 'fixed',
            addOns: [],
            roomRates: []
          },
          itinerary: data.trip.itinerary,
          included: data.trip.included,
          excluded: data.trip.excluded,
          mapLocations: data.trip.mapLocations,
          terms: data.trip.terms,
          images: data.trip.images,
          travelBrief: data.trip.travelBrief
        };

        setTripData({
          success: true,
          trip: transformedTrip
        });
      } catch (error) {
        console.error('Error fetching trip data:', error);
        router.push('/404' as Route);
      }
    };

    fetchTripData();
  }, [params.id, router]);

  if (!tripData) {
    return <div>Loading...</div>;
  }

  return <BookingFlow tripData={tripData} />;
}