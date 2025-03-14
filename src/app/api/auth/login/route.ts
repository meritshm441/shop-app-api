import { type NextRequest, NextResponse } from "next/server"
import { findUserByCredentials, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Login attempt with email:", body.email)
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    // Validate required fields
    if (!body.email || !body.password) {
      console.log("Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by credentials
    console.log("Finding user by credentials...")
    const user = await findUserByCredentials(body.email, body.password)

    if (!user) {
      console.log("Invalid credentials for email:", body.email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("User authenticated successfully:", user.email)

    // Generate JWT token
    let token
    try {
      token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      })
      console.log("JWT token generated successfully")
    } catch (error) {
      console.error("Error generating token:", error)
      return NextResponse.json({ error: "Authentication error" }, { status: 500 })
    }

    // Return successful response
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error in login:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

