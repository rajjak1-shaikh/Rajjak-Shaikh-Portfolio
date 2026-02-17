// app/api/newsletter/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Newsletter from '../../../models/Newsletter.js';
import { sendNewsletterWelcomeEmail } from '../../../lib/email.js';

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    await connectDB();

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: normalizedEmail });

    if (existing?.status === 'active') {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter' },
        { status: 409 }
      );
    }

    // Reactivate or create new subscriber
    if (existing) {
      existing.status = 'active';
      existing.subscribedAt = new Date();
      await existing.save();
    } else {
      await Newsletter.create({
        email: normalizedEmail,
        status: 'active',
        subscribedAt: new Date()
      });
    }

    // Send welcome email - await to ensure function doesn't terminate early
    let emailSent = false;
    try {
      await sendNewsletterWelcomeEmail(normalizedEmail);
      console.log('[Newsletter] Welcome email sent successfully to:', normalizedEmail);
      emailSent = true;
    } catch (emailError) {
      console.error('[Newsletter] Welcome email FAILED for:', normalizedEmail);
      console.error('[Newsletter] Error:', emailError.message);
      // Don't fail the request if email fails - subscription is still valid
    }

    const message = existing
      ? 'Welcome back! Your subscription has been reactivated.'
      : emailSent
        ? 'Successfully subscribed to newsletter! Check your email for confirmation.'
        : 'Successfully subscribed! (Welcome email may arrive shortly)';

    return NextResponse.json({ success: true, message }, { status: 201 });

  } catch (error) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to subscribe to newsletter',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET method for admin to retrieve subscribers
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '100');

    const subscribers = await Newsletter.find({ status })
      .sort({ subscribedAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      subscribers,
      count: subscribers.length
    });

  } catch (error) {
    console.error('Get Subscribers Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve subscribers' },
      { status: 500 }
    );
  }
}