// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const { bookingDetails, customerEmail, customerDetails, passengerCount } = body;

    if (!bookingDetails?.tripData) {
      return NextResponse.json(
        { error: 'Invalid booking details' },
        { status: 400 }
      );
    }

    // Format prices for Stripe (in cents)
    const amount = Math.round(bookingDetails.depositAmount * 100);
    const totalAmount = Math.round(bookingDetails.totalPrice * 100);

    // Create line item for Stripe
    const lineItem = {
      price_data: {
        currency: 'usd',
        unit_amount: amount,
        product_data: {
          name: bookingDetails.tripData.title || 'Luxury Trip Package',
          description: `${passengerCount} passenger(s) - ${bookingDetails.selectedRoom?.type || 'Standard Room'}`,
        },
      },
      quantity: 1,
    };

    try {
      const absoluteSuccessUrl = 'http://localhost:3000/payment-confirmation';
      const absoluteCancelUrl = 'http://localhost:3000/trips/' + bookingDetails.tripData.id + '/payment';

      console.log('Creating session with URLs:', {
        success: absoluteSuccessUrl,
        cancel: absoluteCancelUrl
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [lineItem],
        mode: 'payment',
        success_url: `${absoluteSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: absoluteCancelUrl,
        customer_email: customerEmail,
        metadata: {
          tripId: bookingDetails.tripData.id,
          passengerCount: passengerCount.toString(),
          roomType: bookingDetails.selectedRoom?.type,
          totalAmount: totalAmount.toString(),
          paymentType: bookingDetails.paymentType,
        },
      });

      console.log('Stripe session created:', {
        id: session.id,
        url: session.url
      });

      if (!session.url) {
        throw new Error('No checkout URL provided by Stripe');
      }

      return NextResponse.json({ 
        sessionId: session.url,
        success: true 
      });

    } catch (stripeError: any) {
      console.error('Stripe session creation error:', stripeError);
      return NextResponse.json({
        error: stripeError.message,
        success: false
      }, { 
        status: 500 
      });
    }

  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      success: false
    }, { 
      status: 500 
    });
  }
}