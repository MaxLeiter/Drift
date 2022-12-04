import PostList from "@components/post-list"
import { getPostsByUser, getUserById } from "@lib/server/prisma"
import { Suspense } from "react"

async function PostListWrapper({
	posts,
	userId
}: {
	posts: ReturnType<typeof getPostsByUser>
	userId: string
}) {
	const data = (await posts).filter((post) => post.visibility === "public")
	return (
		<PostList
			morePosts={false}
			userId={userId}
			initialPosts={JSON.stringify(data)}
		/>
	)
}

export default async function UserPage({
	params
}: {
	params: {
		username: string
	}
}) {
	// TODO: the route should be user.name, not id
	const id = params.username
	const user = await getUserById(id)

	const posts = getPostsByUser(id, true)

	return (
		<>
			<h1>{user?.displayName}&apos;s public posts</h1>
			<Suspense fallback={<PostList initialPosts={JSON.stringify({})} />}>
				{/* @ts-ignore because TS async JSX support is iffy */}
				<PostListWrapper posts={posts} userId={id} />
			</Suspense>
		</>
	)
}
