import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Mock session endpoint - replace with actual NextAuth.js implementation
  return NextResponse.json({ user: null })
}