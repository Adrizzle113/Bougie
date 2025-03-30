// src/components/admin/tripdetails/tabs/TravelBriefTab.tsx
'use client';

import React, { useState, useRef } from 'react';
import { LuxuryTripData } from '@/types/luxuryTrip.types';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, ImagePlus } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadImage } from '@/lib/uploadHelpers';
import { createNewTripImage } from '@/lib/utils';
import styles from './TravelBriefTab.module.css';

interface TravelBriefTabProps {
  tripData: LuxuryTripData;
  updateField: <K extends keyof LuxuryTripData>(key: K, value: LuxuryTripData[K]) => void;
}

export default function TravelBriefTab({ tripData, updateField }: TravelBriefTabProps): React.ReactElement {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const briefImages = tripData.images.filter(img => img.section === 'travelBrief');

  const updateTravelBrief = (updates: Partial<typeof tripData.travelBrief>) => {
    const current = tripData.travelBrief || { 
      description: '', 
      flights: { arrival: '', departure: '', notes: '' },
      accommodations: [],
      mapUrl: ''
    };
    updateField('travelBrief', { ...current, ...updates });
  };

  const handleUpdateFlights = (key: 'arrival' | 'departure' | 'notes', value: string) => {
    const current = tripData.travelBrief?.flights || { arrival: '', departure: '', notes: '' };
    updateTravelBrief({ flights: { ...current, [key]: value } });
  };

  const handleUpdateAccommodation = (index: number, key: keyof typeof tripData.travelBrief.accommodations[0], value: string | number) => {
    const accommodations = [...(tripData.travelBrief?.accommodations || [])];
    accommodations[index] = { ...accommodations[index], [key]: value };
    updateTravelBrief({ accommodations });
  };

  const handleAddAccommodation = () => {
    const current = tripData.travelBrief?.accommodations || [];
    updateTravelBrief({
      accommodations: [...current, {
        days: '',
        location: '',
        roomType: '',
        boardBasis: '',
        nights: 1
      }]
    });
  };

  const handleRemoveAccommodation = (index: number) => {
    const accommodations = tripData.travelBrief?.accommodations.filter((_, i) => i !== index);
    updateTravelBrief({ accommodations });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const { url, alt } = await uploadImage(file, 'travelBrief');
      
      // Use the createNewTripImage helper
      const newImage = createNewTripImage(
        url,
        alt,
        'travelBrief',
        undefined,
        !briefImages.length
      );

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
      img.section !== 'travelBrief' || 
      tripData.images.indexOf(img) !== tripData.images.indexOf(briefImages[index])
    );
    updateField('images', updatedImages);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        {/* Overview Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Travel Brief Overview</h3>
          </div>
          <div className={styles.cardContent}>
            <Textarea
              value={tripData.travelBrief?.description ?? ''}
              onChange={(e) => updateTravelBrief({ description: e.target.value })}
              placeholder="Enter travel brief description..."
              className={styles.textarea}
              rows={6}
            />
          </div>
        </div>

        {/* Flights Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Flight Details</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Arrival Flight</label>
              <Input
                value={tripData.travelBrief?.flights?.arrival ?? ''}
                onChange={(e) => handleUpdateFlights('arrival', e.target.value)}
                placeholder="Enter arrival flight details"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Departure Flight</label>
              <Input
                value={tripData.travelBrief?.flights?.departure ?? ''}
                onChange={(e) => handleUpdateFlights('departure', e.target.value)}
                placeholder="Enter departure flight details"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Additional Notes</label>
              <Textarea
                value={tripData.travelBrief?.flights?.notes ?? ''}
                onChange={(e) => handleUpdateFlights('notes', e.target.value)}
                placeholder="Enter additional flight information..."
                className={styles.textarea}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Accommodations Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Accommodations</h3>
            <Button onClick={handleAddAccommodation} className={styles.addButton}>
              <Plus className="h-4 w-4 mr-2" />
              Add Accommodation
            </Button>
          </div>

          <div className={styles.cardContent}>
            {(tripData.travelBrief?.accommodations || []).map((accommodation, index) => (
              <div key={index} className={styles.accommodationCard}>
                <div className={styles.accommodationGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Days</label>
                    <Input
                      value={accommodation.days}
                      onChange={(e) => handleUpdateAccommodation(index, 'days', e.target.value)}
                      placeholder="e.g., Days 1-3"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Location</label>
                    <Input
                      value={accommodation.location}
                      onChange={(e) => handleUpdateAccommodation(index, 'location', e.target.value)}
                      placeholder="Enter location"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Room Type</label>
                    <Input
                      value={accommodation.roomType}
                      onChange={(e) => handleUpdateAccommodation(index, 'roomType', e.target.value)}
                      placeholder="Enter room type"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Board Basis</label>
                    <Input
                      value={accommodation.boardBasis}
                      onChange={(e) => handleUpdateAccommodation(index, 'boardBasis', e.target.value)}
                      placeholder="e.g., Full Board"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Nights</label>
                    <Input
                      type="number"
                      value={accommodation.nights}
                      onChange={(e) => handleUpdateAccommodation(index, 'nights', parseInt(e.target.value) || 1)}
                      min={1}
                      className={styles.input}
                    />
                  </div>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => handleRemoveAccommodation(index)}
                  className={styles.deleteButton}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Accommodation
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        {/* Images Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Images</h3>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={styles.addButton}
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

          {error && (
            <Alert variant="destructive" className={styles.alert}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className={styles.imageGrid}>
            {briefImages.map((image, index) => (
              <div key={index} className={styles.imageWrapper}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className={styles.image}
                />
                <div className={styles.imageOverlay}>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(index)}
                    className={styles.imageDeleteButton}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {image.priority && (
                  <div className={styles.primaryBadge}>
                    Primary Image
                  </div>
                )}
              </div>
            ))}
          </div>

          {!briefImages.length && (
            <div className={styles.emptyState}>
              <ImagePlus className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click "Upload Image" to add images
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}