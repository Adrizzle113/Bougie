// src/types/booking.ts
import type { Trip } from './trip';
import type { RoomRate, PricingAddOn, SelectedRoom } from './pricing';

export interface SpecialRequirements {
  dietary: boolean;
  medical: boolean;
  mobility: boolean;
  other: boolean;
  details: string;
}

export interface PassengerForm {
  title: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  countryCode?: string;
  phone?: string;
  email: string;
  specialRequirements: SpecialRequirements;
}

export interface BillingDetails {
  country: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface BookingDetails {
  tripId: string;
  passengers: number;
  roomType: string;
  selectedExtras: string[];
  selectedRoom?: SelectedRoom;
  totalPrice: number;
  depositAmount: number;
}

export interface BookingCalculations {
  calculateTotal: (rates: RoomRate[], addOns: PricingAddOn[], passengers: number) => number;
  calculateDeposit: (total: number, depositType: 'fixed' | 'percentage', depositAmount: number) => number;
}

export interface BookingFlowProps {
  tripData: {
    success: boolean;
    trip: Trip;
  };
}

export interface PassengerDetailsProps {
  tripData: Trip;
  initialPassengers: number;
  onComplete: () => void;
}

export interface BookingDashboardProps {
  tripData: Trip;
  children: React.ReactNode;
  currentStep?: number;
}

export interface BookingSidebarProps {
  trip: Trip;
  selectedRoom?: SelectedRoom;
  selectedExtras?: string[];
  passengers?: number;
}

export interface RoomSelectorProps {
  passengers: number;
  selectedRoomType: string;
  onRoomSelect: (roomType: string) => void;
  roomRates: RoomRate[];
}

export interface BookingTopBarProps {
  currentStep: number;
}

