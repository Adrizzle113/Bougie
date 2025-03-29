// src/components/itineraries/itinerarytemplate/imagepanel/ImagePanel.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './ImagePanel.module.css';
import type { TripImage } from '@/types/trip';

interface ImagePanelProps {
  images: TripImage[];
  activeSection: string;
}

export default function ImagePanel({ images, activeSection }: ImagePanelProps) {
  const [currentImage, setCurrentImage] = useState<TripImage | null>(null);

  useEffect(() => {
    if (!images || images.length === 0) return;

    // Map sections to their corresponding image sections
    const sectionMappings: Record<string, string[]> = {
      'overview': ['overview'],
      'travel-brief': ['travelBrief'],
      'locations': ['map', 'locations'],
      'itinerary': ['itinerary'],
      'inclusions': ['inclusions'],
      'cta': ['cta'],
      'terms': ['terms']
    };

    // Get the valid image sections for current section
    const validSections = sectionMappings[activeSection] || ['overview'];

    // Find matching image
    const sectionImage = images.find(img => 
      img.section && validSections.includes(img.section)
    );

    if (sectionImage) {
      setCurrentImage(sectionImage);
      return;
    }

    // Fallback to overview image or first image
    const overviewImage = images.find(img => 
      img.section === 'overview' || !img.section
    );

    setCurrentImage(overviewImage || images[0]);
  }, [images, activeSection]);

  if (!currentImage) {
    return null;
  }

  return (
    <div className={styles.leftPanel}>
      <div className={styles.imageContainer}>
        <div className={styles.imageWrapper}>
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            priority
            sizes="50vw"
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <div className={styles.overlay} />
        </div>
      </div>
    </div>
  );
}