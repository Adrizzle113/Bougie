// src/lib/routes.ts
import { Route } from 'next';

export const ROUTES = {
  ADMIN: {
    DASHBOARD: '/dashboard/admin' as Route,
    TRIPS: '/dashboard/admin/trips' as Route,
    NEW_TRIP: '/dashboard/admin/trips/new' as Route,
    EDIT_TRIP: (id: string) => `/dashboard/admin/trips/${id}/edit` as Route,
  },
  AUTH: {
    LOGIN: '/auth/login' as Route,
    REGISTER: '/auth/register' as Route,
  },
  USER: {
    DASHBOARD: '/dashboard/user' as Route,
    PROFILE: '/dashboard/user/profile' as Route,
  },
  BOOKINGS: '/bookings' as Route,
  SUPPORT: '/support' as Route,
  HOMEPAGE: '/' as Route,
  BOOKING: (tripId: string) => `/trips/${tripId}/book` as Route,
  PAYMENT: (tripId: string) => `/trips/${tripId}/payment` as Route,
  CONFIRMATION: (tripId: string) => `/trips/${tripId}/confirmation` as Route,
  PASSENGER_DETAILS: (tripId: string) => `/trips/${tripId}/passenger-details` as Route,
} as const;

// Type-safe route generator
export function createRoute(path: Route): Route {
  return path;
}