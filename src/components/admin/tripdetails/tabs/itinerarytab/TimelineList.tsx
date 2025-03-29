// components/admin/tripdetails/tabs/itinerarytab/TimelineList.tsx
'use client';

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, Upload, Clock, Timer, ImagePlus, Star } from 'lucide-react';
import type { TimelineItem, ActivityContent, MoreDetails } from '@/types/luxuryTrip.types';
import MediaGallery from './MediaGallery';

interface TimelineListProps {
  timeline: TimelineItem[];
  dayIndex: number;
  onAddItem: (type: 'activity' | 'details') => void;
  onRemoveItem: (itemIndex: number) => void;
  onMoveItem: (from: number, to: number) => void;
  onUpdateItem: (itemIndex: number, content: ActivityContent | MoreDetails) => void;
  onImageUpload: (file: File) => Promise<{ url: string; alt: string }>;
  onImageRemove: (imageIndex: number) => void;
}

const ACTIVITY_TYPES = {
  'Activity': 'Activity',
  'Sightseeing': 'Sightseeing',
  'Location': 'Location Visit',
  'Accommodation': 'Accommodation',
  'Cruise': 'Cruise',
  'Train': 'Train Journey',
  'Bus': 'Bus Transfer',
  'Check-in/out': 'Check-in/out',
  'Arrival': 'Arrival',
  'Departure': 'Departure',
  'Flight': 'Flight',
  'Transfer': 'Transfer',
} as const;

export function TimelineList({
  timeline,
  dayIndex,
  onAddItem,
  onRemoveItem,
  onMoveItem,
  onUpdateItem,
  onImageUpload,
  onImageRemove
}: TimelineListProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleActivityUpdate = (index: number, item: TimelineItem, updates: Partial<ActivityContent>) => {
    if (item.type !== 'activity' || typeof item.content === 'string') return;

    const currentContent = item.content as ActivityContent;
    
    // Special handling for highlight toggle
    if ('isHighlight' in updates) {
      updates.isHighlight = !currentContent.isHighlight;
    }

    const updatedContent: ActivityContent = {
      ...currentContent,
      ...updates
    };

    onUpdateItem(index, updatedContent);
  };

  const handleDetailsUpdate = async (index: number, item: TimelineItem, updates: Partial<MoreDetails>) => {
    if (item.type !== 'details' || typeof item.content === 'string') return;

    const currentContent = item.content as MoreDetails;
    const updatedContent: MoreDetails = {
      ...currentContent,
      ...updates
    };

    onUpdateItem(index, updatedContent);
  };

  const handleFileUpload = async (index: number, item: TimelineItem, file: File) => {
    try {
      const { url, alt } = await onImageUpload(file);
      if (item.type === 'details' && typeof item.content !== 'string') {
        const content = item.content as MoreDetails;
        const updatedContent: MoreDetails = {
          ...content,
          images: [...(content.images || []), { src: url, alt }]
        };
        onUpdateItem(index, updatedContent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    }
  };

  const renderTimelineItem = (item: TimelineItem, index: number) => {
    if (item.type === 'activity' && typeof item.content !== 'string') {
      const content = item.content as ActivityContent;
      return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <Select
                value={content.type}
                onValueChange={(value) => handleActivityUpdate(index, item, { type: value as keyof typeof ACTIVITY_TYPES })}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTIVITY_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleActivityUpdate(index, item, { isHighlight: true })}
                className={`min-w-[40px] ${content.isHighlight ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400'}`}
              >
                <Star 
                  className="h-5 w-5"
                  fill={content.isHighlight ? 'currentColor' : 'none'}
                />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="time"
                value={content.time || ''}
                onChange={(e) => handleActivityUpdate(index, item, { time: e.target.value })}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={content.duration || ''}
                onChange={(e) => handleActivityUpdate(index, item, { duration: e.target.value })}
                placeholder="Duration"
                className="pl-10"
              />
            </div>
          </div>

          <textarea
            value={content.text}
            onChange={(e) => handleActivityUpdate(index, item, { text: e.target.value })}
            placeholder="Enter activity description"
            rows={4}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    } else if (item.type === 'details' && typeof item.content !== 'string') {
      const content = item.content as MoreDetails;
      return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          {/* ... rest of the details section remains the same ... */}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {timeline.map((item, index) => (
        <div key={`${dayIndex}-${index}`}>
          {renderTimelineItem(item, index)}
        </div>
      ))}
    </div>
  );
}