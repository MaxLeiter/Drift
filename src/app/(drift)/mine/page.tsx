import { getPostsByUser, serverPostToClientPost } from "@lib/server/prisma"
import PostList from "@components/post-list"
import { getCurrentUser } from "@lib/server/session"
import { Suspense } from "react"
import ErrorBoundary from "@components/error/fallback"
import { getMetadata } from "src/app/lib/metadata"
import { redirect } from "next/navigation"
import { PageTitle } from "@components/page-title"
import { PageWrapper } from "@components/page-wrapper"

export default async function Mine() {
	const userId = (await getCurrentUser())?.id

	if (!userId) {
		// should be handled by middleware
		return redirect("/signup")
	}

	const posts = (await getPostsByUser(userId, true)).map(serverPostToClientPost)
	return (
		<>
			<PageTitle>Your Posts</PageTitle>
			<PageWrapper>
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
			</PageWrapper>
		</>
	)
}

export const revalidate = 0

export const metadata = getMetadata({
	title: "Your profile",
	hidden: true
})
