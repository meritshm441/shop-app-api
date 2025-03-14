import { isAdmin } from "@/src/lib/auth"
import { connectToDatabase } from "@/src/lib/mongodb"
import product from "@/src/models/product"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/products/:id - Get a specific product
export async function GET(request: NextRequest, context: any) {
  try {
    const id = context.params.id
    await connectToDatabase()
    const products = await product.findById(id)

    if (!products) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT /api/products/:id - Update a product (admin only)
export async function PUT(request: NextRequest, context: any) {
  // Check admin authentication
  const adminCheck = await isAdmin(request)
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const id = context.params.id
    await connectToDatabase()
    const body = await request.json()

    // Find product
    const products = await product.findById(id)

    if (!products) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Update product
    const updatedProduct = await product.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE /api/products/:id - Delete a product (admin only)
export async function DELETE(request: NextRequest, context: any) {
  // Check admin authentication
  const adminCheck = await isAdmin(request)
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const id = context.params.id
    await connectToDatabase()
    const products = await product.findById(id)

    if (!products) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete product
    await product.findByIdAndDelete(id)

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

