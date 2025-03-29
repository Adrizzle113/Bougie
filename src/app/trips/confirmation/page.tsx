// src/app/trips/confirmation/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

export default function ConfirmationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-sm text-gray-500">
              Your booking confirmation has been sent to your email address.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push(ROUTES.BOOKINGS)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View My Bookings
            </button>

            <button
              onClick={() => router.push(ROUTES.SUPPORT)}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Need Help?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}