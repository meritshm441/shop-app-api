import { connectToDatabase } from "@/src/lib/mongodb"
import User from "@/src/models/User"
import { NextResponse } from "next/server"

// This is a debug endpoint to check what users are in the database
export async function GET() {
  try {
    await connectToDatabase()

    // Get all users but don't return passwords
    const users = await User.find({}).select("-password")

    return NextResponse.json({
      count: users.length,
      users: users.map((user) => ({
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: user.createdAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching users for debug:", error)
    return NextResponse.json(
      { error: "Failed to fetch users", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

