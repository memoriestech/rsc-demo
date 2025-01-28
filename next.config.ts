import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    //dynamicIO: true,
  },
  images: {
    domains: ["image.tmdb.org"],
  },
};

export default nextConfig;
