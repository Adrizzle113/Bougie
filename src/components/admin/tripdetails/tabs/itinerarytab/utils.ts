// src/components/admin/tripdetails/tabs/itinerarytab/utils.ts
import type { 
    ItineraryItem, 
    TimelineItem, 
    ActivityContent, 
    MoreDetails,
    ActivityType,
    DaySectionType,
    TripImage
  } from '@/types/luxuryTrip.types';
  
  export const createNewDay = (): ItineraryItem => ({
    id: crypto.randomUUID(),
    title: '',
    description: '',
    timeline: [],
    isHighlight: false
  });
  
  export const createNewActivityItem = (type: ActivityType = 'Sightseeing'): TimelineItem => ({
    id: crypto.randomUUID(),
    type: 'activity',
    content: {
      id: crypto.randomUUID(),
      type,
      text: '',
      isHighlight: false
    }
  });
  
  export const createNewDetailsItem = (): TimelineItem => ({
    id: crypto.randomUUID(),
    type: 'details',
    content: {
      id: crypto.randomUUID(),
      sectionType: 'Activities',
      content: '',
      images: []
    }
  });
  
  export const createNewTripImage = (
    src: string,
    alt: string,
    section: string,
    dayIndex?: number,
    priority: boolean = false
  ): TripImage => ({
    id: crypto.randomUUID(),
    src,
    alt,
    section,
    dayIndex,
    priority
  });