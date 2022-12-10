import { redirect } from "next/navigation"
import { getPostsByUser, User } from "@lib/server/prisma"
import PostList from "@components/post-list"
import { getCurrentUser } from "@lib/server/session"
import { authOptions } from "@lib/server/auth"
import { cache } from "react"

const cachedGetPostsByUser = cache(
	async (userId: User["id"]) => await getPostsByUser(userId, true)
)

export default async function Mine() {
	const userId = (await getCurrentUser())?.id

	if (!userId) {
		return redirect(authOptions.pages?.signIn || "/new")
	}

	const posts = await cachedGetPostsByUser(userId)

	const hasMore = false
	const stringifiedPosts = JSON.stringify(posts)
	return (
		<PostList
			userId={userId}
			morePosts={hasMore}
			initialPosts={stringifiedPosts}
		/>
	)
}
