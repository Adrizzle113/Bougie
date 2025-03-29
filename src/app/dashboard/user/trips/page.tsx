// src/app/dashboard/user/trips/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  imageUrl?: string;
  participants: number;
}

const TripsPage: React.FC = () => {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/user/trips');
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        setTrips(data.trips || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trips');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const filterTrips = (type: 'upcoming' | 'past') => {
    const today = new Date();
    return trips.filter(trip => {
      const endDate = new Date(trip.endDate);
      return type === 'upcoming' ? endDate >= today : endDate < today;
    });
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
        <button
          onClick={() => router.push('/dashboard/user/trips/new')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Plan New Trip
        </button>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming Trips
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 ${
              activeTab === 'past'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Past Trips
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterTrips(activeTab).map((trip) => (
          <div
            key={trip.id}
            onClick={() => router.push(`/dashboard/user/trips/${trip.id}`)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="h-48 bg-gray-200 rounded-t-lg relative">
              {trip.imageUrl ? (
                <img
                  src={trip.imageUrl}
                  alt={trip.destination}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
              <span
                className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  trip.status
                )}`}
              >
                {trip.status}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {trip.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{trip.destination}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {new Date(trip.startDate).toLocaleDateString()} -{' '}
                  {new Date(trip.endDate).toLocaleDateString()}
                </span>
                <span>{trip.participants} travelers</span>
              </div>
            </div>
          </div>
        ))}
        
        {filterTrips(activeTab).length === 0 && (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming trips. Start planning your next adventure!" 
                : "You haven't completed any trips yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;