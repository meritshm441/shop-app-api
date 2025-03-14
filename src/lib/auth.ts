import type { NextRequest } from "next/server"
import * as jwt from "jsonwebtoken"
import { connectToDatabase } from "./mongodb"
import User from "@/models/User"

// Secret key for JWT signing (in a real application, use an environment variable)
const JWT_SECRET = "your-jwt-secret-key"

// JWT token expiration (e.g., 30 days)
const JWT_EXPIRES_IN = "30d"

export interface UserPayload {
  id: string
  email: string
  role: "user" | "admin"
}

// Generate JWT token for a user
export function generateToken(user: Omit<UserPayload, "iat" | "exp">) {
  try {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    )
  } catch (error) {
    console.error("Error generating token:", error)
    throw new Error("Failed to generate authentication token")
  }
}

// Verify JWT token
export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  return authHeader.split(" ")[1]
}

// Check if the request is from an admin
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = extractTokenFromHeader(request)

  if (!token) {
    return false
  }

  const payload = verifyToken(token)
  if (!payload) {
    return false
  }

  try {
    await connectToDatabase()
    const user = await User.findById(payload.id)
    return user?.role === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

// Middleware function to require authentication
export async function requireAuth(request: NextRequest): Promise<{ isAuthenticated: boolean; user?: any }> {
  const token = extractTokenFromHeader(request)

  if (!token) {
    return { isAuthenticated: false }
  }

  const payload = verifyToken(token)

  if (!payload) {
    return { isAuthenticated: false }
  }

  try {
    await connectToDatabase()
    const user = await User.findById(payload.id).select("-password")

    if (!user) {
      return { isAuthenticated: false }
    }

    return {
      isAuthenticated: true,
      user: user.toObject(),
    }
  } catch (error) {
    console.error("Error in requireAuth:", error)
    return { isAuthenticated: false }
  }
}

// Find a user by email and password (for login)
export async function findUserByCredentials(email: string, password: string) {
  try {
    await connectToDatabase()
    // In a real app, you would hash the password and compare the hash
    const user = await User.findOne({ email, password })
    return user
  } catch (error) {
    console.error("Error finding user by credentials:", error)
    return null
  }
}

