import { isAdmin, requireAuth } from "@/src/lib/auth"
import { connectToDatabase } from "@/src/lib/mongodb"
import User from "@/src/models/User"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/users/:id - Get a specific user
export async function GET(request: NextRequest, context: any) {
  try {
    const id = context.params.id
    // Check authentication
    const { isAuthenticated, user: authUser } = await requireAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Users can only access their own data unless they're an admin
    const isUserAdmin = await isAdmin(request)
    if (id !== authUser.id && !isUserAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()
    const user = await User.findById(id).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// PUT /api/users/:id - Update a user
export async function PUT(request: NextRequest, context: any) {
  try {
    const id = context.params.id
    // Check authentication
    const { isAuthenticated, user: authUser } = await requireAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Users can only update their own data unless they're an admin
    const isUserAdmin = await isAdmin(request)
    if (id !== authUser.id && !isUserAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()
    const body = await request.json()

    // Don't allow role changes unless admin
    if (body.role && !isUserAdmin) {
      delete body.role
    }

    // Don't allow password to be updated through this endpoint
    if (body.password) {
      delete body.password
    }

    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user with new data
    const updatedUser = await User.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true }).select(
      "-password",
    )

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// DELETE /api/users/:id - Delete a user (admin only)
export async function DELETE(request: NextRequest, context: any) {
  // Check admin authentication
  const adminCheck = await isAdmin(request)
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const id = context.params.id
    await connectToDatabase()
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove user
    await User.findByIdAndDelete(id)

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

