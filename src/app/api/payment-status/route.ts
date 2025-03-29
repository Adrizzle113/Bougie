// app/api/payment-status/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Get metadata from the payment
    const metadata = (session.payment_intent as Stripe.PaymentIntent)?.metadata || {};
    
    const paymentDetails = {
      customerEmail: session.customer_details?.email,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      paymentType: metadata.paymentType,
      remainingAmount: parseInt(metadata.remainingAmount || '0') / 100,
      paymentPlan: metadata.paymentPlan ? JSON.parse(metadata.paymentPlan) : null,
      tripId: metadata.tripId,
    };

    return NextResponse.json({
      success: true,
      paymentDetails
    });

  } catch (error: any) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment status' },
      { status: 500 }
    );
  }
}