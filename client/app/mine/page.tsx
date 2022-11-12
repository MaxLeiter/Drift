import { redirect } from "next/navigation"
import { getPostsByUser } from "@lib/server/prisma"
import PostList from "app/components/post-list"
import { getCurrentUser } from "@lib/server/session"
import Header from "app/components/header"
import { authOptions } from "@lib/server/auth"

export default async function Mine() {
	const userId = (await getCurrentUser())?.id

	if (!userId) {
		redirect(authOptions.pages?.signIn || "/new")
	}

	const posts = await getPostsByUser(userId, true)

	const hasMore = false
	return (
		<>
			<Header signedIn />
			<PostList morePosts={hasMore} initialPosts={posts} />
		</>
	)
}
