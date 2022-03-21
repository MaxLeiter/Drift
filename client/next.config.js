const dotenv = require("dotenv");
dotenv.config();

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  async rewrites() {
    return [
      {
        source: "/server-api/:path*",
        destination: `${process.env.API_URL}/:path*`,
      },
      {
        source: "/file/raw/:id",
        destination: `/api/raw/:id`,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
