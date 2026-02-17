import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';

// GET: Fetch single contact
export async function GET(request, { params }) {
  try {
    await connectDB();

    const contact = await Contact.findById(params.id);

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contact not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching contact',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// PATCH: Update contact status
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const body = await request.json();
    const { status } = body;

    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid status'
        },
        { status: 400 }
      );
    }

    const contact = await Contact.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contact not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact status updated',
      data: contact
    });

  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating contact',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete contact
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const contact = await Contact.findByIdAndDelete(params.id);

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contact not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting contact',
        error: error.message
      },
      { status: 500 }
    );
  }
}