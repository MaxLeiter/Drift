import Image from "next/image"
import Card from "@components/card"
import { getWelcomeContent } from "pages/api/welcome"
import DocumentTabs from "./(posts)/components/tabs"
import { getAllPosts, Post } from "@lib/server/prisma"
import PostList from "@components/post-list"

const getWelcomeData = async () => {
	const welcomeContent = await getWelcomeContent()
	return welcomeContent
}

export default async function Page() {
	const getPostsPromise = getAllPosts({
		select: {
			id: true,
			title: true,
			createdAt: true,
			author: {
				select: {
					name: true
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
	})
	const { content, rendered, title } = await getWelcomeData()

	return (
		<div
			style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}
		>
			<div
				style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
			>
				<Image
					src={"/assets/logo-optimized.svg"}
					width={48}
					height={48}
					alt=""
					priority
				/>
				<h1 style={{ marginLeft: "var(--gap)" }}>{title}</h1>
			</div>
			<Card>
				<DocumentTabs
					defaultTab="preview"
					isEditing={false}
					content={content}
					preview={rendered as string}
					title={title}
				/>
			</Card>
			<div>
				<h2>Recent public posts</h2>
				{/* @ts-expect-error because of async RSC */}
				<PublicPostList getPostsPromise={getPostsPromise} />
			</div>
		</div>
	)
}

async function PublicPostList({
	getPostsPromise
}: {
	getPostsPromise: Promise<Post[]>
}) {
	try {
		const posts = await getPostsPromise
		return (
			<PostList
				userId={undefined}
				morePosts={false}
				initialPosts={JSON.stringify(posts)}
				hideActions
				hideSearch
			/>
		)
	} catch (error) {
		return (
			<PostList
				userId={undefined}
				morePosts={false}
				initialPosts={[]}
				hideActions
				hideSearch
			/>
		)
	}
}

export const revalidate = 60
