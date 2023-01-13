import { redirect } from "next/navigation"
import { getPostsByUser } from "@lib/server/prisma"
import PostList from "@components/post-list"
import { getCurrentUser } from "@lib/server/session"
import { authOptions } from "@lib/server/auth"

export default async function Mine() {
	const userId = (await getCurrentUser())?.id

	if (!userId) {
		return redirect(authOptions.pages?.signIn || "/new")
	}

	const posts = await getPostsByUser(userId, true)

	const stringifiedPosts = JSON.stringify(posts)
	return (
		<PostList
			userId={userId}
			initialPosts={stringifiedPosts}
			isOwner={true}
			hideSearch={false}
		/>
	)
}

export const revalidate = 0