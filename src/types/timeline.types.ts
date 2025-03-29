// src/types/timeline.types.ts

/**
 * Section types for details content
 */
export type DaySectionType = 'Activities' | 'Accommodations' | 'Property Overview';

/**
 * Types of activities that can be added to the timeline
 */
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

/**
 * Image properties for timeline items
 */
export interface TripImage {
  src: string;
  alt: string;
  section?: 'itinerary' | 'overview' | 'travelBrief' | 'map' | 'inclusions' | 'terms';
  priority?: boolean;
}

/**
 * Properties for detailed sections in the timeline
 */
export interface MoreDetails {
  sectionType: DaySectionType;
  content: string;
  videoUrl?: string;
  images?: TripImage[];
}

/**
 * Content specific to activity timeline items
 */
export interface TimelineActivityContent {
  text: string;
  isHighlight?: boolean;
  time?: string;
  duration?: string;
  activityType?: ActivityType;
}

/**
 * Base timeline item structure
 */
export interface TimelineItem {
  id?: string;
  type: 'activity' | 'details';
  content: TimelineActivityContent | MoreDetails;
}

/**
 * Properties for each day in the itinerary
 */
export interface ItineraryDay {
  title: string;
  description: string;
  timeline: TimelineItem[];
  isHighlight?: boolean;
}

/**
 * Response type for image upload operations
 */
export interface ImageUploadResponse {
  url: string;
  alt: string;
}

/**
 * Type guards for content type checking
 */
export function isActivityContent(content: TimelineActivityContent | MoreDetails): content is TimelineActivityContent {
  return (content as TimelineActivityContent).text !== undefined;
}

export function isMoreDetails(content: TimelineActivityContent | MoreDetails): content is MoreDetails {
  return (content as MoreDetails).sectionType !== undefined;
}

/**
 * Timeline list component props interface
 */
export interface TimelineListProps {
  timeline: TimelineItem[];
  dayIndex: number;
  onAddItem: (type: 'activity' | 'details') => void;
  onMoveItem: (from: number, to: number) => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, value: TimelineActivityContent | MoreDetails) => void;
  onImageUpload: (file: File) => Promise<ImageUploadResponse>;
  onImageRemove: (index: number) => void;
}

/**
 * Activity component props interface
 */
export interface ActivityProps {
  id: string;
  type: ActivityType;
  description: string;
  time?: string;
  duration?: string;
  isHighlight?: boolean;
  onUpdate: (updates: Partial<{
    type: ActivityType;
    description: string;
    time: string;
    duration: string;
    isHighlight: boolean;
  }>) => void;
  onDelete: () => void;
}

/**
 * Details section component props interface
 */
export interface DetailsSectionProps {
  id: string;
  details: MoreDetails;
  onUpdate: (details: MoreDetails) => void;
  onDelete: () => void;
  onImageUpload: (file: File) => Promise<ImageUploadResponse>;
  onImageRemove: (index: number) => void;
}