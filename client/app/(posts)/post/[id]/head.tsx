import PageSeo from "@components/page-seo"
import { getPostById } from "@lib/server/prisma"

export default async function Head({
	params
}: {
	params: {
		slug: string
	}
}) {
	const post = await getPostById(params.slug)

	if (!post) {
		return null
	}

	return (
		<PageSeo
			title={`${post.title} - Drift`}
			description={post.description}
			isPrivate={false}
		/>
	)
}
