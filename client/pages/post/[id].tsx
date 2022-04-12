import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"

import type { Post } from "@lib/types"
import PostPage from "@components/post-page"

export type PostProps = {
	post: Post
}

const PostView = ({ post }: PostProps) => {
	return <PostPage post={post} />
}

export const getServerSideProps: GetServerSideProps = async ({
	params,
	res
}) => {
	const post = await fetch(process.env.API_URL + `/posts/${params?.id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-secret-key": process.env.SECRET_KEY || ""
		}
	})

	const sMaxAge = 60 * 60 * 24
	res.setHeader(
		"Cache-Control",
		`public, s-maxage=${sMaxAge}, max-age=${sMaxAge}`
	)

	if (!post.ok || post.status !== 200) {
		return {
			redirect: {
				destination: "/404",
				permanent: false
			},
			props: {}
		}
	}

	const json = await post.json()

	return {
		props: {
			post: json
		}
	}
}

export default PostView
