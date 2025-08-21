import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Server-side cleanup if needed
  // In this case, we mainly rely on client-side cookie removal

  return NextResponse.json({
    success: true,
    message: 'Disconnected successfully',
  });
}