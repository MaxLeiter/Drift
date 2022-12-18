import PageSeo from "@components/page-seo"
import { getPostById } from "@lib/server/prisma"

export default async function Head({
	params
}: {
	params: {
		id: string
	}
}) {
	const post = await getPostById(params.id, {
		select: {
			title: true,
			description: true
		}
	})

	if (!post) {
		return null
	}

	return (
		<PageSeo
			title={post.title}
			description={post.description || undefined}
			isPrivate={false}
		/>
	)
}
