import PostList from "@components/post-list"
import { getPostsByUser, getUserById } from "@lib/server/prisma"
import Image from "next/image"
import { Suspense } from "react"
import { User } from "react-feather"

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
	const user = await getUserById(id, {
		image: true
	})

	const posts = getPostsByUser(id, true)

	const Avatar = () => {
		if (!user?.image) {
			return <User />
		}
		return (
			<Image
				src={user.image}
				alt="User avatar"
				className="w-12 h-12 rounded-full"
				width={48}
				height={48}
			/>
		)
	}
	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between"
				}}
			>
				<h1>Public posts by {user?.displayName || "Anonymous"}</h1>
				<Avatar />
			</div>
			<Suspense fallback={<PostList initialPosts={JSON.stringify({})} />}>
				{/* @ts-expect-error because TS async JSX support is iffy */}
				<PostListWrapper posts={posts} userId={id} />
			</Suspense>
		</>
	)
}
