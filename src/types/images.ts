// src/types/images.ts
export interface TripImage {
    src: string;  // Using src instead of url
    alt: string;
    section?: string;
    priority?: boolean;
  }