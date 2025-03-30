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

// Define activity types - ensuring consistent definitions
export type ActivityType = 
  | 'Sightseeing'
  | 'Location Visit'
  | 'Accommodation'
  | 'Cruise'
  | 'Train Journey'
  | 'Bus Transfer'
  | 'Check-in/out'
  | 'Arrival'
  | 'Departure'
  | 'Flight'
  | 'Transfer'
  | 'Activity';

// Define image section types consistently
export type TripImageSection = 
  | 'overview' 
  | 'itinerary' 
  | 'terms' 
  | 'travelBrief' 
  | 'map' 
  | 'inclusions'
  | 'cta'
  | 'locations';

// Define day section types
export type DaySectionType = 
  | 'Activities'
  | 'Accommodations'
  | 'Property Overview';

// TripImage type with consistent ID requirement
export interface TripImage extends BaseItem, BaseImage {
  section?: TripImageSection;
  dayIndex?: number;
  itemIndex?: number;
}

// Constants for cleaner code
export const ACTIVITY_TYPES = {
  SIGHTSEEING: 'Sightseeing',
  LOCATION: 'Location Visit',
  ACCOMMODATION: 'Accommodation',
  CRUISE: 'Cruise',
  TRAIN: 'Train Journey',
  BUS: 'Bus Transfer',
  CHECK_IN_OUT: 'Check-in/out',
  ARRIVAL: 'Arrival',
  DEPARTURE: 'Departure',
  FLIGHT: 'Flight',
  TRANSFER: 'Transfer',
  ACTIVITY: 'Activity',
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