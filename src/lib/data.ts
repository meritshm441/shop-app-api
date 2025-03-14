// In-memory database

export interface Product {
  id: string
  name: string
  category: string
  price: number
  description?: string
  image: {
    thumbnail: string
    mobile: string
    tablet: string
    desktop: string
  }
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
}

// Enhanced sample product data
export const products: Product[] = [
  {
    id: "1",
    image: {
      thumbnail: "/placeholder.svg?height=100&width=100",
      mobile: "/placeholder.svg?height=300&width=400",
      tablet: "/placeholder.svg?height=400&width=600",
      desktop: "/placeholder.svg?height=600&width=800",
    },
    name: "Waffle with Berries",
    category: "Waffle",
    price: 6.5,
    description: "Crispy Belgian waffle topped with fresh seasonal berries and maple syrup.",
  },
  {
    id: "2",
    image: {
      thumbnail: "/placeholder.svg?height=100&width=100",
      mobile: "/placeholder.svg?height=300&width=400",
      tablet: "/placeholder.svg?height=400&width=600",
      desktop: "/placeholder.svg?height=600&width=800",
    },
    name: "Vanilla Bean Crème Brûlée",
    category: "Crème Brûlée",
    price: 7.0,
    description: "Classic French dessert with rich vanilla custard and caramelized sugar top.",
  },
  {
    id: "3",
    image: {
      thumbnail: "/placeholder.svg?height=100&width=100",
      mobile: "/placeholder.svg?height=300&width=400",
      tablet: "/placeholder.svg?height=400&width=600",
      desktop: "/placeholder.svg?height=600&width=800",
    },
    name: "Macaron Mix of Five",
    category: "Macaron",
    price: 8.0,
    description: "Assortment of five delicate French macarons in seasonal flavors.",
  },
  {
    id: "4",
    image: {
      thumbnail: "/placeholder.svg?height=100&width=100",
      mobile: "/placeholder.svg?height=300&width=400",
      tablet: "/placeholder.svg?height=400&width=600",
      desktop: "/placeholder.svg?height=600&width=800",
    },
    name: "Chocolate Lava Cake",
    category: "Cake",
    price: 8.5,
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream.",
  },
  {
    id: "5",
    image: {
      thumbnail: "/placeholder.svg?height=100&width=100",
      mobile: "/placeholder.svg?height=300&width=400",
      tablet: "/placeholder.svg?height=400&width=600",
      desktop: "/placeholder.svg?height=600&width=800",
    },
    name: "Tiramisu",
    category: "Italian",
    price: 7.5,
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
  },
  {
    id: "6",
    image: {
      thumbnail: "/placeholder.svg?height=100&width=100",
      mobile: "/placeholder.svg?height=300&width=400",
      tablet: "/placeholder.svg?height=400&width=600",
      desktop: "/placeholder.svg?height=600&width=800",
    },
    name: "New York Cheesecake",
    category: "Cheesecake",
    price: 6.75,
    description: "Rich and creamy classic New York style cheesecake with graham cracker crust.",
  },
  {
    id: "7",
    image: {
      thumbnail: "/placeholder.svg?height=100&width=100",
      mobile: "/placeholder.svg?height=300&width=400",
      tablet: "/placeholder.svg?height=400&width=600",
      desktop: "/placeholder.svg?height=600&width=800",
    },
    name: "Apple Pie",
    category: "Pie",
    price: 5.5,
    description: "Traditional apple pie with flaky crust and cinnamon-spiced filling.",
  },
  {
    id: "8",
    image: {
      thumbnail: "/placeholder.svg?height=100&width=100",
      mobile: "/placeholder.svg?height=300&width=400",
      tablet: "/placeholder.svg?height=400&width=600",
      desktop: "/placeholder.svg?height=600&width=800",
    },
    name: "Matcha Green Tea Ice Cream",
    category: "Ice Cream",
    price: 4.5,
    description: "Smooth and creamy ice cream with authentic Japanese matcha flavor.",
  },
]

// Initial cart data with some items
export const cart: CartItem[] = [
  {
    id: "101",
    productId: "1",
    quantity: 2,
  },
  {
    id: "102",
    productId: "3",
    quantity: 1,
  },
]

