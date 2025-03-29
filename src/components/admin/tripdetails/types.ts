// src/components/admin/tripdetails/types.ts
import type { AdminTrip } from '@/types';

export interface BaseTabProps {
  tripData: AdminTrip;
  updateField: <K extends keyof AdminTrip>(key: K, value: AdminTrip[K]) => void;
}