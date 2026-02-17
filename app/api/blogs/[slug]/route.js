import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

// GET: Get single blog by slug
export async function GET(request, { params }) {
  try {
    await connectDB();

    const blog = await Blog.findOne({ 
      slug: params.slug, 
      published: true 
    });
    
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: 'Blog not found',
        },
        { status: 404 }
      );
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    return NextResponse.json({
      success: true,
      data: blog,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch blog',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT: Update a blog post (admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const body = await request.json();
    const blog = await Blog.findOneAndUpdate(
      { slug: params.slug },
      body,
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: 'Blog not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update blog',
        error: error.message,
      },
      { status: 400 }
    );
  }
}

// DELETE: Delete a blog post (admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const blog = await Blog.findOneAndDelete({ slug: params.slug });
    
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: 'Blog not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete blog',
        error: error.message,
      },
      { status: 500 }
    );
  }
}