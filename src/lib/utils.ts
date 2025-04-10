// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ItineraryItem, TimelineItem } from '@/types/luxuryTrip.types';
import { isActivityContent } from '@/types/luxuryTrip.types';
import type { TripImage, TripImageSection } from '@/types/baseTypes';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getHighlightsFromItinerary = (itinerary: ItineraryItem[]): string[] => {
  const highlights = itinerary.reduce<string[]>((acc, day) => {
    const dayHighlights = day.timeline
      .filter((item: TimelineItem) => 
        item.type === 'activity' &&
        isActivityContent(item.content) &&
        item.content.isHighlight &&
        item.content.text
      )
      .map(item => isActivityContent(item.content) ? item.content.text : '');
    
    return [...acc, ...dayHighlights];
  }, []);

  return highlights.slice(0, 6);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// New helper function to create trip images with required id
export const createNewTripImage = (
  src: string,
  alt: string,
  section: string | TripImageSection,
  dayIndex?: number,
  priority: boolean = false
): TripImage => ({
  id: crypto.randomUUID(),
  src,
  alt,
  section: section as TripImageSection,
  dayIndex,
  priority
});