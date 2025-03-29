// src/types/itinerary.ts
import type { BaseItem, BaseImage, DaySectionType, ActivityType } from './baseTypes';

export interface TripImage extends BaseImage {
  section?: 'itinerary' | 'overview' | 'travelBrief' | 'map' | 'inclusions' | 'terms';
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
  onUpdateItem: (index: number, value: ActivityContent | MoreDetails) => void;
  onImageUpload: (file: File) => Promise<ImageUploadResponse>;
  onImageRemove: (index: number) => void;
}