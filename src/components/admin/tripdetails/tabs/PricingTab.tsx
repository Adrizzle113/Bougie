// src/components/admin/tripdetails/tabs/PricingTab.tsx
'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';
import type { RoomRate, PricingAddOn, TripPricing } from '@/types/pricing';
import type { LuxuryTripData } from '@/types/luxuryTrip.types';

const DEFAULT_ROOM_RATES: RoomRate[] = [
  {
    id: crypto.randomUUID(),
    type: 'single',
    price: 0,
    description: 'Single occupancy room',
    isAvailable: true
  },
  {
    id: crypto.randomUUID(),
    type: 'double',
    price: 0,
    description: 'Double occupancy room',
    isAvailable: true
  },
  {
    id: crypto.randomUUID(),
    type: 'triple',
    price: 0,
    description: 'Triple occupancy room',
    isAvailable: true
  },
  {
    id: crypto.randomUUID(),
    type: 'quad',
    price: 0,
    description: 'Quad occupancy room',
    isAvailable: true
  }
];

const STANDARD_ADDONS: PricingAddOn[] = [
  {
    id: 'airport-transfer',
    name: 'Airport Transfer',
    description: 'Round-trip private airport transfers',
    price: 150,
    optional: true,
  },
  {
    id: 'travel-insurance',
    name: 'Travel Insurance',
    description: 'Comprehensive travel insurance coverage',
    price: 250,
    optional: true,
  },
  {
    id: 'premium-upgrade',
    name: 'Premium Upgrade',
    description: 'Access to premium experiences and exclusive amenities',
    price: 500,
    optional: true,
  }
];

const DEFAULT_PRICING: TripPricing = {
  basePrice: 0,
  deposit: 0,
  depositType: 'fixed',
  addOns: STANDARD_ADDONS,
  roomRates: DEFAULT_ROOM_RATES
};

interface PricingTabProps {
  tripData: LuxuryTripData;
  updateField: (key: keyof LuxuryTripData, value: any) => void;
}

export default function PricingTab({ tripData, updateField }: PricingTabProps) {
  // Ensure we have a valid pricing object with all required fields
  const pricing: TripPricing = {
    ...DEFAULT_PRICING,
    ...(tripData.pricing || {})
  };

  const updatePricing = (updates: Partial<TripPricing>) => {
    const updatedPricing: TripPricing = {
      ...pricing,
      ...updates
    };
    updateField('pricing', updatedPricing);
  };

  const handleUpdateRoomRate = (id: string, updates: Partial<RoomRate>) => {
    const updatedRates = pricing.roomRates.map((r: RoomRate) =>
      r.id === id ? { ...r, ...updates } : r
    );
    updatePricing({ roomRates: updatedRates });
  };

  const handleUpdateAddOn = (id: string, updates: Partial<PricingAddOn>) => {
    const updatedAddOns = pricing.addOns.map((a: PricingAddOn) =>
      a.id === id ? { ...a, ...updates } : a
    );
    updatePricing({ addOns: updatedAddOns });
  };

  const handleAddCustomAddOn = () => {
    const newAddOn: PricingAddOn = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      price: 0,
      optional: true
    };
    updatePricing({ 
      addOns: [...pricing.addOns, newAddOn] 
    });
  };

  const handleRemoveAddOn = (id: string) => {
    if (STANDARD_ADDONS.some(addon => addon.id === id)) return;
    const updatedAddOns = pricing.addOns.filter(a => a.id !== id);
    updatePricing({ addOns: updatedAddOns });
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Room Prices</h3>
            <p className="text-sm text-gray-500">Set prices for different room types</p>
            <div className="space-y-4">
              {pricing.roomRates.map((rate: RoomRate) => (
                <div key={rate.id} className="p-4 border rounded-lg space-y-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          id={`available-${rate.id}`}
                          checked={rate.isAvailable}
                          onChange={(e) => handleUpdateRoomRate(rate.id, { 
                            isAvailable: e.target.checked 
                          })}
                          className="h-4 w-4 text-[#17403a] border-gray-300 rounded focus:ring-[#17403a]"
                        />
                        <label htmlFor={`available-${rate.id}`} className="text-sm font-medium text-gray-700">
                          Available for booking
                        </label>
                      </div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Type
                      </label>
                      <select
                        value={rate.type}
                        disabled
                        className="w-full rounded-md border border-gray-300 p-2 bg-gray-100"
                      >
                        <option value="single">Single Room</option>
                        <option value="double">Double Room</option>
                        <option value="triple">Triple Room</option>
                        <option value="quad">Quad Room</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price per Person
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <Input
                          type="number"
                          value={rate.price}
                          onChange={(e) => handleUpdateRoomRate(rate.id, { 
                            price: Number(e.target.value) 
                          })}
                          className="pl-7"
                          placeholder="Room price"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      value={rate.description}
                      onChange={(e) => handleUpdateRoomRate(rate.id, { 
                        description: e.target.value 
                      })}
                      placeholder={`${rate.type.charAt(0).toUpperCase() + rate.type.slice(1)} room description`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Settings Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Deposit Settings</h3>
              <p className="text-sm text-gray-500 mb-4">
                Choose between a fixed amount or percentage of total price
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deposit Type
                  </label>
                  <select
                    value={pricing.depositType}
                    onChange={(e) => updatePricing({
                      depositType: e.target.value as 'fixed' | 'percentage',
                      deposit: 0
                    })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {pricing.depositType === 'percentage' ? 'Percentage' : 'Amount'}
                  </label>
                  <div className="relative">
                    {pricing.depositType === 'fixed' && (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                    )}
                    <Input
                      type="number"
                      min="0"
                      max={pricing.depositType === 'percentage' ? 100 : undefined}
                      value={pricing.deposit}
                      onChange={(e) => updatePricing({ deposit: Number(e.target.value) })}
                      className={pricing.depositType === 'fixed' ? 'pl-7' : ''}
                    />
                    {pricing.depositType === 'percentage' && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add-ons Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Add-ons</h3>
                <p className="text-sm text-gray-500">Standard and custom add-ons</p>
              </div>
              <Button onClick={handleAddCustomAddOn} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Option
              </Button>
            </div>

            <div className="space-y-4">
              {pricing.addOns.map((addon: PricingAddOn) => {
                const isStandard = STANDARD_ADDONS.some(std => std.id === addon.id);
                return (
                  <div 
                    key={addon.id}
                    className="p-4 border rounded-lg space-y-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                          <Input
                            value={addon.name}
                            onChange={(e) => handleUpdateAddOn(addon.id, { name: e.target.value })}
                            placeholder="Add-on name"
                            disabled={isStandard}
                          />
                          {isStandard && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Standard
                            </span>
                          )}
                        </div>
                        <textarea
                          value={addon.description}
                          onChange={(e) => handleUpdateAddOn(addon.id, { description: e.target.value })}
                          placeholder="Description"
                          className="w-full min-h-[80px] p-2 border rounded-md"
                          disabled={isStandard}
                        />
                        <div className="flex gap-4">
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">$</span>
                            </div>
                            <Input
                              type="number"
                              min="0"
                              value={addon.price}
                              onChange={(e) => handleUpdateAddOn(addon.id, { price: Number(e.target.value) })}
                              className="pl-7"
                              placeholder="Price"
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={addon.optional}
                              onChange={(e) => handleUpdateAddOn(addon.id, { optional: e.target.checked })}
                              className="mr-2"
                              disabled={isStandard}
                            />
                            <span className="text-sm text-gray-600">Optional</span>
                          </div>
                        </div>
                      </div>
                      {!isStandard && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAddOn(addon.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}