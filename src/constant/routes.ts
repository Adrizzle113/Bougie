// src/constants/routes.ts
export const ROUTES = {
    ADMIN: {
      TRIPS: '/dashboard/admin/trips' as const,
      NEW_TRIP: '/dashboard/admin/trips/new' as const,
    },
    AUTH: {
      LOGIN: '/auth/login' as const,
    },
    USER: {
      PROFILE: '/dashboard/user/profile' as const,
    },
  } as const;