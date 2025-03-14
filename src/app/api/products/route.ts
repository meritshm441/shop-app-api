import { isAdmin } from "@/src/lib/auth"
import { connectToDatabase } from "@/src/lib/mongodb"
import product from "@/src/models/product"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/products - Get all products
export async function GET() {
  try {
    await connectToDatabase()
    const products = await product.find({})
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST /api/products - Add a new product (admin only)
export async function POST(request: NextRequest) {
  // Check admin authentication
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectToDatabase()
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || !body.category || !body.image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new product
    const newProduct = new product(body)
    await newProduct.save()

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

