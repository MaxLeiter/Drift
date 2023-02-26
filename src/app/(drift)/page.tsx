import Image from "next/image"
import Card from "@components/card"
import { getWelcomeContent } from "src/pages/api/welcome"
import DocumentTabs from "./(posts)/components/tabs"
import {
	getAllPosts,
	serverPostToClientPost,
	ServerPostWithFilesAndAuthor
} from "@lib/server/prisma"
import PostList, { NoPostsFound } from "@components/post-list"
import { cache, Suspense } from "react"
import ErrorBoundary from "@components/error/fallback"
import { Stack } from "@components/stack"

const getWelcomeData = cache(async () => {
	const welcomeContent = await getWelcomeContent()
	return welcomeContent
})

export default async function Page() {
	const { title } = await getWelcomeData()

	return (
		<Stack direction="column">
			<Stack direction="row" alignItems="center">
				<Image
					src={"/assets/logo.svg"}
					width={48}
					height={48}
					alt=""
					priority
				/>
				<h1 style={{ marginLeft: "var(--gap)" }}>{title}</h1>
			</Stack>
			{/* @ts-expect-error because of async RSC */}
			<WelcomePost />
			<h2>Recent public posts</h2>
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
		<Card>
			<DocumentTabs
				defaultTab="preview"
				isEditing={false}
				staticPreview={rendered as string}
				title={title}
			>
				{content}
			</DocumentTabs>
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
