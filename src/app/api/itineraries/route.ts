// src/app/api/itineraries/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Itineraries API Route' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: 'Itinerary created', data: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: 'Itinerary updated', data: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update itinerary' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Itinerary ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Itinerary deleted', id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete itinerary' },
      { status: 400 }
    );
  }
}