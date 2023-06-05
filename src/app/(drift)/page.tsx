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
import { Stack } from "@components/stack"
import DocumentTabs from "src/app/(drift)/(posts)/components/document-tabs"
export const revalidate = 300

const getWelcomeData = cache(async () => {
	const welcomeContent = await getWelcomeContent()
	return welcomeContent
})

export default async function Page() {
	return (
		<Stack direction="column">
			{/* @ts-expect-error because of async RSC */}
			<WelcomePost />
			<h2 className="text-2xl font-bold mt-4">Recent Public Posts</h2>
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
		</Stack>
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
