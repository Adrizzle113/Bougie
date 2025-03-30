// src/lib/constants.ts
import type { LuxuryTripData } from '@/types/luxuryTrip.types';

// Get current date for defaults
const currentDate = new Date().toISOString().split('T')[0];

export const EMPTY_TRIP: LuxuryTripData = {
  id: crypto.randomUUID(), // Generate a temporary ID
  title: '',
  subtitle: '',
  overview: '',
  date: currentDate,
  startDate: currentDate,
  endDate: currentDate,
  status: 'draft',
  images: [],
  included: [],
  excluded: [],
  itinerary: [],
  mapLocations: [],
  terms: '',
  timing: {
    startDate: currentDate,
    endDate: currentDate,
    location: ''
  },
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
    roomRates: []
  },
  cta: {
    mainButtonText: 'Book Your Journey',
    secondaryButtonText: 'Download Itinerary',
    heading: 'Ready to Begin Your Journey?',
    description: 'Experience luxury travel like never before. Contact us to start planning your bespoke adventure.',
    mainButtonLink: ''
  }
};