import { redirect } from "next/navigation"
import { getPostsByUser, serverPostToClientPost } from "@lib/server/prisma"
import PostList from "@components/post-list"
import { getCurrentUser } from "@lib/server/session"
import { authOptions } from "@lib/server/auth"
import { Suspense } from "react"
import ErrorBoundary from "@components/error/fallback"

export default async function Mine() {
	const userId = (await getCurrentUser())?.id

	if (!userId) {
		return redirect(authOptions.pages?.signIn || "/new")
	}

	const posts = (await getPostsByUser(userId, true)).map(serverPostToClientPost)
	return (
		<ErrorBoundary>
			<Suspense fallback={<PostList skeleton={true} initialPosts={[]} />}>
				<PostList
					userId={userId}
					initialPosts={posts}
					isOwner={true}
					hideSearch={false}
				/>
			</Suspense>
		</ErrorBoundary>
	)
}

export const revalidate = 0
