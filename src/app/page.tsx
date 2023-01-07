import Image from "next/image"
import Card from "@components/card"
import { getWelcomeContent } from "src/pages/api/welcome"
import DocumentTabs from "./(posts)/components/tabs"
import { getAllPosts, Post } from "@lib/server/prisma"
import PostList, { NoPostsFound } from "@components/post-list"
import { Suspense } from "react"

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
				<Suspense
					fallback={<PostList skeleton hideSearch initialPosts={JSON.stringify({})} />}
				>
					{/* @ts-expect-error because of async RSC */}
					<PublicPostList getPostsPromise={getPostsPromise} />
				</Suspense>
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

		if (posts.length === 0) {
			return <NoPostsFound />
		}

		return (
			<PostList initialPosts={JSON.stringify(posts)} hideActions hideSearch />
		)
	} catch (error) {
		return <NoPostsFound />
	}
}

export const revalidate = 60
