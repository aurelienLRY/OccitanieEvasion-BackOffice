/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  webpack: (config) => {
    config.resolve.extensions = [".ts", ".tsx", ".js", ".jsx", ".json"];
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./src"),
      "@/types": path.resolve(__dirname, "./src/types"),
    };
    return config;
  },
};

module.exports = nextConfig;
