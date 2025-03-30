// src/app/api/trip-confirmation/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Export GET handler instead of middleware
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.json({ success: true });
}