// app/api/newsletter/unsubscribe/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Newsletter from '../../../../models/Newsletter.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const subscriber = await Newsletter.findOne({ email });
    
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found in our newsletter list' },
        { status: 404 }
      );
    }
    
    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json({ 
        success: true,
        message: 'You are already unsubscribed from our newsletter.'
      });
    }
    
    // Update status to unsubscribed
    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully unsubscribed from newsletter. We\'re sorry to see you go!'
    });
    
  } catch (error) {
    console.error('Unsubscribe Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to unsubscribe',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}