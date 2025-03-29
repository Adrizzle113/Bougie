// src/components/itinerarytemplate/map/map.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { Location } from '@/types/trip';
import styles from './Map.module.css';

interface MapProps {
  locations?: Location[];
  mapUrl?: string;
}

export default function Map({ locations = [], mapUrl }: MapProps) {
  const [validatedMapUrl, setValidatedMapUrl] = useState<string>('');
  const [mapError, setMapError] = useState(false);

  // Google Maps embed URL patterns
  const GOOGLE_MAPS_PATTERNS = [
    /^https:\/\/www\.google\.com\/maps\/embed\?/,
    /^https:\/\/maps\.google\.com\/maps\?/,
    /^https:\/\/www\.google\.com\/maps\?/,
    /^https:\/\/goo\.gl\/maps\//
  ];

  // Transform various Google Maps URL formats into embed URL
  const transformToEmbedUrl = (url: string): string => {
    try {
      // If it's already an embed URL, return it
      if (url.includes('/maps/embed')) {
        return url;
      }

      // Extract location query from various URL formats
      let query = '';
      const urlObj = new URL(url);

      if (url.includes('goo.gl')) {
        // For shortened URLs, use as place query
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${encodeURIComponent(url)}!5e0!3m2!1sen!2sus!4v`;
      }

      if (url.includes('/maps/place/')) {
        query = url.split('/maps/place/')[1].split('/')[0];
      } else if (urlObj.searchParams.has('q')) {
        query = urlObj.searchParams.get('q') || '';
      }

      if (!query) {
        throw new Error('Invalid map URL format');
      }

      // Construct embed URL
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(query)}!5e0!3m2!1sen!2sus!4v${Date.now()}`;
    } catch (error) {
      console.error('Error transforming map URL:', error);
      return '';
    }
  };

  // Validate and set map URL
  useEffect(() => {
    if (!mapUrl) {
      setMapError(true);
      return;
    }

    const isValidUrl = GOOGLE_MAPS_PATTERNS.some(pattern => pattern.test(mapUrl));
    if (!isValidUrl) {
      setMapError(true);
      return;
    }

    const embedUrl = transformToEmbedUrl(mapUrl);
    if (!embedUrl) {
      setMapError(true);
      return;
    }

    setValidatedMapUrl(embedUrl);
    setMapError(false);
  }, [mapUrl]);

  return (
    <div className={styles.container}>
      <div className={styles.stickyHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Journey Map</h2>
        </div>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.mapWrapper}>
          {!mapError && validatedMapUrl ? (
            <iframe
              src={validatedMapUrl}
              className={styles.map}
              width="100%"
              height="450"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              title="Trip Map"
            />
          ) : (
            <div className={styles.mapError}>
              <p>Unable to load map. Please provide a valid Google Maps URL.</p>
              <p className={styles.mapErrorHint}>
                Example: (use embed) https://www.google.com/maps?q=Zambia
              </p>
            </div>
          )}
        </div>

        {locations && locations.length > 0 && (
          <div className={styles.locationList}>
            {locations.map((item, index) => (
              <div key={index} className={styles.locationItem}>
                <div className={styles.locationMarker}>
                  <span className={styles.markerNumber}>{index + 1}</span>
                </div>
                <div className={styles.locationInfo}>
                  <div className={styles.locationDays}>{item.days}</div>
                  <div className={styles.locationName}>{item.location}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}