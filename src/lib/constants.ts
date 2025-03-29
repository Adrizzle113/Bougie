// src/lib/constants.ts
import type { LuxuryTripData } from '@/types/luxuryTrip.types';

export const EMPTY_TRIP: LuxuryTripData = {
  id: crypto.randomUUID(), // Generate a temporary ID
  title: '',
  subtitle: '',
  overview: '',
  date: '',
  status: 'draft',
  images: [],
  included: [],
  excluded: [],
  itinerary: [],
  mapLocations: [],
  terms: '',
  travelBrief: {
    description: '',
    flights: {
      arrival: '',
      departure: '',
      notes: ''
    },
    accommodations: [],
    mapUrl: ''
  },
  highlights: [],
  tags: [],
  pricing: {
    basePrice: 0,
    deposit: 0,
    depositType: 'percentage',
    addOns: [],
    roomRates: [] // Add the missing roomRates property
  },
  cta: {
    mainButtonText: 'Book Your Journey',
    secondaryButtonText: 'Download Itinerary',
    heading: 'Ready to Begin Your Journey?',
    description: 'Experience luxury travel like never before. Contact us to start planning your bespoke adventure.',
    mainButtonLink: ''
  }
};