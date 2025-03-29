// components/bookingflow/PassengerDetails.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingTopBar } from './BookingTopBar';
import { BookingSidebar } from './BookingSidebar';
import PassengerForm from './PassengerForm';

interface PassengerDetailsProps {
  tripData: any;
}

export default function PassengerDetails({ tripData }: PassengerDetailsProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the trip data for debugging
    console.log('Trip Data in PassengerDetails:', tripData);
  }, [tripData]);

  return (
    <>
      <BookingTopBar currentStep={2} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-black">PASSENGER DETAILS</h1>
            <button className="flex items-center gap-2 border rounded-full px-4 py-2">
              <span>FAQs</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="flex-1">
              <PassengerForm 
                tripData={tripData}
                onComplete={(passengerData) => {
                  // Save passenger data to localStorage
                  localStorage.setItem('passengerDetails', JSON.stringify(passengerData));
                  // Navigate to payment page
                  router.push(`/trips/${tripData.tripData.id}/payment`);
                }}
              />
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-96">
              <BookingSidebar 
                trip={tripData.tripData}
                selectedRoom={tripData.selectedRoom}
                selectedExtras={tripData.selectedExtras}
                passengers={tripData.passengers}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}