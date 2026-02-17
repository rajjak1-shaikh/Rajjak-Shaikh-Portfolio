import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

// GET: Get all published blogs
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    let query = { published: true };
    
    // Filter by tag
    if (tag) {
      query.tags = tag;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-__v');
    
    const total = await Blog.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      count: blogs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: blogs,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch blogs',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new blog post (admin only)
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const blog = await Blog.create(body);
    
    return NextResponse.json(
      {
        success: true,
        message: 'Blog created successfully',
        data: blog,
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create blog',
        error: error.message,
      },
      { status: 400 }
    );
  }
}