import PostPage from "app/(posts)/post/[id]/components/post-page"
import { notFound } from "next/navigation"
import { getPostById, Post } from "@lib/server/prisma"
import { getCurrentUser } from "@lib/server/session"

export type PostProps = {
	post: Post
	isProtected?: boolean
}

// export async function generateStaticParams() {
// 	const posts = await getAllPosts({
// 		where: {
// 			visibility: "public"
// 		}
// 	})

// 	return posts.map((post) => ({
// 		id: post.id
// 	}))
// }

const getPost = async (id: string) => {
	const post = await getPostById(id, {
		withFiles: true,
		withAuthor: true
	})
	const user = await getCurrentUser()

	if (!post) {
		return notFound()
	}

	const isAuthorOrAdmin = user?.id === post?.authorId || user?.role === "admin"

	if (post.visibility === "public") {
		return { post, isAuthor: isAuthorOrAdmin }
	}

	// must be authed to see unlisted/private
	if (
		(post.visibility === "unlisted" || post.visibility === "private") &&
		!user
	) {
		return notFound()
	}

	if (post.visibility === "private" && !isAuthorOrAdmin) {
		return notFound()
	}

	if (post.visibility === "protected" && !isAuthorOrAdmin) {
		return {
			// post,
			isProtected: true,
			isAuthor: isAuthorOrAdmin
		}
	}

	// if expired
	if (post.expiresAt && !isAuthorOrAdmin) {
		const expirationDate = new Date(post.expiresAt)
		if (expirationDate < new Date()) {
			return notFound()
		}
	}

	return { post, isAuthor: isAuthorOrAdmin }
}

const PostView = async ({
	params
}: {
	params: {
		id: string
	}
}) => {
	const { post, isProtected, isAuthor } = await getPost(params.id)
	// TODO: serialize dates in prisma middleware instead of passing as JSON
	const stringifiedPost = JSON.stringify(post)
	return (
		<PostPage
			isAuthor={isAuthor}
			isProtected={isProtected}
			post={stringifiedPost}
		/>
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
