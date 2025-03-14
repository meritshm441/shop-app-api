import { NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"

export async function GET() {
  try {
    // Test JWT functionality
    const testToken = jwt.sign({ test: "data" }, "test-secret")

    return NextResponse.json({
      status: "JWT package is working correctly",
      testToken,
    })
  } catch (error) {
    console.error("JWT test error:", error)
    return NextResponse.json(
      {
        error: "JWT package error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

