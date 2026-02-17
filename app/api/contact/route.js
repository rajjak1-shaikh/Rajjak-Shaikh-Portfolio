// app/api/contact/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Contact from '../../../models/Contact.js';
import { sendContactEmail } from '../../../lib/email.js';

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, subject, message, name } = body;

    // Validate required fields
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Create new contact entry
    const contact = new Contact({
      name: name || 'Anonymous',
      email,
      subject,
      message,
      status: 'new',
      createdAt: new Date()
    });

    // Save to database
    await contact.save();

    // Send email notification - await to ensure function doesn't terminate early
    let emailSent = false;
    try {
      await sendContactEmail({ name: name || 'Anonymous', email, subject, message });
      console.log('[Contact] Email notification sent successfully for:', email);
      emailSent = true;
    } catch (emailError) {
      console.error('[Contact] Email sending FAILED for:', email);
      console.error('[Contact] Error:', emailError.message);
      // Don't fail the request - contact was still saved
    }

    return NextResponse.json({
      success: true,
      message: emailSent
        ? 'Thank you for contacting us! We will get back to you soon.'
        : 'Message received! We will get back to you soon.',
      contactId: contact._id
    }, { status: 201 });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to submit contact form',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET method for admin to retrieve contacts
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = {};
    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      contacts,
      count: contacts.length
    });

  } catch (error) {
    console.error('Get Contacts Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve contacts' },
      { status: 500 }
    );
  }
}