import { products } from "@/lib/data"
import type { NextRequest } from "next/server"
import { GET } from "@/app/api/products/route"
import { GET as GET_PRODUCT } from "@/app/api/products/[id]/route"
import { describe, beforeEach, test, expect, jest } from "@jest/globals"
import { NextResponse } from "next/server"

// Mock Next.js Response
jest.mock("next/server", () => {
  const originalModule = jest.requireActual("next/server")
  return {
    ...(originalModule as any).default,
    NextResponse: {
      json: jest.fn((data: any, options: any) => ({ data, options })),
    },
  }
})

describe("Products API", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
  })

  test("GET /api/products returns all products", async () => {
    expect((Response as any).data).toEqual(products)
    expect(Response).toEqual({ data: products })
  })

  test("GET /api/products/:id returns a specific product", async () => {
    const params = { id: "1" }
    expect((Response as any).data).toEqual(products[0])
    expect(Response).toEqual({ data: products[0] })
  })

  test("GET /api/products/:id returns 404 for non-existent product", async () => {
    const params = { id: "non-existent" }
    expect((Response as any).options).toEqual({ status: 404 })
    expect((NextResponse.json as jest.Mock).mock.calls[0][1]).toEqual({ status: 404 })
  })
})


