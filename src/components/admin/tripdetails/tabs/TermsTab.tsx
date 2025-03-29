// src/components/admin/tripdetails/tabs/TermsTab.tsx
'use client';

import React, { useState, useRef } from 'react';
import { LuxuryTripData, TripImage } from '@/types/luxuryTrip.types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2, ImagePlus } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadImage } from '@/lib/uploadHelpers';

const DEFAULT_TERMS = `1. Payment and Booking:
   - 50% deposit required to secure booking
   - Full payment due 60 days before departure
   - All payments are non-refundable

2. Cancellation Policy:
   - 60+ days: Loss of deposit
   - 30-59 days: 50% of total cost
   - 0-29 days: 100% of total cost

3. Travel Insurance:
   - Comprehensive travel insurance is mandatory
   - Must cover medical emergencies and evacuation

4. Responsibility:
   - Travelers must follow local laws and customs
   - Tour operator reserves right to modify itinerary
   - We are not responsible for circumstances beyond our control

5. Documentation:
   - Valid passport required
   - Visas and permits are traveler's responsibility
   - Travel insurance documentation required`;

interface TermsTabProps {
  tripData: LuxuryTripData;
  updateField: <K extends keyof LuxuryTripData>(key: K, value: LuxuryTripData[K]) => void;
}

export default function TermsTab({ tripData, updateField }: TermsTabProps): React.ReactElement {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const termsImages = tripData.images.filter(img => img.section === 'terms');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const { url, alt } = await uploadImage(file, 'terms');
      
      const newImage: TripImage = {
        src: url,
        alt,
        section: 'terms',
        priority: !termsImages.length
      };

      updateField('images', [...tripData.images, newImage]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error handling file:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = tripData.images.filter(img => 
      img.section !== 'terms' || 
      tripData.images.indexOf(img) !== tripData.images.indexOf(termsImages[index])
    );
    updateField('images', updatedImages);
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Terms & Conditions</h3>
            <Button
              variant="outline"
              onClick={() => updateField('terms', DEFAULT_TERMS)}
            >
              Use Default Terms
            </Button>
          </div>

          <Textarea
            value={tripData.terms || ''}
            onChange={(e) => updateField('terms', e.target.value)}
            placeholder="Enter terms and conditions..."
            className="min-h-[400px] font-mono text-sm"
          />
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Images</h3>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />

          <div className="grid grid-cols-2 gap-4">
            {termsImages.map((image, index) => (
              <div key={index} className="relative group aspect-video rounded-lg overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
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

          {!termsImages.length && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click "Upload Image" to add images
              </p>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}