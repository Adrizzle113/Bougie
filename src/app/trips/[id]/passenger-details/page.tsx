// app/trips/[id]/passenger-details/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PassengerDetails from '@/components/bookingflow/PassengerDetails';
import { Card, CardContent } from "@/components/ui/card";
import { BookingTopBar } from '@/components/bookingflow/BookingTopBar';
import type { BookingDetails } from '@/types/booking';
import type { Trip } from '@/types';

interface TripAndBooking {
  tripData: Trip;
  passengers: number;
  selectedRoom?: {
    type: string;
    price: number;
    description?: string;
  };
  selectedExtras: string[];
}

export default function PassengerDetailsPage() {
  const params = useParams();
  const [tripData, setTripData] = useState<TripAndBooking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTripData() {
      try {
        // First try to get from localStorage
        const savedBooking = localStorage.getItem('bookingDetails');
        if (savedBooking) {
          const parsedBooking = JSON.parse(savedBooking) as BookingDetails;
          const response = await fetch(`/api/trips/${params.id}`);
          const tripResponse = await response.json();
          
          if (!tripResponse.success || !tripResponse.trip) {
            throw new Error('Failed to fetch trip data');
          }

          setTripData({
            tripData: tripResponse.trip,
            passengers: parsedBooking.passengers,
            selectedRoom: parsedBooking.selectedRoom,
            selectedExtras: parsedBooking.selectedExtras
          });
          return;
        }

        throw new Error('No booking details found');
      } catch (err: any) {
        console.error('Error fetching trip data:', err);
        setError(err.message || 'Failed to load trip data');
      }
    }

    if (params.id) {
      fetchTripData();
    }
  }, [params.id]);

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <BookingTopBar currentStep={2} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-red-600">{error}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="min-h-screen bg-white">
        <BookingTopBar currentStep={2} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center items-center">
                  <div className="h-8 w-8 rounded-full border-2 border-t-[#17403a] animate-spin" />
                  <p className="ml-3">Loading booking details...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <PassengerDetails {...tripData} />
    </main>
  );
}