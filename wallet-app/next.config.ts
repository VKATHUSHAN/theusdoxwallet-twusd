import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence cross-origin dev warnings by explicitly allowing local network origins
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    // Adjust below if you use a different LAN IP during dev
    "http://192.168.0.152:3000",
  ],
};

export default nextConfig;
