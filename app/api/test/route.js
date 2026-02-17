// app/api/test/route.js
// Simple test endpoint to verify API routes are working

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'API routes are working!',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request) {
  const body = await request.json();
  
  return NextResponse.json({ 
    success: true, 
    message: 'POST request received',
    received: body,
    timestamp: new Date().toISOString()
  });
}