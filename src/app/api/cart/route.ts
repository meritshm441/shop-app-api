import { connectToDatabase } from "@/src/lib/mongodb"
import CartItem from "@/src/models/CartItem"
import product from "@/src/models/product"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/cart - Get the current cart
export async function GET() {
  try {
    await connectToDatabase()
    const cartItems = await CartItem.find({})

    // Calculate total price
    let total = 0

    for (const item of cartItems) {
      const products = await product.findById(item.productId)
      if (products) {
        total += products.price * item.quantity
      }
    }

    return NextResponse.json({
      items: cartItems,
      total: Number.parseFloat(total.toFixed(2)),
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

// POST /api/cart - Add a product to cart
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    // Validate required fields
    if (!body.productId || !body.quantity) {
      return NextResponse.json({ error: "Missing productId or quantity" }, { status: 400 })
    }

    // Check if product exists
    const products = await product.findById(body.productId)
    if (!products) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if product is already in cart
    const existingItem = await CartItem.findOne({ productId: body.productId })

    if (existingItem) {
      // Update quantity if already in cart
      existingItem.quantity += body.quantity
      await existingItem.save()
      return NextResponse.json(existingItem)
    } else {
      // Add new item to cart
      const newCartItem = new CartItem({
        productId: body.productId,
        quantity: body.quantity,
      })

      await newCartItem.save()
      return NextResponse.json(newCartItem)
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

