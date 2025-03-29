//components/bookingflow/BookingFlow.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookingTopBar } from './BookingTopBar';
import { BookingSidebar } from './BookingSidebar';
import RoomSelector from './RoomSelector';
import type { SelectedRoom } from '@/types/pricing';
import type { Trip, TripImage } from '@/types';

interface BookingFlowProps {
  tripData: {
    success: boolean;
    trip: Trip;
  };
}

const BookingFlow: React.FC<BookingFlowProps> = ({ tripData }) => {
  const router = useRouter();
  const [passengers, setPassengers] = useState<number>(1);
  const [roomType, setRoomType] = useState<string>('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  // Get selected room details for sidebar
  const getSelectedRoomDetails = (): SelectedRoom | undefined => {
    if (!roomType) return undefined;
    
    const roomRate = tripData?.trip?.pricing?.roomRates.find(r => r.type === roomType);
    if (!roomRate) return undefined;
    
    return {
      type: roomRate.description || roomRate.type,
      price: roomRate.price,
      description: roomRate.description
    };
  };

  // Calculate total price
  const calculateTotal = (): number => {
    const selectedRoom = getSelectedRoomDetails();
    const roomPrice = selectedRoom?.price ?? 0;
    
    const extrasTotal = selectedExtras.reduce((total: number, extraId: string) => {
      const extra = tripData?.trip?.pricing?.addOns.find(addon => addon.id === extraId);
      return total + (extra?.price || 0);
    }, 0);

    return (roomPrice + extrasTotal) * passengers;
  };

  // Calculate deposit
  const calculateDeposit = (): number => {
    const total = calculateTotal();
    const pricing = tripData?.trip?.pricing;
    
    if (!pricing) return 0;
    
    if (pricing.depositType === 'percentage') {
      return (total * pricing.deposit) / 100;
    }
    return pricing.deposit;
  };

  const handleContinue = () => {
    const bookingDetails = {
      tripId: tripData.trip.id,
      passengers,
      roomType,
      selectedExtras,
      selectedRoom: getSelectedRoomDetails(),
      totalPrice: calculateTotal(),
      depositAmount: calculateDeposit()
    };
    
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    router.push(`/trips/${tripData.trip.id}/passenger-details` as Route);
  };

  const availableRoomRates = tripData?.trip?.pricing?.roomRates.filter(rate => rate.isAvailable) || [];



  return (
    <div className="min-h-screen bg-white">
      <BookingTopBar currentStep={1} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <Card>
                <CardContent className="space-y-6 pt-6">
                  {/* Passengers Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Passengers
                    </label>
                    <Select
                      value={passengers.toString()}
                      onValueChange={(value) => {
                        setPassengers(parseInt(value));
                        setRoomType('');
                      }}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Select passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Passenger' : 'Passengers'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Room Selection */}
                  <RoomSelector
                    passengers={passengers}
                    selectedRoomType={roomType}
                    onRoomSelect={setRoomType}
                    roomRates={availableRoomRates}
                  />

                  {/* Continue Button */}
                  <div className="border-t pt-6">
                    <Button
                      onClick={handleContinue}
                      className="w-full bg-[#17403a] hover:bg-[#0f2d28] text-white"
                      size="lg"
                      disabled={!roomType}
                    >
                      Continue to Passenger Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-96">
              <BookingSidebar 
                trip={tripData.trip}
                selectedRoom={getSelectedRoomDetails()}
                selectedExtras={selectedExtras}
                passengers={passengers}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;