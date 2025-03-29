//components/bookingflow/BookingDashboard.tsx
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, AlertTriangle, Building2, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Itinerary from '@/components/itineraries/itinerarytemplate/days/itinerary';
import type { BookingDashboardProps } from '@/types/booking';
import { TripImage } from '@/types';

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < fullStars 
              ? 'text-yellow-400' 
              : i === fullStars && hasHalfStar 
              ? 'text-yellow-400' 
              : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-lg">{rating}</span>
    </div>
  );
};

export default function BookingDashboard({ tripData, children, currentStep = 1 }: BookingDashboardProps) {
  const [showItinerary, setShowItinerary] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const router = useRouter();
  const steps = ['Trip Overview', 'Extras', 'Passenger Details', 'Payment'];

  // Get the first image from the welcome section
  const mainImage = tripData.images.find((img: TripImage) => img.section === 'overview');

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <React.Fragment key={step}>
                  <span className={`font-medium ${
                    index + 1 === currentStep ? 'text-black' : 'text-gray-400'
                  }`}>
                    {`${index + 1}. ${step}`}
                  </span>
                  {index < steps.length - 1 && (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-right">
              <span className="text-gray-600">FREEPHONE</span>
              <div className="font-bold">1-800-367-1835</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-black">TRIP OVERVIEW</h1>
          <button className="flex items-center gap-2 border rounded-full px-4 py-2">
            <span>FAQs</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
          <div className="flex gap-8 mb-8">
              <div className="w-96">
                <img 
                  src={mainImage?.src ?? "/api/placeholder/400/320"}
                  alt={mainImage?.alt ?? tripData.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">{tripData.title}</h2>
                <StarRating rating={4.8} />
                <div className="mt-4 flex items-center gap-4">
                  <span>10 days, 9 nights</span>
                  <button 
                    onClick={() => setShowItinerary(!showItinerary)}
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    View Itinerary & Map
                    <span className="text-xl">↗</span>
                  </button>
                </div>
              </div>
            </div>

            {showItinerary && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <Itinerary items={tripData.itinerary} />
                </CardContent>
              </Card>
            )}

            {children}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Trip summary</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center text-blue-600">
                        <AlertTriangle size={20} />
                        <span className="ml-2">Important Trip Notes</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Important information about your trip</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pre-trip accommodation */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 size={20} />
                    <span>Pre-trip accommodation</span>
                  </div>
                  <div className="font-medium">Sat 14th Mar 2026 - Sun 15th Mar 2026</div>
                  <div className="text-gray-600">1 night, Single Room, AC Hotel Madrid Feria</div>
                </div>

                {/* Trip Start */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={20} />
                    <span>Trip Start</span>
                  </div>
                  <div className="font-medium">Sun, 15 March 2026</div>
                  <div className="text-gray-600">Madrid, Spain</div>
                </div>

                {/* Trip End */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={20} />
                    <span>Trip End</span>
                  </div>
                  <div className="font-medium">Tue, 24 March 2026</div>
                  <div className="text-gray-600">Madrid, Spain</div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Trip</span>
                    <span>1 person</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Twin Share Room</span>
                      <div className="text-right">
                        <div className="line-through text-gray-400">1 x US$ 2,235.00</div>
                        <div>1 x US$ 1,788.00</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Pre-accommodation (1)</span>
                      <span>1 x US$ 160.00</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-medium">Total</span>
                    <div className="text-right">
                      <div className="line-through text-gray-400">US$ 2,395.00</div>
                      <div className="text-2xl font-medium">US$ 1,948.00</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 text-right">
                    or pay today just $ 200 deposit per person
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center text-indigo-600 font-medium">
                    <span>Your Total Saving</span>
                    <span>US$ 447.00</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="mb-2">Add discount or referral code</div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo or referral code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
