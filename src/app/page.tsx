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
	const { content, rendered, title } = await getWelcomeData()
	const getPostsPromise = getAllPosts({
		where: { visibility: "public" },
		include: {
			files: true
		}
	})

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
				{/* @ts-ignore because of async RSC */}
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
	const posts = await getPostsPromise
	return (
		<PostList
			userId={undefined}
			morePosts={false}
			initialPosts={JSON.stringify(posts)}
			hideSearch
		/>
	)
}

export const revalidate = 30
