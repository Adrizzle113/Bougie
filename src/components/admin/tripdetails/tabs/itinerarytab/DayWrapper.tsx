// components/admin/tripdetails/tabs/itinerarytab/DayWrapper.tsx
'use client';

import React, { useRef, useState } from 'react';
import type { 
  ItineraryItem, 
  TimelineItem, 
  TripImage 
} from '@/types/luxuryTrip.types';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, ImagePlus, Plus, Trash2, Upload } from 'lucide-react';
import { createNewTripImage } from './utils';
import { uploadImage } from '@/lib/uploadHelpers';

interface ImageUploaderProps {
  onImageUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onImageUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="ml-auto"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? 'Uploading...' : 'Upload Image'}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </>
  );
};

interface DayWrapperProps {
  day: ItineraryItem;
  index: number;
  onUpdate: (updates: Partial<Omit<ItineraryItem, 'id'>>) => void;
  onDelete: () => void;
  children: React.ReactNode;
  tripImages: TripImage[];
  onUpdateImages: (images: TripImage[]) => void;
}

export default function DayWrapper({
  day,
  index,
  onUpdate,
  onDelete,
  children,
  tripImages,
  onUpdateImages,
}: DayWrapperProps): React.ReactElement {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dayImages = tripImages.filter(img => 
    img.section === 'itinerary' && 
    img.dayIndex === index
  );

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const { url, alt } = await uploadImage(file, 'itinerary');
      const newImage = createNewTripImage(
        url,
        alt,
        'itinerary',
        index,
        !dayImages.length // Set as primary if it's the first image
      );
      onUpdateImages([...tripImages, newImage]);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageIndex: number) => {
    const updatedImages = tripImages.filter((img) => {
      if (img.section !== 'itinerary' || img.dayIndex !== index) return true;
      const dayImageIndex = dayImages.indexOf(img);
      return dayImageIndex !== imageIndex;
    });
    onUpdateImages(updatedImages);
  };

  return (
    <Card className="bg-white p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Day {index + 1}</h3>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          Delete Day
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Day Title
          </label>
          <Input
            value={day.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter a title for this day"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={day.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe this day's activities"
            className="w-full min-h-[100px] p-3 border rounded-md"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">Images</h4>
            <ImageUploader onImageUpload={handleImageUpload} uploading={uploading} />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-3 gap-4">
            {dayImages.map((image, idx) => (
              <div key={image.id} className="relative group aspect-video rounded-lg overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {image.priority && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    Primary Image
                  </div>
                )}
              </div>
            ))}
          </div>

          {!dayImages.length && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
              <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click "Upload Image" to add images
              </p>
            </div>
          )}
        </div>

        {children}
      </div>
    </Card>
  );
}