import bundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		// esmExternals: true,
		appDir: true,
		serverComponentsExternalPackages: ["prisma", "@prisma/client"]
	},
	output: "standalone",
	rewrites() {
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
	},
	images: {
		domains: ["avatars.githubusercontent.com"]
	},
	env: {
		NEXT_PUBLIC_DRIFT_URL: process.env.DRIFT_URL
	},
	typescript: {
		// ignoreBuildErrors: true,
	}
}

export default bundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(
	nextConfig
)
