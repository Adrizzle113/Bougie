// src/types/index.ts

// Base types
export {
    type BaseItem,
    type BaseImage,
    type AdminTripStatus,
    type UserTripStatus,
    type TripStatus,
    type ActivityType,
    type TripImageSection,
    type DaySectionType,
    ACTIVITY_TYPES,
    TRIP_IMAGE_SECTIONS,
    DAY_SECTIONS,
  } from './baseTypes';
  
  // Itinerary types
  export {
    type TripImage,
    type MoreDetails,
    type ActivityContent,
    type TimelineItem,
    type ItineraryItem,
  } from './itinerary';
  
  // Pricing types
  export {
    type RoomRate,
    type PricingAddOn,
    type TripPricing,
    type SelectedRoom,
    type PreAccommodation,
  } from './pricing';
  
  // Trip types
  export {
    type TripTiming,
    type Trip,
    type AdminTrip,
    type TripBase,
    type TripAccommodation,
    type FlightInfo,
    type TravelBrief,
    type Location,
    type CTAContent,
  } from './trip';
  
  // Booking types
  export {
    type PassengerForm,
    type SpecialRequirements,
    type BillingDetails,
    type BookingDetails,
    type BookingFlowProps,
    type PassengerDetailsProps,
    type BookingDashboardProps,
    type BookingSidebarProps,
    type RoomSelectorProps,
    type BookingTopBarProps,
    type BookingCalculations,
  } from './booking';
  
  // Luxury trip types
  export {
    type LuxuryTripData,
    type LuxuryTripModel,
    type LuxuryTrip,
    isActivityContent,
    isMoreDetails,
    getHighlightsFromItinerary,
  } from './luxuryTrip.types';