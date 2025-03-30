// src/components/admin/tripdetails/tabs/MapTab.tsx
import React, { useState, useRef } from 'react';
import { LuxuryTripData } from '@/types/luxuryTrip.types';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, ImagePlus, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadImage } from '@/lib/uploadHelpers';
import { createNewTripImage } from '@/lib/utils';
import styles from './MapTab.module.css';

interface MapTabProps {
  tripData: LuxuryTripData;
  updateField: <K extends keyof LuxuryTripData>(key: K, value: LuxuryTripData[K]) => void;
}

export default function MapTab({ tripData, updateField }: MapTabProps): React.ReactElement {
  const [showMapInput, setShowMapInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapImages = tripData.images.filter(img => img.section === 'map');

  const updateMapUrl = (url: string) => {
    const updatedTravelBrief = {
      ...tripData.travelBrief,
      mapUrl: url
    };
    updateField('travelBrief', updatedTravelBrief);
  };

  const handleLocationChange = (index: number, field: 'days' | 'location', value: string) => {
    const newLocations = [...(tripData.mapLocations || [])];
    newLocations[index] = { ...newLocations[index], [field]: value };
    updateField('mapLocations', newLocations);
  };

  const handleAddLocation = () => {
    updateField('mapLocations', [...(tripData.mapLocations || []), { days: '', location: '' }]);
  };

  const handleRemoveLocation = (index: number) => {
    const newLocations = tripData.mapLocations.filter((_, i) => i !== index);
    updateField('mapLocations', newLocations);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const { url, alt } = await uploadImage(file, 'map');
      
      // Use the createNewTripImage helper
      const newImage = createNewTripImage(url, alt, 'map', undefined, !mapImages.length);

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
      img.section !== 'map' || 
      tripData.images.indexOf(img) !== tripData.images.indexOf(mapImages[index])
    );
    updateField('images', updatedImages);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        {/* Map Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Interactive Map</h3>
            <Button
              onClick={() => setShowMapInput(!showMapInput)}
              className={styles.addButton}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {showMapInput ? 'Hide Map URL' : 'Update Map URL'}
            </Button>
          </div>

          {showMapInput && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Google Maps Embed URL</label>
              <Input
                value={tripData.travelBrief?.mapUrl || ''}
                onChange={(e) => updateMapUrl(e.target.value)}
                placeholder="Enter Google Maps embed URL"
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.mapContainer}>
            {tripData.travelBrief?.mapUrl ? (
              <iframe
                src={tripData.travelBrief.mapUrl}
                className={styles.mapFrame}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className={styles.emptyMap}>
                <MapPin className="h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Add a map URL to display the interactive map
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Locations Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Map Locations</h3>
            <Button onClick={handleAddLocation} className={styles.addButton}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>

          <div className={styles.cardContent}>
            {(tripData.mapLocations || []).map((location, index) => (
              <div key={index} className={styles.locationCard}>
                <div className={styles.locationFields}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Days</label>
                    <Input
                      value={location.days}
                      onChange={(e) => handleLocationChange(index, 'days', e.target.value)}
                      placeholder="e.g., Days 1-3"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Location</label>
                    <Input
                      value={location.location}
                      onChange={(e) => handleLocationChange(index, 'location', e.target.value)}
                      placeholder="Enter location"
                      className={styles.input}
                    />
                  </div>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => handleRemoveLocation(index)}
                  className={styles.deleteButton}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Location
                </Button>
              </div>
            ))}

            {!tripData.mapLocations?.length && (
              <div className={styles.emptyState}>
                <MapPin className="h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Add locations to display on the map
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        {/* Images Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Map Images</h3>
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
            {mapImages.map((image, index) => (
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

          {!mapImages.length && (
            <div className={styles.emptyState}>
              <ImagePlus className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click "Upload Image" to add map images
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}