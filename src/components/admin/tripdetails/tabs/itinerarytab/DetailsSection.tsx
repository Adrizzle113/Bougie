// src/components/admin/tripdetails/tabs/itinerarytab/DetailsSection.tsx
import React, { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GripHorizontal,
  ChevronDown,
  ChevronUp,
  Trash2,
  Upload,
  Video,
  Link as LinkIcon,
  ImagePlus
} from 'lucide-react';
import type { DaySectionType, MoreDetails } from '@/types/luxuryTrip.types';
import { createNewTripImage } from '@/lib/utils';
import styles from './DetailsSection.module.css';

interface DetailsSectionProps {
  id: string;
  details: MoreDetails;
  onUpdate: (details: MoreDetails) => void;
  onDelete: () => void;
  onImageUpload: (file: File) => Promise<{ url: string; alt: string }>;
  onImageRemove: (index: number) => void;
}

export default function DetailsSection({
  id,
  details,
  onUpdate,
  onDelete,
  onImageUpload,
  onImageRemove
}: DetailsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const { url, alt } = await onImageUpload(file);
      
      // Use createNewTripImage to ensure all required properties are included
      const newImage = createNewTripImage(url, alt, 'itinerary');
      
      onUpdate({
        ...details,
        images: [...(details.images || []), newImage]
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.sectionContainer}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <button {...attributes} {...listeners} className={styles.dragHandle}>
            <GripHorizontal className="h-5 w-5" />
          </button>

          <Select
            value={details.sectionType}
            onValueChange={(value: DaySectionType) => onUpdate({
              ...details,
              sectionType: value
            })}
          >
            <SelectTrigger className={styles.dropdown}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activities">Activities</SelectItem>
              <SelectItem value="Accommodations">Accommodations</SelectItem>
              <SelectItem value="Property Overview">Property Overview</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={styles.buttonGroup}>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={onDelete}
            className={styles.deleteButton}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className={isExpanded ? styles.expandedContent : styles.collapsedContent}>
        <div className={styles.sectionContent}>
          {/* Description */}
          <Textarea
            value={details.content}
            onChange={(e) => onUpdate({
              ...details,
              content: e.target.value
            })}
            placeholder="Add section details..."
            className={styles.textArea}
          />

          {/* Video URL */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Video URL</label>
            <div className="relative">
              <LinkIcon className={styles.inputIcon} />
              <Input
                value={details.videoUrl || ''}
                onChange={(e) => onUpdate({
                  ...details,
                  videoUrl: e.target.value
                })}
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                className={styles.input}
              />
            </div>
          </div>

          {/* Images Section */}
          <div className={styles.imageSection}>
            <label className={styles.label}>Images</label>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={styles.uploadButton}
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>

              {details.images && details.images.length > 0 ? (
                <div className={styles.imageGrid}>
                  {details.images.map((image, index) => (
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
                          onClick={() => onImageRemove(index)}
                          className={styles.deleteImageButton}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <ImagePlus className={styles.emptyStateIcon} />
                  <p className="text-sm text-gray-500">
                    No images uploaded yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}