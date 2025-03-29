//components/bookingflow/BookingSidebar.tsx
'use client';

import { useState } from 'react';
import { AlertTriangle, Calendar } from 'lucide-react';
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
import { formatCurrency } from '@/lib/utils';
import type { SelectedRoom, PricingAddOn } from '@/types/pricing';
import type { Trip } from '@/types';

interface BookingSidebarProps {
  trip: Trip;
  selectedRoom?: SelectedRoom;
  selectedExtras?: string[];
  passengers?: number;
}

export function BookingSidebar({ 
  trip,
  selectedRoom,
  selectedExtras = [],
  passengers = 1
}: BookingSidebarProps) {
  const [promoCode, setPromoCode] = useState('');
  const pricing = trip?.pricing || {};
  const timing = trip?.timing || {};

  // Calculate total for the current configuration
  const calculateTotal = (): number => {
    const roomTotal = (selectedRoom?.price || 0) * passengers;
    
    const extrasTotal = selectedExtras.reduce((total, extraId) => {
      const extra = pricing.addOns?.find((addon: PricingAddOn) => addon.id === extraId);
      return total + (extra?.price || 0) * passengers;
    }, 0);

    return roomTotal + extrasTotal;
  };

  const total = calculateTotal();

  // Calculate deposit amount
  const calculateDeposit = (): number => {
    if (pricing.depositType === 'percentage') {
      return (total * pricing.deposit) / 100;
    }
    return pricing.deposit;
  };

  const deposit = calculateDeposit();

  // Handler for promo code apply
  const handleApplyPromo = () => {
    // Add promo code logic here
    console.log('Applying promo code:', promoCode);
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date TBD';
    }
  };

  return (
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
        {/* Trip Dates */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={20} />
            <span>Trip Dates</span>
          </div>
          <div className="font-medium">
            {formatDate(timing.startDate)} - {formatDate(timing.endDate)}
          </div>
          <div className="text-gray-600">
            {timing.location || 'Location TBD'}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span>Trip</span>
            <span>{passengers} {passengers === 1 ? 'person' : 'people'}</span>
          </div>
          
          <div className="space-y-2">
            {selectedRoom && (
              <div className="flex justify-between">
                <span>{selectedRoom.type}</span>
                <div className="text-right">
                  <div>{passengers} x {formatCurrency(selectedRoom.price)}</div>
                </div>
              </div>
            )}

            {selectedExtras.map(extraId => {
              const extra = pricing.addOns?.find((addon: PricingAddOn) => addon.id === extraId);
              if (!extra) return null;
              return (
                <div key={extraId} className="flex justify-between">
                  <span>{extra.name}</span>
                  <span>{passengers} x {formatCurrency(extra.price)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xl font-medium">Total</span>
            <div className="text-right">
              <div className="text-2xl font-medium">
                {formatCurrency(total)}
              </div>
            </div>
          </div>
          {deposit > 0 && (
            <div className="text-sm text-gray-600 text-right">
              or pay today just {formatCurrency(deposit)} deposit per person
            </div>
          )}
        </div>

        {/* Promo Code */}
        <div className="border-t pt-4">
          <div className="mb-2">Add discount or referral code</div>
          <div className="flex gap-2">
            <Input
              placeholder="Promo or referral code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button 
              variant="outline" 
              onClick={handleApplyPromo}
            >
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}