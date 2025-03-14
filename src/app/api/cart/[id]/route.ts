import { connectToDatabase } from "@/src/lib/mongodb"
import CartItem from "@/src/models/CartItem"
import { type NextRequest, NextResponse } from "next/server"

// PUT /api/cart/:id - Update cart item quantity
export async function PUT(request: NextRequest, context: any) {
  try {
    const id = context.params.id
    await connectToDatabase()

    // Parse request body
    const body = await request.json()

    // Validate quantity
    if (typeof body.quantity !== "number" || body.quantity < 1) {
      return NextResponse.json({ error: "Quantity must be a positive number" }, { status: 400 })
    }

    // Find cart item
    const cartItem = await CartItem.findById(id)

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Update quantity
    cartItem.quantity = body.quantity
    await cartItem.save()

    // Return updated cart item
    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

// DELETE /api/cart/:id - Remove item from cart
export async function DELETE(request: NextRequest, context: any) {
  try {
    const id = context.params.id
    await connectToDatabase()

    // Find cart item
    const cartItem = await CartItem.findById(id)

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Delete cart item
    await CartItem.findByIdAndDelete(id)

    return NextResponse.json({ message: "Cart item removed successfully" })
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
  }
}

