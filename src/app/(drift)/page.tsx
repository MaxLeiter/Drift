import { Card, CardContent } from "@components/card"
import { getWelcomeContent } from "src/pages/api/welcome"
import {
	getAllPosts,
	serverPostToClientPost,
	ServerPostWithFilesAndAuthor
} from "@lib/server/prisma"
import PostList, { NoPostsFound } from "@components/post-list"
import { cache, Suspense } from "react"
import ErrorBoundary from "@components/error/fallback"
import DocumentTabs from "src/app/(drift)/(posts)/components/document-tabs"
import { PageWrapper } from "@components/page-wrapper"
export const revalidate = 300

const getWelcomeData = cache(async () => {
	const welcomeContent = await getWelcomeContent()
	return welcomeContent
})

export default async function Page() {
	return (
		<PageWrapper>
			{/* @ts-expect-error because of async RSC */}
			<WelcomePost />
			<h2 className="mt-4 text-2xl font-bold">Recent Public Posts</h2>
			<ErrorBoundary>
				<Suspense
					fallback={
						<PostList skeleton hideActions hideSearch initialPosts={[]} />
					}
				>
					{/* @ts-expect-error because of async RSC */}
					<PublicPostList />
				</Suspense>
			</ErrorBoundary>
		</PageWrapper>
	)
}

async function WelcomePost() {
	const { content, rendered, title } = await getWelcomeData()
	return (
		<Card className="w-full">
			<CardContent>
				<DocumentTabs
					defaultTab="preview"
					isEditing={false}
					staticPreview={rendered as string}
					title={title}
				>
					{content}
				</DocumentTabs>
			</CardContent>
		</Card>
	)
}

async function PublicPostList() {
	const posts = (await getAllPosts({
		select: {
			id: true,
			title: true,
			createdAt: true,
			author: {
				select: {
					displayName: true
				}
			},
			visibility: true,
			expiresAt: true,
			files: {
				select: {
					id: true,
					title: true
				}
			},
			authorId: true
		},
		where: {
			visibility: "public"
		},
		orderBy: {
			createdAt: "desc"
		}
	})) as unknown as ServerPostWithFilesAndAuthor[]

	if (posts.length === 0) {
		return <NoPostsFound />
	}

	const clientPosts = posts.map((post) => serverPostToClientPost(post))

	return <PostList initialPosts={clientPosts} hideActions hideSearch />
}
