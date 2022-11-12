import PageSeo from "app/components/page-seo"
import { getPostById } from "@lib/server/prisma"

export default async function Head({
	params
}: {
	params: {
		id: string
	}
}) {
	const post = await getPostById(params.id)

	if (!post) {
		return null
	}

	return (
		<PageSeo
			title={`${post.title} - Drift`}
			description={post.description || undefined}
			isPrivate={false}
		/>
	)
}
