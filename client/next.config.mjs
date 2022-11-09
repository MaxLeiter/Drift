import dotenv from "dotenv"
import bundleAnalyzer from "@next/bundle-analyzer"

dotenv.config()

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		// outputStandalone: true,
		// esmExternals: true,
		appDir: true
	},
	webpack: (config, { dev, isServer }) => {
		if (!dev && !isServer) {
			// TODO: enabling Preact causes the file switcher to hang the browser process
			// Object.assign(config.resolve.alias, {
			//   react: "preact/compat",
			//   "react-dom/test-utils": "preact/test-utils",
			//   "react-dom": "preact/compat"
			// })
		}
		return config
	},
	async rewrites() {
		return [
			{
				source: "/server-api/:path*",
				destination: `${process.env.API_URL}/:path*`
			},
			{
				source: "/file/raw/:id",
				destination: `/api/raw/:id`
			}
		]
	}
}

export default bundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(
	nextConfig
)
