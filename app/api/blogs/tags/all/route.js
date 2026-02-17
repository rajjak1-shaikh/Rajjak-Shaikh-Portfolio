import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

// GET: Get all unique tags
export async function GET(request) {
  try {
    await connectDB();

    const tags = await Blog.distinct('tags', { published: true });
    
    return NextResponse.json({
      success: true,
      count: tags.length,
      data: tags,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch tags',
        error: error.message,
      },
      { status: 500 }
    );
  }
}