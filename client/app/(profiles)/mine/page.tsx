import { USER_COOKIE_NAME } from "@lib/constants"
import { notFound, useRouter } from "next/navigation"
import { cookies } from "next/headers"
import { getPostsByUser } from "app/prisma"
import PostList from "@components/post-list"

export default async function Mine() {
	const userId = cookies().get(USER_COOKIE_NAME)?.value
	if (!userId) {
		return notFound()
	}

	const posts = await getPostsByUser(userId, true)
	const hasMore = false
	return <PostList morePosts={hasMore} initialPosts={posts} />
}
