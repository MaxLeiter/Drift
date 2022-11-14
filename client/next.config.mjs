import bundleAnalyzer from "@next/bundle-analyzer"

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
				source: "/file/raw/:id",
				destination: `/api/file/raw/:id`
			},
			{
				source: "/home",
				destination: "/",
			}
		]
	}
}

export default bundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(
	nextConfig
)
