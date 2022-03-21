const dotenv = require("dotenv");
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
    optimizeCss: true,
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

module.exports = nextConfig;
