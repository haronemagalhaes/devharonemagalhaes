import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // evita que um package-lock.json fora do projeto confunda o file tracing
  outputFileTracingRoot: process.cwd(),
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
