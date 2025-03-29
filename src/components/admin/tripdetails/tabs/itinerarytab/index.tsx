// src/components/admin/tripdetails/tabs/itinerarytab/index.tsx
'use client';

import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { uploadImage } from '@/lib/uploadHelpers';
import type { 
  AdminTrip,
  ItineraryItem, 
  TimelineItem, 
  TripImage, 
  ActivityContent, 
  MoreDetails,
  ActivityType,
  DaySectionType 
} from '@/types/luxuryTrip.types';
import DayWrapperComponent from './DayWrapper';
import { TimelineList } from './TimelineList';
import { createNewDay, createNewActivityItem, createNewDetailsItem } from './utils';

interface ItineraryTabProps {
  tripData: AdminTrip;
  updateField: <K extends keyof AdminTrip>(key: K, value: AdminTrip[K]) => void;
}

export default function ItineraryTab({ tripData, updateField }: ItineraryTabProps): React.ReactElement {
  const [error, setError] = useState<string | null>(null);

  // Date handlers
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    updateField(field, value);
  };

  // Drag and drop handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const [activeDay, activeIndex] = active.id.toString().split('-').map(Number);
    const [overDay, overIndex] = over.id.toString().split('-').map(Number);

    if (activeDay === overDay) {
      const newItinerary = [...tripData.itinerary];
      const timeline = [...newItinerary[activeDay].timeline];
      const [movedItem] = timeline.splice(activeIndex, 1);
      timeline.splice(overIndex, 0, movedItem);
      newItinerary[activeDay].timeline = timeline;
      updateField('itinerary', newItinerary);
    }
  };

  // Day management handlers
  const handleAddDay = () => {
    const newDay = createNewDay();
    updateField('itinerary', [...(tripData.itinerary || []), newDay]);
  };

  const handleUpdateDay = (index: number, updates: Partial<Omit<ItineraryItem, 'id'>>) => {
    const newItinerary = [...tripData.itinerary];
    newItinerary[index] = { ...newItinerary[index], ...updates };
    updateField('itinerary', newItinerary);
  };

  const handleDeleteDay = (index: number) => {
    if (!confirm('Are you sure you want to delete this day?')) return;
    const newItinerary = tripData.itinerary.filter((_, i) => i !== index);
    updateField('itinerary', newItinerary);

    const newImages = tripData.images.filter(img => 
      img.section !== 'itinerary' || img.dayIndex !== index
    );
    updateField('images', newImages);
  };

  // Timeline management handlers
  const handleAddTimelineItem = (dayIndex: number, type: 'activity' | 'details') => {
    const newItinerary = [...tripData.itinerary];
    
    const newItem = type === 'activity' 
      ? createNewActivityItem('Sightseeing' as ActivityType)
      : createNewDetailsItem();

    if (!newItinerary[dayIndex].timeline) {
      newItinerary[dayIndex].timeline = [];
    }
    
    newItinerary[dayIndex].timeline.push(newItem);
    updateField('itinerary', newItinerary);
  };

  const handleUpdateTimelineItem = (
    dayIndex: number, 
    itemIndex: number, 
    content: ActivityContent | MoreDetails
  ) => {
    const newItinerary = [...tripData.itinerary];
    const item = newItinerary[dayIndex].timeline[itemIndex];
    
    if (
      (item.type === 'activity' && 'text' in content) ||
      (item.type === 'details' && 'sectionType' in content)
    ) {
      item.content = content;
      updateField('itinerary', newItinerary);
    }
  };

  // Image handlers
  const handleUpdateImages = (images: TripImage[]) => {
    updateField('images', images);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const { url, alt } = await uploadImage(file, 'itinerary');
      return { url, alt };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      throw err;
    }
  };

  // Render sections
  const renderDateSection = () => (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Trip Dates</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={tripData.startDate || ''}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Input
                type="date"
                value={tripData.endDate || ''}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderItineraryContent = () => (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
      collisionDetection={closestCenter}
    >
      <div className="space-y-4">
        {tripData.itinerary?.map((day, index) => (
          <DayWrapperComponent
            key={day.id}
            day={day}
            index={index}
            onUpdate={(updates) => handleUpdateDay(index, updates)}
            onDelete={() => handleDeleteDay(index)}
            tripImages={tripData.images}
            onUpdateImages={handleUpdateImages}
          >
            <SortableContext
              items={day.timeline.map((_, i) => `${index}-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleAddTimelineItem(index, 'activity')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAddTimelineItem(index, 'details')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Details
                  </Button>
                </div>
                
                <TimelineList
                  timeline={day.timeline}
                  dayIndex={index}
                  onAddItem={(type) => handleAddTimelineItem(index, type)}
                  onRemoveItem={(itemIndex) => {
                    const newItinerary = [...tripData.itinerary];
                    newItinerary[index].timeline = newItinerary[index].timeline.filter(
                      (_, i) => i !== itemIndex
                    );
                    updateField('itinerary', newItinerary);
                  }}
                  onMoveItem={(from, to) => {
                    const newItinerary = [...tripData.itinerary];
                    const timeline = [...newItinerary[index].timeline];
                    const [movedItem] = timeline.splice(from, 1);
                    timeline.splice(to, 0, movedItem);
                    newItinerary[index].timeline = timeline;
                    updateField('itinerary', newItinerary);
                  }}
                  onUpdateItem={(itemIndex, content) => handleUpdateTimelineItem(index, itemIndex, content)}
                  onImageUpload={handleImageUpload}
                  onImageRemove={(imageIndex) => {
                    const updatedImages = tripData.images.filter((img) => 
                      !(img.section === 'itinerary' && 
                        img.dayIndex === index && 
                        img.itemIndex === imageIndex)
                    );
                    updateField('images', updatedImages);
                  }}
                />
              </div>
            </SortableContext>
          </DayWrapperComponent>
        ))}

        {(!tripData.itinerary || tripData.itinerary.length === 0) && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-4 shadow-sm">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Days Added Yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Start building your itinerary by adding your first day
            </p>
            <Button
              onClick={handleAddDay}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Day
            </Button>
          </div>
        )}
      </div>
    </DndContext>
  );

  return (
    <div className="space-y-6 p-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {renderDateSection()}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Itinerary</h2>
        <Button onClick={handleAddDay} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Day
        </Button>
      </div>

      {renderItineraryContent()}
    </div>
  );
}