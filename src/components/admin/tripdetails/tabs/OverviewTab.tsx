// src/components/admin/tripdetails/tabs/OverviewTab.tsx
'use client';

import { useState, useRef } from 'react';
import type { BaseTabProps } from '../types';
import type { TripImage } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImagePlus, Trash2, Upload, X as XIcon } from 'lucide-react';
import { uploadImage } from '@/lib/uploadHelpers';
import styles from './OverviewTab.module.css';

interface Tag {
  id: string;
  text: string;
}

export function OverviewTab({ tripData, updateField }: BaseTabProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overviewImages = tripData.images.filter(img => img.section === 'overview');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<Tag[]>(tripData.tags || []);
  

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = {
        id: Date.now().toString(),
        text: tagInput.trim()
      };
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      updateField('tags', updatedTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    setTags(updatedTags);
    updateField('tags', updatedTags);
  };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      setUploading(true);
      setError(null);
  
      try {
        const { url, alt } = await uploadImage(file, 'overview');
  
        // Create new image object
        const newImage: TripImage = {
          src: url,
          alt,
          section: 'overview',
          priority: !tripData.images.some(img => img.section === 'overview')
        };
  
        // Update field with new image
        updateField('images', [...tripData.images, newImage]);
  
        // Clear file input
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
      img.section !== 'overview' || 
      tripData.images.indexOf(img) !== tripData.images.indexOf(overviewImages[index])
    );
    updateField('images', updatedImages);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.formSection}>
          <Card>
            <CardContent className="space-y-6 pt-6">
              <FormField label="Trip Title" required>
                <Input
                  value={tripData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter trip title"
                  className={styles.input}
                />
              </FormField>

              <FormField label="Subtitle">
                <Input
                  value={tripData.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  placeholder="Enter subtitle"
                  className={styles.input}
                />
              </FormField>

              <FormField label="Overview">
                <textarea
                  value={tripData.overview ?? ''}
                  onChange={(e) => updateField('overview', e.target.value)}
                  placeholder="Enter trip overview"
                  rows={6}
                  className={styles.textarea}
                />
              </FormField>

              <FormField label="Start Date" required>
                <Input
                  type="startdate"
                  value={tripData.startDate}
                  onChange={(e) => updateField('date', e.target.value)}
                  className={styles.input}
                />
              </FormField>

              <FormField label="End Date" required>
                <Input
                  type="endDate"
                  value={tripData.endDate}
                  onChange={(e) => updateField('date', e.target.value)}
                  className={styles.input}
                />
              </FormField>

              <FormField label="Tags">
                <div className={styles.tagInput}>
                  <div className={styles.tagContainer}>
                    {tags.map(tag => (
                      <span key={tag.id} className={styles.tag}>
                        {tag.text}
                        <button
                          type='button'
                          onClick={() => handleRemoveTag(tag.id)}
                          className={styles.removeTag}
                        >
                          <XIcon className='h-3 w-3' />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type tag and press Enter"
                    className={styles.input}
                  />
                </div>
                <p className={styles.tagHelp}>
                  Press Enter to add a new tag
                </p>
              </FormField>
            </CardContent>
          </Card>
        </div>

        <div className={styles.imageSection}>
          <Card>
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Images</h3>
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

              <div className={styles.imageGrid}>
                {overviewImages.map((image, index) => (
                  <div key={index} className={styles.imageWrapper}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={styles.image}
                    />
                    <div className={styles.imageOverlay}>
                      <Button
                        variant="destructive"
                        size="sm"
                        className={styles.deleteButton}
                        onClick={() => removeImage(index)}
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

              {!overviewImages.length && (
                <div className={styles.emptyState}>
                  <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click "Upload Image" to add overview images
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
