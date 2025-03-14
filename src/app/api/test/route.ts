import { NextResponse } from "next/server"

// Simple health check endpoint
export async function GET() {
  return NextResponse.json({ status: "API is running" })
}

