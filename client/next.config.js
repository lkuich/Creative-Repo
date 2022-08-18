/** @type {import('next').NextConfig} */
const withGraphql = require("next-plugin-graphql");
const nextConfig = {
  reactStrictMode: true,
  ...withGraphql(),
  images: {
    domains: ["localhost"],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
