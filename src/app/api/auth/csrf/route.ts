import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Mock CSRF endpoint - replace with actual NextAuth.js implementation
  return NextResponse.json({ csrfToken: 'mock-csrf-token' })
}