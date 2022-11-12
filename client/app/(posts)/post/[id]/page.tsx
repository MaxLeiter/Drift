import type { GetServerSideProps } from "next"

import type { Post } from "@lib/types"
import PostPage from "app/(posts)/post/[id]/components/post-page"
import { USER_COOKIE_NAME } from "@lib/constants"
import { notFound } from "next/navigation"
import { getPostById } from "@lib/server/prisma"
import { getCurrentUser, getSession } from "@lib/server/session"
import Header from "app/components/header"

export type PostProps = {
	post: Post
	isProtected?: boolean
}

const getPost = async (id: string) => {
	const post = await getPostById(id, true)
	const user = await getCurrentUser()

	if (!post) {
		return notFound()
	}

	const isAuthor = user?.id === post?.authorId

	if (post.visibility === "public") {
		return { post, isAuthor, signedIn: Boolean(user) }
	}

	// must be authed to see unlisted/private
	if (
		(post.visibility === "unlisted" || post.visibility === "private") &&
		!user
	) {
		return notFound()
	}

	if (post.visibility === "private" && !isAuthor) {
		return notFound()
	}

	if (post.visibility === "protected" && !isAuthor) {
		return {
			post,
			isProtected: true,
			isAuthor,
			signedIn: Boolean(user)
		}
	}

	return { post, isAuthor, signedIn: Boolean(user) }
}

const PostView = async ({
	params
}: {
	params: {
		id: string,
		signedIn?: boolean
	}
}) => {
	const { post, isProtected, isAuthor } = await getPost(params.id)
	return (
		<>
			<Header signedIn />
			<PostPage isAuthor={isAuthor} isProtected={isProtected} post={post} />
		</>
	)
}

// export const getServerSideProps: GetServerSideProps = async ({
// 	params,
// 	req,
// 	res
// }) => {
// 	const post = await fetch(process.env.API_URL + `/posts/${params?.id}`, {
// 		method: "GET",
// 		headers: {
// 			"Content-Type": "application/json",
// 			"x-secret-key": process.env.SECRET_KEY || "",
// 			Authorization: `Bearer ${req.cookies["drift-token"]}`
// 		}
// 	})

// 	if (post.status === 401 || post.status === 403) {
// 		return {
// 			// can't access the post if it's private
// 			redirect: {
// 				destination: "/",
// 				permanent: false
// 			},
// 			props: {}
// 		}
// 	} else if (post.status === 404 || !post.ok) {
// 		return {
// 			redirect: {
// 				destination: "/404",
// 				permanent: false
// 			},
// 			props: {}
// 		}
// 	}

// 	const json = (await post.json()) as Post
// 	const isAuthor = json.users?.find(
// 		(user) => user.id === req.cookies[USER_COOKIE_NAME]
// 	)

// 	if (json.visibility === "public" || json.visibility === "unlisted") {
// 		const sMaxAge = 60 * 60 * 12 // half a day
// 		res.setHeader(
// 			"Cache-Control",
// 			`public, s-maxage=${sMaxAge}, max-age=${sMaxAge}`
// 		)
// 	} else if (json.visibility === "protected" && !isAuthor) {
// 		return {
// 			props: {
// 				post: {
// 					id: json.id,
// 					visibility: json.visibility,
// 					expiresAt: json.expiresAt
// 				},
// 				isProtected: true
// 			}
// 		}
// 	}

// 	return {
// 		props: {
// 			post: json,
// 			key: params?.id
// 		}
// 	}
// }

export default PostView
