import { cart } from "@/lib/data"
import type { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/cart/route"
import { DELETE } from "@/app/api/cart/[id]/route"
import { describe, beforeEach, test, expect, jest } from "@jest/globals"

// Mock Next.js Response
jest.mock("next/server", () => {
  const originalModule = jest.requireActual("next/server")
  return {
    ...originalModule.default,
    NextResponse: {
      json: jest.fn((data, options) => ({ data, options })),
    },
  }
})

describe("Cart API", () => {
  beforeEach(() => {
    // Reset mocks and cart
    jest.clearAllMocks()
    cart.length = 0
  })

  test("GET /api/cart returns empty cart initially", async () => {
    const response = await GET()
    expect(response.items).toEqual([])
    expect(response.total).toBe(0)
  })

  test("POST /api/cart adds item to cart", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ productId: "1", quantity: 2 }),
    } as unknown as NextRequest

    await POST(mockRequest)

    expect(cart.length).toBe(1)
    expect(cart[0].productId).toBe("1")
    expect(cart[0].quantity).toBe(2)
  })

  test("DELETE /api/cart/:id removes item from cart", async () => {
    // Add an item to the cart first
    cart.push({ id: "test-id", productId: "1", quantity: 1 })

    const params = { id: "test-id" }
    await DELETE({} as NextRequest, { params })

    expect(cart.length).toBe(0)
  })
})

