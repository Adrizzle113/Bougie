// src/types/itinerary.types.ts

export type DaySectionType = 'Activities' | 'Accommodations' | 'Property Overview';

export interface TripImage {
  src: string;
  alt: string;
  section?: 'itinerary' | 'overview' | 'travelBrief' | 'map' | 'inclusions' | 'terms';
  priority?: boolean;
}

export interface MoreDetails {
  sectionType: DaySectionType;
  content: string;
  videoUrl?: string;
  images?: TripImage[];
}

export interface TimelineItem {
  id?: string;
  type: 'activity' | 'details';
  content: string | MoreDetails;
}

export interface ItineraryItem {
  title: string;
  description: string;
  timeline: TimelineItem[];
  isHighlight?: boolean;
}

export interface ImageUploadResponse {
  url: string;
  alt: string;
}

export interface TimelineListProps {
  timeline: TimelineItem[];
  dayIndex: number;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  onAddItem: (type: 'activity' | 'details') => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, value: string | MoreDetails) => void;
  onImageUpload: (file: File) => Promise<ImageUploadResponse>;
  onImageRemove: (index: number) => void;
}