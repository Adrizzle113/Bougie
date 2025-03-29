// src/app/api/trips/[id]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LuxuryTripDAO } from '@/lib/dao/luxuryTrip.dao';
import { validateEnv } from '@/lib/config/validateEnv';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// Default pricing values if none exist
const DEFAULT_PRICING = {
  basePrice: 1788.00,
  deposit: 0,
  depositType: 'fixed',
  addOns: []
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    validateEnv();
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    const trip = await LuxuryTripDAO.getTrip(id);
    
    if (!trip) {
      return NextResponse.json(
        { success: false, error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Ensure pricing data exists with fallback to defaults
    const tripWithPricing = {
      ...trip,
      pricing: trip.pricing || DEFAULT_PRICING
    };

    return NextResponse.json({
      success: true,
      trip: tripWithPricing
    });
  } catch (error) {
    console.error('Failed to fetch trip:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trip' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    validateEnv();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Ensure pricing data is properly structured when updating
    const updatedData = {
      ...body,
      pricing: body.pricing || DEFAULT_PRICING
    };

    const trip = await LuxuryTripDAO.updateTrip(id, updatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Trip updated successfully',
      trip 
    });
  } catch (error) {
    console.error('Failed to update trip:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update trip' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    validateEnv();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    await LuxuryTripDAO.deleteTrip(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Trip deleted successfully' 
    });
  } catch (error) {
    console.error('Failed to delete trip:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete trip' },
      { status: 500 }
    );
  }
}