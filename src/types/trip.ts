// src/types/trip.ts
import type { BaseItem } from './baseTypes';
import type { AdminTripStatus, UserTripStatus } from './baseTypes';
import type { TripImage, ItineraryItem } from './itinerary';
import type { TripPricing } from './pricing';

export type { UserTripStatus, AdminTripStatus };

export interface TripTiming {
  startDate: string;
  endDate: string;
  duration?: string;
  location?: string;
}

export interface TripAccommodation {
  days: string;
  location: string;
  roomType: string;
  boardBasis: string;
  nights: number;
}

export interface FlightInfo {
  arrival: string;
  departure: string;
  notes: string;
}

export interface TravelBrief {
  description: string;
  accommodations: TripAccommodation[];
  flights: FlightInfo;
  mapUrl: string;
}

export interface Location {
  days: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CTAContent {
  mainButtonText: string;
  secondaryButtonText: string;
  heading: string;
  description: string;
  mainButtonLink: string;
}

export interface TripBase extends BaseItem {
  title: string;
  subtitle?: string;
  overview?: string;
  date: string;
  startDate: string;
  endDate: string;
  timing: TripTiming;
  pricing: TripPricing;
  images: TripImage[];
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
  mapLocations: Location[];
  terms: string;
  createdAt?: string;
  updatedAt?: string;
  cta?: CTAContent;
  highlights?: string[];
  tags?: Array<{ id: string; text: string; }>;
  travelBrief: TravelBrief;
}

export interface Trip extends TripBase {
  status: UserTripStatus;
}

export interface AdminTrip extends TripBase {
  status: AdminTripStatus;
}