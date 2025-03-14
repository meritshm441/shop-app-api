import { connectToDatabase } from "@/src/lib/mongodb"
import CartItem from "@/src/models/CartItem"
import product from "@/src/models/product"
import User from "@/src/models/User"
import { NextResponse } from "next/server"

// Sample product data
const sampleProducts = [
  {
    name: "Waffle with Berries",
    category: "Waffle",
    price: 6.5,
    description: "Crispy Belgian waffle topped with fresh seasonal berries and maple syrup.",
    image: {
      thumbnail: "/placeholder.svg?height=100&width=100",
      mobile: "/placeholder.svg?height=300&width=400",
      tablet: "/placeholder.svg?height=400&width=600",
      desktop: "/placeholder.svg?height=600&width=800",
    },
  },
  // ... other products
]

// Sample user data
const sampleUsers = [
  {
    email: "admin@example.com",
    password: "admin123", // In a real app, use hashed passwords
    role: "admin",
    name: "Admin User",
  },
  {
    email: "user@example.com",
    password: "user123",
    role: "user",
    name: "Regular User",
  },
]

// GET /api/seed - Get current data state
export async function GET() {
  try {
    await connectToDatabase()
    const productCount = await product.countDocuments()
    const cartItemCount = await CartItem.countDocuments()
    const userCount = await User.countDocuments()

    return NextResponse.json({
      products: productCount,
      cart: cartItemCount,
      users: userCount,
      message: "Current data state",
    })
  } catch (error) {
    console.error("Error getting data state:", error)
    return NextResponse.json({ error: "Failed to get data state" }, { status: 500 })
  }
}

// POST /api/seed - Seed the database with initial data
export async function POST() {
  try {
    await connectToDatabase()

    // Clear existing data
    await product.deleteMany({})
    await CartItem.deleteMany({})
    await User.deleteMany({})

    // Insert sample products
    const products = await product.insertMany(sampleProducts)

    // Insert sample users
    const users = await User.insertMany(sampleUsers)

    // Add initial cart items
    const cartItems = await CartItem.insertMany([
      {
        productId: products[0]._id,
        quantity: 2,
      },
      {
        productId: products[2]._id,
        quantity: 1,
      },
    ])

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      products: products.length,
      cart: cartItems.length,
      users: users.length,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

