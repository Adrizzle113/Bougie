// src/components/admin/tripdetails/tabs/InclusionsTab.tsx
'use client';

import { useState, useRef } from 'react';
import { LuxuryTripData } from '@/types/luxuryTrip.types';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, ImagePlus } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import styles from './InclusionsTab.module.css';
import { uploadImage } from '@/lib/uploadHelpers';
import { createNewTripImage } from '@/lib/utils';

interface InclusionsTabProps {
  tripData: LuxuryTripData;
  updateField: <K extends keyof LuxuryTripData>(key: K, value: LuxuryTripData[K]) => void;
}

export function InclusionsTab({ tripData, updateField }: InclusionsTabProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Move this up before it's used
  const inclusionImages = tripData.images.filter(img => img.section === 'inclusions');

  const handleUpdateIncluded = (index: number, value?: string) => {
    const newIncluded = [...tripData.included];
    if (value === undefined) {
      newIncluded.splice(index, 1);
    } else {
      newIncluded[index] = value;
    }
    updateField('included', newIncluded);
  };

  const handleUpdateExcluded = (index: number, value?: string) => {
    const newExcluded = [...tripData.excluded];
    if (value === undefined) {
      newExcluded.splice(index, 1);
    } else {
      newExcluded[index] = value;
    }
    updateField('excluded', newExcluded);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const { url, alt } = await uploadImage(file, 'inclusions');
      
      // Use the createNewTripImage helper
      const newImage = createNewTripImage(
        url, 
        alt, 
        'inclusions', 
        undefined, 
        !inclusionImages.length
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
      img.section !== 'inclusions' || 
      tripData.images.indexOf(img) !== tripData.images.indexOf(inclusionImages[index])
    );
    updateField('images', updatedImages);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        {/* Included Items Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>What's Included</h3>
            <Button
              onClick={() => updateField('included', [...(tripData.included || []), ''])}
              className={styles.addButton}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className={styles.cardContent}>
            {(tripData.included || []).map((item, index) => (
              <div key={index} className={styles.inputGroup}>
                <Input
                  value={item}
                  onChange={(e) => handleUpdateIncluded(index, e.target.value)}
                  placeholder="Enter included item"
                  className={styles.input}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleUpdateIncluded(index)}
                  className={styles.deleteButton}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Excluded Items Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>What's Not Included</h3>
            <Button
              onClick={() => updateField('excluded', [...(tripData.excluded || []), ''])}
              className={styles.addButton}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className={styles.cardContent}>
            {(tripData.excluded || []).map((item, index) => (
              <div key={index} className={styles.inputGroup}>
                <Input
                  value={item}
                  onChange={(e) => handleUpdateExcluded(index, e.target.value)}
                  placeholder="Enter excluded item"
                  className={styles.input}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleUpdateExcluded(index)}
                  className={styles.deleteButton}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
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
            {inclusionImages.map((image, index) => (
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

          {!inclusionImages.length && (
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