import { isAdmin } from "@/src/lib/auth"
import { connectToDatabase } from "@/src/lib/mongodb"
import User from "@/src/models/User"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  // Check admin authentication
  const adminCheck = await isAdmin(request)
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectToDatabase()
    const users = await User.find({}).select("-password")
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST /api/users - Register a new user
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = new User({
      email: body.email,
      password: body.password, // In a real app, hash this password
      role: body.role || "user",
      name: body.name,
    })

    await newUser.save()

    // Don't return the password
    const userResponse = newUser.toObject()
    delete userResponse.password

    return NextResponse.json(userResponse, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

