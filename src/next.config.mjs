import bundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		// esmExternals: true,
		appDir: true,
		serverComponentsExternalPackages: ['prisma'],
	},
	output: "standalone",
	async rewrites() {
		return [
			{
				source: "/file/raw/:id",
				destination: `/api/raw/:id`
			},
			{
				source: "/home",
				destination: "/"
			}
		]
	}
	
}

export default bundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(
	nextConfig
)
