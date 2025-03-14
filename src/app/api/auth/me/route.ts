import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { isAuthenticated, user } = await requireAuth(request)

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user?._id,
      email: user?.email,
      role: user?.role,
      name: user?.name,
    },
  })
}

