import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    //dynamicIO: true,
  },
  images: {
    domains: ["image.tmdb.org"],
  },
};

export default nextConfig;
