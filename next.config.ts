import type { NextConfig } from "next";

const isNetlify = process.env.NETLIFY === "true";

const nextConfig: NextConfig = {
  output: isNetlify ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
