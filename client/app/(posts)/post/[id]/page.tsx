import PostPage from "app/(posts)/post/[id]/components/post-page"
import { notFound, redirect } from "next/navigation"
import { getAllPosts, getPostById, Post } from "@lib/server/prisma"
import { getCurrentUser } from "@lib/server/session"

export type PostProps = {
	post: Post
	isProtected?: boolean
}

export async function generateStaticParams() {
	const posts = await getAllPosts({
		 where: {
			visibility: {
				equals: "public"
			}
		 }
	})

	return posts.map((post) => ({
		id: post.id
	}))
}

const getPost = async (id: string) => {
	const post = await getPostById(id, {
		withFiles: true,
		withAuthor: true
	})

	if (!post) {
		return notFound()
	}

	if (post.visibility === "public") {
		return { post }
	}
	
	const user = await getCurrentUser()
	const isAuthorOrAdmin = user?.id === post?.authorId || user?.role === "admin"

	if (post.visibility === "public") {
		return { post, isAuthor: isAuthorOrAdmin }
	}

	if (post.visibility === "private" && !isAuthorOrAdmin) {
		return notFound()
	}

	if (post.visibility === "private" && !isAuthorOrAdmin) {
		return notFound()
	}

	if (post.visibility === "protected" && !isAuthorOrAdmin) {
		return {
			post: {
				visibility: "protected",
				id: post.id
			},
			isProtected: true,
			isAuthor: isAuthorOrAdmin
		}
	}

	// if expired
	if (post.expiresAt && !isAuthorOrAdmin) {
		const expirationDate = new Date(post.expiresAt)
		if (expirationDate < new Date()) {
			return redirect("/expired")
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

export default PostView