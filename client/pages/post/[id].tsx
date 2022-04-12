import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"

import type { Post } from "@lib/types"
import PostPage from "@components/post-page"

export type PostProps = {
	post: Post
	isProtected?: boolean
}

const PostView = ({ post, isProtected }: PostProps) => {
	return <PostPage isProtected={isProtected} post={post} />
}

export const getServerSideProps: GetServerSideProps = async ({
	params,
	req,
	res
}) => {
	const post = await fetch(process.env.API_URL + `/posts/${params?.id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-secret-key": process.env.SECRET_KEY || "",
			Authorization: `Bearer ${req.cookies["drift-token"]}`
		}
	})

	if (post.status === 401 || post.status === 403) {
		return {
			// can't access the post if it's private
			redirect: {
				destination: "/",
				permanent: false
			},
			props: {}
		}
	} else if (post.status === 404 || !post.ok) {
		return {
			redirect: {
				destination: "/404",
				permanent: false
			},
			props: {}
		}
	}

	const json = await post.json() as Post
	const isAuthor = json.users?.find(user => user.id === req.cookies["drift-userid"])

	if (json.visibility === "public" || json.visibility === "unlisted") {
		const sMaxAge = 60 * 60 * 12 // half a day
		res.setHeader(
			"Cache-Control",
			`public, s-maxage=${sMaxAge}, max-age=${sMaxAge}`
		)
	} else if (json.visibility === "protected" && !isAuthor) {
		return {
			props: {
				post: {
					id: json.id,
					visibility: json.visibility,
					expiresAt: json.expiresAt,
				},
				isProtected: true
			}
		}
	}

	return {
		props: {
			post: json
		}
	}
}

export default PostView
