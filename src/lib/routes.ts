// src/lib/routes.ts
import type { Route } from 'next';

// Define all application routes here using Route type
export const ROUTES = {
  ADMIN: {
    DASHBOARD: '/dashboard/admin' as Route,
    TRIPS: '/dashboard/admin/trips' as Route,
    NEW_TRIP: '/dashboard/admin/trips/new' as Route,
    EDIT_TRIP: (id: string) => `/dashboard/admin/trips/${id}/edit` as Route,
    USERS: '/dashboard/admin/users' as Route,
    INVITE_USER: '/dashboard/admin/users/invite' as Route,
    ITINERARIES: '/dashboard/admin/itineraries' as Route,
    NEW_ITINERARY: '/dashboard/admin/itineraries/create' as Route,
    EDIT_ITINERARY: (id: string) => `/dashboard/admin/itineraries/${id}/edit` as Route,
    GROUPS: '/dashboard/admin/groups' as Route,
    FORMS: '/dashboard/admin/forms' as Route,
  },
  AUTH: {
    LOGIN: '/auth/login' as Route,
    REGISTER: '/auth/register' as Route,
    VERIFY: '/auth/verify' as Route,
    RESET_PASSWORD: '/auth/reset-password' as Route,
  },
  USER: {
    DASHBOARD: '/dashboard/user' as Route,
    PROFILE: '/dashboard/user/profile' as Route,
    TRIPS: '/dashboard/user/trips' as Route,
    NEW_TRIP: '/dashboard/user/trips/new' as Route,
    TRIP_DETAILS: (id: string) => `/dashboard/user/trips/${id}` as Route,
    GROUPS: '/dashboard/user/group' as Route,
    GROUP_DETAILS: (id: string) => `/dashboard/user/group/${id}` as Route,
  },
  BOOKING: {
    FLOW: (tripId: string) => `/trips/${tripId}/book` as Route,
    PAYMENT: (tripId: string) => `/trips/${tripId}/payment` as Route,
    CONFIRMATION: (tripId: string) => `/trips/${tripId}/confirmation` as Route,
    PASSENGER_DETAILS: (tripId: string) => `/trips/${tripId}/passenger-details` as Route,
  },
  PUBLIC: {
    HOME: '/' as Route,
    DASHBOARD: '/dashboard' as Route,
    ITINERARY: (id: string) => `/itineraries/${id}` as Route,
    BOOKING: (id: string) => `/trips/${id}` as Route,
  },
} as const;

// Helper function to ensure type safety when using routes
export function createRoute(path: Route): Route {
  return path;
}