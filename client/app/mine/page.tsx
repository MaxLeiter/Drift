import { redirect } from "next/navigation"
import { getPostsByUser } from "@lib/server/prisma"
import PostList from "@components/post-list"
import { getCurrentUser } from "@lib/server/session"
import { authOptions } from "@lib/server/auth"
import PageWrapper from "@components/page-wrapper"

export default async function Mine() {
	const userId = (await getCurrentUser())?.id

	if (!userId) {
		return redirect(authOptions.pages?.signIn || "/new")
	}

	const posts = await getPostsByUser(userId, true)

	const hasMore = false
	return (
		<PageWrapper signedIn>
			<PostList morePosts={hasMore} initialPosts={posts} />
		</PageWrapper>
	)
}
