import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping List API</h1>

      <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Interactive API Testing</h2>
        <p className="mb-4">Try out the API endpoints directly in your browser with our Swagger-like interface.</p>
        <Link
          href="/api-docs"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Open API Testing Interface
        </Link>
      </div>

      <div className="mb-8 bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold mb-4 text-green-800">MongoDB Integration</h2>
        <p className="mb-4">
          This API uses MongoDB for persistent data storage. Before using the API, you need to seed the database:
        </p>
        <div className="bg-white p-4 rounded-md mb-4 font-mono text-sm">POST /api/seed</div>
        <p className="text-sm text-green-700">
          This will populate the database with sample products, cart items, and users. You only need to do this once.
        </p>
      </div>

      <div className="mb-8 bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h2 className="text-xl font-semibold mb-4 text-purple-800">JWT Authentication</h2>
        <p className="mb-4">
          This API uses JWT (JSON Web Tokens) for authentication. To get a token, use the login endpoint:
        </p>
        <div className="bg-white p-4 rounded-md mb-4 font-mono text-sm">
          POST /api/auth/login
          <pre className="mt-2 text-xs">
            {`{
  "email": "admin@example.com",
  "password": "admin123"
}`}
          </pre>
        </div>
        <p className="text-sm text-purple-700">
          Use the token in the Authorization header for protected endpoints:{" "}
          <code>Authorization: Bearer your_token</code>
        </p>
      </div>

      <div className="mb-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-semibold mb-4 text-yellow-800">User Management</h2>
        <p className="mb-4">You can register new users and manage existing ones with the user endpoints:</p>
        <div className="bg-white p-4 rounded-md mb-4 font-mono text-sm">
          POST /api/users
          <pre className="mt-2 text-xs">
            {`{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "role": "user"
}`}
          </pre>
        </div>
        <p className="text-sm text-yellow-700">
          Admin users can manage all users, while regular users can only manage their own accounts.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">API Documentation</h2>
        <p className="mb-4">This API provides endpoints for managing products, a shopping cart, and users.</p>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-3">Authentication Endpoints</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <code>POST /api/auth/login</code> - Login and get JWT token
            </li>
            <li>
              <code>GET /api/auth/me</code> - Get current user information
            </li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3">User Endpoints</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <code>GET /api/users</code> - Get all users (admin only)
            </li>
            <li>
              <code>POST /api/users</code> - Register a new user
            </li>
            <li>
              <code>GET /api/users/:id</code> - Get a specific user
            </li>
            <li>
              <code>PUT /api/users/:id</code> - Update a user
            </li>
            <li>
              <code>DELETE /api/users/:id</code> - Delete a user (admin only)
            </li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3">Products Endpoints</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <code>GET /api/products</code> - Retrieve all products
            </li>
            <li>
              <code>GET /api/products/:id</code> - Retrieve a specific product
            </li>
            <li>
              <code>POST /api/products</code> - Add a new product (admin only)
            </li>
            <li>
              <code>PUT /api/products/:id</code> - Update a product (admin only)
            </li>
            <li>
              <code>DELETE /api/products/:id</code> - Delete a product (admin only)
            </li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3">Cart Endpoints</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <code>GET /api/cart</code> - Retrieve the current cart
            </li>
            <li>
              <code>POST /api/cart</code> - Add a product to the cart
            </li>
            <li>
              <code>PUT /api/cart/:id</code> - Update the quantity of a cart item
            </li>
            <li>
              <code>DELETE /api/cart/:id</code> - Remove an item from the cart
            </li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3">Utility Endpoints</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <code>GET /api/seed</code> - Get current data state
            </li>
            <li>
              <code>POST /api/seed</code> - Seed the database with initial data
            </li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3">Authentication</h3>
          <p>Admin endpoints require JWT authentication. Include the token in the Authorization header:</p>
          <pre className="bg-gray-200 p-3 rounded mt-2">Authorization: Bearer your_jwt_token</pre>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Example Usage</h2>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-3">Register a New User</h3>
          <pre className="bg-gray-200 p-3 rounded">
            {`fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'newuser@example.com',
    password: 'password123',
    name: 'New User',
    role: 'user'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`}
          </pre>

          <h3 className="text-xl font-medium mt-6 mb-3">Login and Get Token</h3>
          <pre className="bg-gray-200 p-3 rounded">
            {`fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  })
})
  .then(response => response.json())
  .then(data => {
    // Store the token for later use
    const token = data.token;
    console.log('JWT Token:', token);
  });`}
          </pre>

          <h3 className="text-xl font-medium mt-6 mb-3">Add Product (with Authentication)</h3>
          <pre className="bg-gray-200 p-3 rounded">
            {`fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_jwt_token'
  },
  body: JSON.stringify({
    name: 'New Product',
    category: 'Dessert',
    price: 12.99,
    description: 'A delicious new product',
    image: {
      thumbnail: '/placeholder.svg?height=100&width=100',
      mobile: '/placeholder.svg?height=300&width=400',
      tablet: '/placeholder.svg?height=400&width=600',
      desktop: '/placeholder.svg?height=600&width=800'
    }
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`}
          </pre>
        </div>
      </div>
    </main>
  )
}

