import PostList from "@components/post-list"
import {
	getPostsByUser,
	getUserById,
	serverPostToClientPost
} from "@lib/server/prisma"
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
	const data = (await posts)
		.filter((post) => post.visibility === "public")
		.map(serverPostToClientPost)
	return <PostList userId={userId} initialPosts={data} hideSearch hideActions />
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
				alt=""
				width={48}
				height={48}
				style={{ borderRadius: "50%", height: 32, width: 32 }}
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
			<Suspense fallback={<PostList hideSearch skeleton initialPosts={[]} />}>
				{/* @ts-expect-error because TS async JSX support is iffy */}
				<PostListWrapper hideSearch posts={posts} userId={id} />
			</Suspense>
		</>
	)
}
