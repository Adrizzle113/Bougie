// src/types/baseTypes.ts

// Base interfaces for common properties
export interface BaseItem {
  id: string;
}

export interface BaseImage {
  src: string;
  alt: string;
  priority?: boolean;
}

// Status types
export type AdminTripStatus = 'draft' | 'published' | 'archived';
export type UserTripStatus = 'upcoming' | 'completed' | 'cancelled';
export type TripStatus = AdminTripStatus | UserTripStatus;

// Constants for activity types
export const ACTIVITY_TYPES = {
  SIGHTSEEING: 'Sightseeing',
  LOCATION: 'Location',
  ACCOMMODATION: 'Accommodation',
  CRUISE: 'Cruise',
  TRAIN: 'Train',
  BUS: 'Bus',
  CHECK_IN_OUT: 'Check-in/out',
  ARRIVAL: 'Arrival',
  DEPARTURE: 'Departure',
  FLIGHT: 'Flight',
  TRANSFER: 'Transfer'
} as const;

// Constants for image sections
export const TRIP_IMAGE_SECTIONS = {
  MAP: 'map',
  OVERVIEW: 'overview',
  ITINERARY: 'itinerary',
  TERMS: 'terms',
  TRAVEL_BRIEF: 'travelBrief',
  CTA: 'cta',
  INCLUSIONS: 'inclusions',
  LOCATIONS: 'locations'
} as const;

// Constants for day sections
export const DAY_SECTIONS = {
  ACTIVITIES: 'Activities',
  ACCOMMODATIONS: 'Accommodations',
  PROPERTY_OVERVIEW: 'Property Overview'
} as const;

// Derived types from constants
export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];
export type TripImageSection = typeof TRIP_IMAGE_SECTIONS[keyof typeof TRIP_IMAGE_SECTIONS];
export type DaySectionType = typeof DAY_SECTIONS[keyof typeof DAY_SECTIONS];