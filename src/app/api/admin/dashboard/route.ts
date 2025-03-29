// src/app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for testing
    const mockData = {
      stats: {
        totalTrips: 25,
        activeTrips: 8,
        draftTrips: 5,
        publishedTrips: 12,
        recentTrips: [
          {
            id: '1',
            title: 'Paris Adventure',
            subtitle: 'Experience the City of Light'
          },
          {
            id: '2',
            title: 'Tokyo Explorer',
            subtitle: 'Discover Modern Japan'
          },
          {
            id: '3',
            title: 'Rome Holiday',
            subtitle: 'Walk Through History'
          }
        ]
      }
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}