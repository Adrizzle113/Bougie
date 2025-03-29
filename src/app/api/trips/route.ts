// src/app/api/trips/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LuxuryTripDAO } from '@/lib/dao/luxuryTrip.dao';
import { testDynamoDBConnection } from '@/lib/dao/test-connection';
import { validateEnv } from '@/lib/config/validateEnv';

export async function GET(request: NextRequest) {
  try {
    validateEnv();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | null;
    const trips = await LuxuryTripDAO.listTrips(status || undefined);
    return NextResponse.json({ success: true, trips });
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    validateEnv();
    const isConnected = await testDynamoDBConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const trip = await LuxuryTripDAO.createTrip(body);
    return NextResponse.json({ 
      success: true, 
      message: 'Trip created successfully',
      trip 
    });
  } catch (error) {
    console.error('Failed to create trip:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create trip' },
      { status: 500 }
    );
  }
}