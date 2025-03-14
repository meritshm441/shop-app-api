import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    // Enable if you're using server actions
    serverActions: true,
  },
  // Ensure TypeScript errors don't fail the build in production
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
export default nextConfig;
