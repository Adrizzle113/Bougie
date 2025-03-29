// src/types/pricing.ts
import type { BaseItem } from './baseTypes';

export interface RoomRate extends BaseItem {
  type: 'single' | 'double' | 'triple' | 'quad';
  price: number;
  description: string;
  isAvailable: boolean;
  maxOccupancy?: number;
}

export interface PricingAddOn extends BaseItem {
  name: string;
  description: string;
  price: number;
  optional: boolean;
}

export interface TripPricing {
  basePrice: number;
  deposit: number;
  depositType: 'percentage' | 'fixed';
  addOns: PricingAddOn[];
  roomRates: RoomRate[];
}

export interface SelectedRoom {
  type: string;
  price: number;
  description?: string;
}

export interface PreAccommodation {
  nights: number;
  price: number;
  hotel: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
}