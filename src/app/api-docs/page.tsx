"use client"

import { useState, useEffect } from "react"
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

interface ApiResponse {
  status: number
  data: any
}

interface User {
  id: string
  email: string
  role: string
  name?: string
}

export default function ApiDocs() {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null)
  const [responses, setResponses] = useState<Record<string, ApiResponse>>({})
  const [jwtToken, setJwtToken] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loginData, setLoginData] = useState({
    email: "admin@example.com",
    password: "admin123",
  })
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
    role: "user",
  })
  const [dbStatus, setDbStatus] = useState<{ status: string; message: string }>({
    status: "unknown",
    message: "Checking database status...",
  })

  // Form states
  const [productId, setProductId] = useState("")
  const [productData, setProductData] = useState({
    name: "Sample Product",
    category: "Dessert",
    price: 9.99,
    description: "A delicious sample product",
    image: {
      thumbnail: "/placeholder.svg?height=100&width=100",
      mobile: "/placeholder.svg?height=300&width=400",
      tablet: "/placeholder.svg?height=400&width=600",
      desktop: "/placeholder.svg?height=600&width=800",
    },
  })
  const [cartItemId, setCartItemId] = useState("")
  const [cartItemData, setCartItemData] = useState({
    productId: "",
    quantity: 1,
  })
  const [userId, setUserId] = useState("")
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "user",
  })

  // Check database status on load
  useEffect(() => {
    fetch("/api/seed")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setDbStatus({
            status: "error",
            message: "Database error. Please check your MongoDB connection.",
          })
        } else {
          if (data.products > 0) {
            setDbStatus({
              status: "ready",
              message: `Database is ready with ${data.products} products, ${data.cart} cart items, and ${data.users || 0} users.`,
            })
          } else {
            setDbStatus({
              status: "empty",
              message: "Database is connected but empty. Please seed the database first.",
            })
          }
        }
      })
      .catch((error) => {
        setDbStatus({
          status: "error",
          message: "Failed to connect to the database. Please check your MongoDB connection.",
        })
      })
  }, [])

  // Check if token exists and get user info
  useEffect(() => {
    if (jwtToken) {
      checkCurrentUser()
    } else {
      setCurrentUser(null)
    }
  }, [jwtToken])

  const checkCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
      } else {
        setCurrentUser(null)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setCurrentUser(null)
    }
  }

  const handleLogin = async () => {
    try {
      console.log("Attempting login with:", loginData)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      // Log the response status
      console.log("Login response status:", response.status)

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Login failed response text:", errorText)

        try {
          // Try to parse as JSON if possible
          const errorJson = JSON.parse(errorText)
          alert(errorJson.error || "Login failed")
        } catch (e) {
          // If not JSON, show the raw error
          alert(`Login failed: ${response.status} ${response.statusText}`)
        }
        return
      }

      // Try to parse the response as JSON
      try {
        const data = await response.json()
        console.log("Login successful, token received")
        setJwtToken(data.token)
      } catch (e) {
        console.error("Error parsing JSON response:", e)
        alert("Login succeeded but response format was invalid")
      }
    } catch (error) {
      console.error("Error during login:", error)
      alert("Login failed. Please try again. Error: " + (error instanceof Error ? error.message : String(error)))
    }
  }

  const handleRegister = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      })

      if (!response.ok) {
        const errorText = await response.text()

        try {
          const errorJson = JSON.parse(errorText)
          alert(errorJson.error || "Registration failed")
        } catch (e) {
          alert(`Registration failed: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()
      alert(`User registered successfully! You can now login with ${data.email}`)

      // Clear the registration form
      setRegisterData({
        email: "",
        password: "",
        name: "",
        role: "user",
      })

      // Set the login data to the newly registered user
      setLoginData({
        email: data.email,
        password: registerData.password,
      })
    } catch (error) {
      console.error("Error during registration:", error)
      alert("Registration failed. Please try again.")
    }
  }

  // Add a function to handle alternative login
  const handleAlternativeLogin = async () => {
    try {
      const response = await fetch("/api/auth/key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Alternative login failed:", errorText)

        try {
          const errorJson = JSON.parse(errorText)
          alert(errorJson.error || "Alternative login failed")
        } catch (e) {
          alert(`Alternative login failed: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()
      setJwtToken(data.token)
    } catch (error) {
      console.error("Error during alternative login:", error)
      alert("Alternative login failed. Please try again.")
    }
  }

  const handleLogout = () => {
    setJwtToken("")
    setCurrentUser(null)
  }

  const toggleEndpoint = (endpoint: string) => {
    setActiveEndpoint(activeEndpoint === endpoint ? null : endpoint)
  }

  const executeRequest = async (endpoint: string, method: string, body?: any) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      // Add auth header for protected endpoints
      if (
        [
          "POST /api/products",
          "PUT /api/products/:id",
          "DELETE /api/products/:id",
          "GET /api/auth/me",
          "GET /api/users",
          "GET /api/users/:id",
          "PUT /api/users/:id",
          "DELETE /api/users/:id",
        ].includes(endpoint)
      ) {
        if (jwtToken) {
          headers["Authorization"] = `Bearer ${jwtToken}`
        } else {
          alert("JWT token is required for this endpoint")
          return
        }
      }

      const options: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      }

      // Replace placeholders in URL
      let url = endpoint.split(" ")[1]
      if (url.includes(":id")) {
        if (url.startsWith("/api/products")) {
          url = url.replace(":id", productId)
        } else if (url.startsWith("/api/cart")) {
          url = url.replace(":id", cartItemId)
        } else if (url.startsWith("/api/users")) {
          url = url.replace(":id", userId)
        }
      }

      const response = await fetch(url, options)

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()

        // If this was a seed request, update the DB status
        if (endpoint === "POST /api/seed") {
          setDbStatus({
            status: "ready",
            message: `Database seeded with ${data.products} products, ${data.cart} cart items, and ${data.users} users.`,
          })
        }

        // If this was a GET products request, update the first product ID for convenience
        if (endpoint === "GET /api/products" && data.length > 0) {
          setProductId(data[0]._id)
          setCartItemData((prev) => ({ ...prev, productId: data[0]._id }))
        }

        // If this was a GET cart request, update the first cart item ID for convenience
        if (endpoint === "GET /api/cart" && data.items && data.items.length > 0) {
          setCartItemId(data.items[0]._id)
        }

        // If this was a GET users request, update the first user ID for convenience
        if (endpoint === "GET /api/users" && data.length > 0) {
          setUserId(data[0]._id)
          setUserData({
            name: data[0].name || "",
            email: data[0].email,
            role: data[0].role,
          })
        }

        setResponses({
          ...responses,
          [endpoint]: {
            status: response.status,
            data,
          },
        })
      } else {
        // Handle non-JSON responses
        const text = await response.text()

        // Try to parse as JSON anyway in case the content-type is wrong
        try {
          const jsonData = JSON.parse(text)
          setResponses({
            ...responses,
            [endpoint]: {
              status: response.status,
              data: jsonData,
            },
          })
        } catch (e) {
          // If it's not valid JSON, show as text
          setResponses({
            ...responses,
            [endpoint]: {
              status: response.status,
              data: {
                message: "Response is not JSON",
                responseType: contentType || "unknown",
                textPreview: text.substring(0, 200) + (text.length > 200 ? "..." : ""),
              },
            },
          })
        }
      }
    } catch (error) {
      console.error("Error executing request:", error)
      setResponses({
        ...responses,
        [endpoint]: {
          status: 500,
          data: {
            error: "Failed to execute request",
            message: error instanceof Error ? error.message : String(error),
          },
        },
      })
    }
  }

  // Add authentication endpoints
  const endpoints = [
    { name: "POST /api/auth/login", method: "POST", description: "Login and get JWT token", requiresAuth: false },
    { name: "GET /api/auth/me", method: "GET", description: "Get current user info", requiresAuth: true },
    { name: "GET /api/users", method: "GET", description: "Get all users (admin only)", requiresAuth: true },
    { name: "POST /api/users", method: "POST", description: "Register a new user", requiresAuth: false },
    { name: "GET /api/users/:id", method: "GET", description: "Get a specific user", requiresAuth: true },
    { name: "PUT /api/users/:id", method: "PUT", description: "Update a user", requiresAuth: true },
    { name: "DELETE /api/users/:id", method: "DELETE", description: "Delete a user (admin only)", requiresAuth: true },
    { name: "GET /api/products", method: "GET", description: "Get all products", requiresAuth: false },
    { name: "GET /api/products/:id", method: "GET", description: "Get a specific product", requiresAuth: false },
    { name: "POST /api/products", method: "POST", description: "Add a new product", requiresAuth: true },
    { name: "PUT /api/products/:id", method: "PUT", description: "Update a product", requiresAuth: true },
    { name: "DELETE /api/products/:id", method: "DELETE", description: "Delete a product", requiresAuth: true },
    { name: "GET /api/cart", method: "GET", description: "Get the current cart", requiresAuth: false },
    { name: "POST /api/cart", method: "POST", description: "Add a product to the cart", requiresAuth: false },
    { name: "PUT /api/cart/:id", method: "PUT", description: "Update cart item quantity", requiresAuth: false },
    {
      name: "DELETE /api/cart/:id",
      method: "DELETE",
      description: "Remove an item from the cart",
      requiresAuth: false,
    },
    { name: "GET /api/seed", method: "GET", description: "Get current data state", requiresAuth: false },
    { name: "POST /api/seed", method: "POST", description: "Seed the database with initial data", requiresAuth: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
          <a href="/" className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition">
            Back to Home
          </a>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="p-6 bg-gray-800 text-white">
            <h2 className="text-xl font-semibold">Shopping List API</h2>
            <p className="mt-2 text-gray-300">Test the API endpoints directly from this interface</p>
          </div>

          {/* Database Status */}
          <div
            className={classNames(
              "p-4 border-b",
              dbStatus.status === "ready"
                ? "bg-green-50"
                : dbStatus.status === "empty"
                  ? "bg-yellow-50"
                  : dbStatus.status === "error"
                    ? "bg-red-50"
                    : "bg-gray-50",
            )}
          >
            <h3 className="text-lg font-medium mb-2">Database Status</h3>
            <p
              className={classNames(
                "text-sm",
                dbStatus.status === "ready"
                  ? "text-green-700"
                  : dbStatus.status === "empty"
                    ? "text-yellow-700"
                    : dbStatus.status === "error"
                      ? "text-red-700"
                      : "text-gray-700",
              )}
            >
              {dbStatus.message}
            </p>
            {dbStatus.status === "empty" && (
              <button
                onClick={() => executeRequest("POST /api/seed", "POST")}
                className="mt-2 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
              >
                Seed Database Now
              </button>
            )}
            {dbStatus.status === "error" && (
              <div className="mt-2 text-xs text-red-600">
                Make sure your MongoDB connection string is correctly set in the environment variables.
              </div>
            )}
          </div>

          {/* Registration Section */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium mb-4">Register New User</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={registerData.role}
                    onChange={(e) => setRegisterData({ ...registerData, role: e.target.value as "user" | "admin" })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleRegister}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Register
              </button>
            </div>
          </div>

          {/* Authentication Section */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium mb-4">Authentication</h3>

            {!currentUser ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                {/* Update the login button section to include the alternative login button */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleAlternativeLogin}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Alternative Login
                  </button>
                  <p className="text-xs text-gray-500">
                    Try admin@example.com / admin123 for admin access or user@example.com / user123 for regular user
                    access
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-green-700">
                    Logged in as <span className="font-medium">{currentUser.email}</span> ({currentUser.role})
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">Your JWT Token:</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={jwtToken}
                      readOnly
                      className="w-full p-2 pr-24 border rounded-md bg-gray-50 font-mono text-xs"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(jwtToken)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-200 rounded text-xs"
                    >
                      Copy Token
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    This token will be automatically used for authenticated endpoints
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="divide-y">
            {endpoints.map((endpoint) => (
              <div key={endpoint.name} className="p-0">
                <div
                  className={classNames(
                    "flex items-center p-4 cursor-pointer hover:bg-gray-50",
                    endpoint.method === "GET"
                      ? "bg-blue-50"
                      : endpoint.method === "POST"
                        ? "bg-green-50"
                        : endpoint.method === "PUT"
                          ? "bg-yellow-50"
                          : endpoint.method === "DELETE"
                            ? "bg-red-50"
                            : "",
                  )}
                  onClick={() => toggleEndpoint(endpoint.name)}
                >
                  <div
                    className={classNames(
                      "px-3 py-1 rounded-md text-white text-sm font-medium mr-4 w-20 text-center",
                      endpoint.method === "GET"
                        ? "bg-blue-500"
                        : endpoint.method === "POST"
                          ? "bg-green-500"
                          : endpoint.method === "PUT"
                            ? "bg-yellow-500"
                            : endpoint.method === "DELETE"
                              ? "bg-red-500"
                              : "",
                    )}
                  >
                    {endpoint.method}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-sm">{endpoint.name.split(" ")[1]}</div>
                    <div className="text-xs text-gray-500 mt-1">{endpoint.description}</div>
                  </div>
                  {endpoint.requiresAuth && (
                    <span className="px-2 py-1 text-xs bg-gray-200 rounded-md mr-2">Requires Auth</span>
                  )}
                  {activeEndpoint === endpoint.name ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {activeEndpoint === endpoint.name && (
                  <div className="p-4 bg-gray-50 border-t">
                    {/* Login endpoint */}
                    {endpoint.name === "POST /api/auth/login" && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Login Credentials</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-600 w-20">Email:</label>
                            <input
                              type="email"
                              value={loginData.email}
                              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                              className="flex-1 p-2 border rounded-md text-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-600 w-20">Password:</label>
                            <input
                              type="password"
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              className="flex-1 p-2 border rounded-md text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Register endpoint */}
                    {endpoint.name === "POST /api/users" && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Registration Data</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-600 w-20">Email:</label>
                            <input
                              type="email"
                              value={registerData.email}
                              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                              className="flex-1 p-2 border rounded-md text-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-600 w-20">Password:</label>
                            <input
                              type="password"
                              value={registerData.password}
                              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                              className="flex-1 p-2 border rounded-md text-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-600 w-20">Name:</label>
                            <input
                              type="text"
                              value={registerData.name}
                              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                              className="flex-1 p-2 border rounded-md text-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-600 w-20">Role:</label>
                            <select
                              value={registerData.role}
                              onChange={(e) =>
                                setRegisterData({ ...registerData, role: e.target.value as "user" | "admin" })
                              }
                              className="flex-1 p-2 border rounded-md text-sm"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* User update endpoint */}
                    {endpoint.name === "PUT /api/users/:id" && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">User Data</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-600 w-20">Name:</label>
                            <input
                              type="text"
                              value={userData.name}
                              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                              className="flex-1 p-2 border rounded-md text-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-600 w-20">Email:</label>
                            <input
                              type="email"
                              value={userData.email}
                              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                              className="flex-1 p-2 border rounded-md text-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-600 w-20">Role:</label>
                            <select
                              value={userData.role}
                              onChange={(e) => setUserData({ ...userData, role: e.target.value as "user" | "admin" })}
                              className="flex-1 p-2 border rounded-md text-sm"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Parameters for endpoints with :id */}
                    {endpoint.name.includes(":id") && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Path Parameters</h4>
                        <div className="flex items-center space-x-4">
                          <label className="text-sm text-gray-600 w-20">ID:</label>
                          <input
                            type="text"
                            value={
                              endpoint.name.startsWith("GET /api/products") ||
                              endpoint.name.startsWith("PUT /api/products") ||
                              endpoint.name.startsWith("DELETE /api/products")
                                ? productId
                                : endpoint.name.startsWith("GET /api/users") ||
                                    endpoint.name.startsWith("PUT /api/users") ||
                                    endpoint.name.startsWith("DELETE /api/users")
                                  ? userId
                                  : cartItemId
                            }
                            onChange={(e) => {
                              if (
                                endpoint.name.startsWith("GET /api/products") ||
                                endpoint.name.startsWith("PUT /api/products") ||
                                endpoint.name.startsWith("DELETE /api/products")
                              ) {
                                setProductId(e.target.value)
                              } else if (
                                endpoint.name.startsWith("GET /api/users") ||
                                endpoint.name.startsWith("PUT /api/users") ||
                                endpoint.name.startsWith("DELETE /api/users")
                              ) {
                                setUserId(e.target.value)
                              } else {
                                setCartItemId(e.target.value)
                              }
                            }}
                            className="flex-1 p-2 border rounded-md text-sm"
                            placeholder="Enter ID"
                          />
                        </div>
                      </div>
                    )}

                    {/* Request body for POST and PUT */}
                    {(endpoint.method === "POST" || endpoint.method === "PUT") &&
                      endpoint.name !== "POST /api/auth/login" &&
                      endpoint.name !== "POST /api/seed" &&
                      endpoint.name !== "POST /api/users" &&
                      endpoint.name !== "PUT /api/users/:id" && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Request Body</h4>
                          {endpoint.name === "POST /api/products" || endpoint.name === "PUT /api/products/:id" ? (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-4">
                                <label className="text-sm text-gray-600 w-20">Name:</label>
                                <input
                                  type="text"
                                  value={productData.name}
                                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                                  className="flex-1 p-2 border rounded-md text-sm"
                                  placeholder="Product name"
                                />
                              </div>
                              <div className="flex items-center space-x-4">
                                <label className="text-sm text-gray-600 w-20">Category:</label>
                                <input
                                  type="text"
                                  value={productData.category}
                                  onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                                  className="flex-1 p-2 border rounded-md text-sm"
                                  placeholder="Product category"
                                />
                              </div>
                              <div className="flex items-center space-x-4">
                                <label className="text-sm text-gray-600 w-20">Price:</label>
                                <input
                                  type="number"
                                  value={productData.price}
                                  onChange={(e) =>
                                    setProductData({ ...productData, price: Number.parseFloat(e.target.value) })
                                  }
                                  className="flex-1 p-2 border rounded-md text-sm"
                                  placeholder="Product price"
                                  step="0.01"
                                />
                              </div>
                              <div className="flex items-center space-x-4">
                                <label className="text-sm text-gray-600 w-20">Description:</label>
                                <input
                                  type="text"
                                  value={productData.description}
                                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                                  className="flex-1 p-2 border rounded-md text-sm"
                                  placeholder="Product description"
                                />
                              </div>
                            </div>
                          ) : endpoint.name === "POST /api/cart" || endpoint.name === "PUT /api/cart/:id" ? (
                            <div className="space-y-2">
                              {endpoint.name === "POST /api/cart" && (
                                <div className="flex items-center space-x-4">
                                  <label className="text-sm text-gray-600 w-20">Product ID:</label>
                                  <input
                                    type="text"
                                    value={cartItemData.productId}
                                    onChange={(e) => setCartItemData({ ...cartItemData, productId: e.target.value })}
                                    className="flex-1 p-2 border rounded-md text-sm"
                                    placeholder="Product ID"
                                  />
                                </div>
                              )}
                              <div className="flex items-center space-x-4">
                                <label className="text-sm text-gray-600 w-20">Quantity:</label>
                                <input
                                  type="number"
                                  value={cartItemData.quantity}
                                  onChange={(e) =>
                                    setCartItemData({ ...cartItemData, quantity: Number.parseInt(e.target.value) })
                                  }
                                  className="flex-1 p-2 border rounded-md text-sm"
                                  placeholder="Quantity"
                                  min="1"
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}

                    <button
                      onClick={() => {
                        let body
                        if (endpoint.name === "POST /api/auth/login") {
                          body = loginData
                        } else if (endpoint.name === "POST /api/users") {
                          body = registerData
                        } else if (endpoint.name === "PUT /api/users/:id") {
                          body = userData
                        } else if (
                          endpoint.name === "POST /api/products" ||
                          endpoint.name === "PUT /api/products/:id"
                        ) {
                          body = productData
                        } else if (endpoint.name === "POST /api/cart") {
                          body = cartItemData
                        } else if (endpoint.name === "PUT /api/cart/:id") {
                          body = { quantity: cartItemData.quantity }
                        }
                        executeRequest(endpoint.name, endpoint.method, body)
                      }}
                      className={classNames(
                        "px-4 py-2 rounded-md text-white text-sm font-medium",
                        endpoint.method === "GET"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : endpoint.method === "POST"
                            ? "bg-green-500 hover:bg-green-600"
                            : endpoint.method === "PUT"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : endpoint.method === "DELETE"
                                ? "bg-red-500 hover:bg-red-600"
                                : "",
                      )}
                    >
                      Execute
                    </button>

                    {responses[endpoint.name] && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Response</h4>
                        <div className="p-2 bg-gray-800 rounded-md text-white">
                          <div className="flex items-center mb-2">
                            <span className="text-xs font-medium mr-2">Status:</span>
                            <span
                              className={classNames(
                                "px-2 py-0.5 rounded-md text-xs",
                                responses[endpoint.name].status >= 200 && responses[endpoint.name].status < 300
                                  ? "bg-green-500"
                                  : "bg-red-500",
                              )}
                            >
                              {responses[endpoint.name].status}
                            </span>
                          </div>
                          <pre className="text-xs overflow-auto max-h-60">
                            {JSON.stringify(responses[endpoint.name].data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-semibold mb-4">Testing Guide</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Step 1: Seed the Database</h3>
              <p className="text-sm text-gray-600 mb-2">
                First, use the <code className="bg-gray-100 px-1 py-0.5 rounded">POST /api/seed</code> endpoint to
                populate the database with sample data, including users.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Step 2: Register or Login</h3>
              <p className="text-sm text-gray-600 mb-2">
                Register a new user with <code className="bg-gray-100 px-1 py-0.5 rounded">POST /api/users</code> or
                login with <code className="bg-gray-100 px-1 py-0.5 rounded">POST /api/auth/login</code>. For admin
                access, use <code className="bg-gray-100 px-1 py-0.5 rounded">admin@example.com / admin123</code>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Step 3: Get All Products</h3>
              <p className="text-sm text-gray-600 mb-2">
                Use <code className="bg-gray-100 px-1 py-0.5 rounded">GET /api/products</code> to see all available
                products. This will automatically populate the Product ID field for other endpoints.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Step 4: Test Protected Endpoints</h3>
              <p className="text-sm text-gray-600 mb-2">
                Try adding or modifying products using the admin-only endpoints. These require a valid JWT token with
                admin role.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

