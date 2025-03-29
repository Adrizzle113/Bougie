// src/types/luxuryTrip.types.ts
import type { BaseItem } from './baseTypes';
import type { Trip, AdminTrip, TripBase } from './trip';
import type { TripTiming, TripAccommodation, FlightInfo, TravelBrief, Location } from './trip';

// Define valid section types
export type DaySectionType = 'Activities' | 'Accommodations' | 'Property Overview';
export type TripImageSection = 'overview' | 'itinerary' | 'terms' | 'travelBrief' | 'map' | 'inclusions';
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
  | 'Transfer';
  
export interface TripImage extends BaseItem {
  src: string;
  alt: string;
  section?: TripImageSection;
  priority?: boolean;
  dayIndex?: number;
  itemIndex?: number;
}

export interface MoreDetails extends BaseItem {
  sectionType: DaySectionType;
  content: string;
  videoUrl?: string;
  images?: TripImage[];
}

export interface ActivityContent extends BaseItem {
  type: ActivityType;
  text: string;
  time?: string;
  duration?: string;
  isHighlight?: boolean;
}

export interface TimelineItem extends BaseItem {
  type: 'activity' | 'details';
  content: ActivityContent | MoreDetails;
}

export interface ItineraryItem extends BaseItem {
  title: string;
  description: string;
  timeline: TimelineItem[];
  isHighlight?: boolean;
}

export interface CTAContent {
  mainButtonText: string;
  secondaryButtonText: string;
  heading: string;
  description: string;
  mainButtonLink: string;
}

export interface TripSummary {
  id: string;
  title: string;
  subtitle?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: string;
  destinations: string[];
  startDate: string;
  highlights: string[];
  ctaLink?: string;
  images: TripImage[];
  pricing?: {
    basePrice: number;
    deposit: number;
    depositType: 'percentage' | 'fixed';
    addOns: Array<{
      id: string;
      name: string;
      price: number;
      description: string;
      optional: boolean;
    }>;
  };
}

export type LuxuryTripData = AdminTrip;
export type LuxuryTripModel = AdminTrip;
export type LuxuryTrip = AdminTrip;

// Type guards
export function isActivityContent(
  content: any
): content is ActivityContent {
  return 'text' in content && typeof content.text === 'string';
}

export function isMoreDetails(
  content: any
): content is MoreDetails {
  return 'sectionType' in content;
}

export function getHighlightsFromItinerary(itinerary: ItineraryItem[]): string[] {
  const highlights = itinerary.reduce<string[]>((acc, day) => {
    const dayHighlights = day.timeline
      .filter((item: TimelineItem) => 
        item.type === 'activity' && 
        isActivityContent(item.content) && 
        item.content.isHighlight &&
        item.content.text
      )
      .map((item: TimelineItem) => 
        isActivityContent(item.content) ? item.content.text : ''
      );
    
    return [...acc, ...dayHighlights];
  }, []);

  return highlights.slice(0, 6);
}

// Re-export types from trip.ts that are used in this module
export type {
  Trip,
  AdminTrip,
  TripBase,
  TripTiming,
  TripAccommodation,
  FlightInfo,
  TravelBrief,
  Location
};