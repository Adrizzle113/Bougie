// app/trips/[id]/payment/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import PassengerDetails from '@/components/bookingflow/PassengerDetails';
import type { BookingDetails } from '@/types/booking';
import type { Trip } from '@/types';

interface PageProps {
  params: { id: string };
}

export default function PaymentPage({ params }: PageProps) {
  const [tripData, setTripData] = useState<Trip | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load booking details from localStorage
    const storedBookingDetails = localStorage.getItem('bookingDetails');
    if (!storedBookingDetails) {
      router.push(`/trips/${params.id}/book` as Route);
      return;
    }

    const parsedBookingDetails = JSON.parse(storedBookingDetails);
    setBookingDetails(parsedBookingDetails);

    // Fetch trip data
    const fetchTripData = async () => {
      try {
        const response = await fetch(`/api/trips/${params.id}`);
        const data = await response.json();

        if (!data.success || !data.trip) {
          router.push('/404' as Route);
          return;
        }

        setTripData(data.trip);
      } catch (error) {
        console.error('Error fetching trip data:', error);
        router.push('/404' as Route);
      }
    };

    fetchTripData();
  }, [params.id, router]);

  const handlePaymentComplete = () => {
    // Handle payment completion
    router.push(`/trips/${params.id}/confirmation` as Route);
  };

  if (!tripData || !bookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <PassengerDetails
          trip={tripData}
          initialPassengers={bookingDetails.passengers}
          onComplete={handlePaymentComplete}
        />
      </div>
    </div>
  );
}