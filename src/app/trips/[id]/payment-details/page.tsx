// app/trips/[id]/payment-details/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Route } from 'next';
import { Card, CardContent } from "@/components/ui/card";
import { BookingTopBar } from '@/components/bookingflow/BookingTopBar';
import type { BookingDetails } from '@/types/booking';
import type { Trip } from '@/types';

export default function PaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState<{
    trip: Trip;
    booking: BookingDetails;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Get booking details from localStorage
        const savedBooking = localStorage.getItem('bookingDetails');
        const savedPassengers = localStorage.getItem('passengerDetails');
        
        if (!savedBooking || !savedPassengers) {
          router.push(`/trips/${params.id}/book` as Route);
          return;
        }

        // Fetch trip data
        const response = await fetch(`/api/trips/${params.id}`);
        const tripData = await response.json();

        if (!tripData.success || !tripData.trip) {
          throw new Error('Failed to fetch trip data');
        }

        setBookingData({
          trip: tripData.trip,
          booking: JSON.parse(savedBooking)
        });
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load booking data');
      }
    }

    if (params.id) {
      loadData();
    }
  }, [params.id, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <BookingTopBar currentStep={3} />
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

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-white">
        <BookingTopBar currentStep={3} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center items-center">
                  <div className="h-8 w-8 rounded-full border-2 border-t-[#17403a] animate-spin" />
                  <p className="ml-3">Loading payment details...</p>
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
      <BookingTopBar currentStep={3} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-black mb-8">PAYMENT DETAILS</h1>
          {/* Add your payment form component here */}
          <Card>
            <CardContent className="p-6">
              <p>Payment form will go here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}