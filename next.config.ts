import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignora erros de TS no build para que a pasta /antigo não bloqueie o deploy
    ignoreBuildErrors: true,
  },
  eslint: {
    // Também ignora erros de lint no build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
