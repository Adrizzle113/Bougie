// src/components/admin/tripdetails/tabs/itinerarytab/types.ts
import { 
    TimelineItem,
    TripImage,
    ActivityContent,
    MoreDetails
  } from '@/types/luxuryTrip.types';
  
  export type TimelineContentUpdate = 
    | { type: 'activity'; content: ActivityContent }
    | { type: 'details'; content: MoreDetails };
  
  export interface TimelineListProps {
    timeline: TimelineItem[];
    dayIndex: number;
    onAddItem: (type: 'activity' | 'details') => void;
    onRemoveItem: (itemIndex: number) => void;
    onMoveItem: (from: number, to: number) => void;
    onUpdateItem: (itemIndex: number, content: TimelineContentUpdate) => void;
    onImageUpload: (file: File) => Promise<{ url: string; alt: string }>;
    onImageRemove: (imageIndex: number) => void;
  }
  
  export interface ActivityProps {
    id: string;
    type: string;
    description: string;
    time?: string;
    duration?: string;
    isHighlight?: boolean;
    onUpdate: (updates: { 
      type?: string; 
      description?: string; 
      time?: string; 
      duration?: string;
      isHighlight?: boolean;
    }) => void;
    onDelete: () => void;
  }
  
  export interface DetailsSectionProps {
    id: string;
    details: MoreDetails;
    onUpdate: (details: MoreDetails) => void;
    onDelete: () => void;
    onImageUpload: (file: File) => Promise<{ url: string; alt: string }>;
    onImageRemove: (index: number) => void;
  }

  interface TripData {
    id: string;
    title: string;
    subtitle?: string;
    duration?: string;
    destinations?: string[];
    startDate?: string;
    price: number;
  }
  
  interface RoomType {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    recommended?: boolean;
  }
  
  interface TripExtra {
    id: string;
    name: string;
    price: number;
    description: string;
  }