import { getPostById } from "@lib/server/prisma"
import { getCurrentUser } from "@lib/server/session"
import { notFound, redirect } from "next/navigation"
import PostFiles from "./components/post-files"

const getPost = async (id: string) => {
	const [post, user] = await Promise.all([
		getPostById(id, {
			select: {
				visibility: true,
				authorId: true,
				title: true,
				description: true,
				id: true,
				createdAt: true,
				expiresAt: true,
				parentId: true,
				author: {
					select: {
						displayName: true,
						image: true
					}
				},
				files: {
					select: {
						id: true,
						content: true,
						updatedAt: true,
						title: true,
                        html: true,
					}
				}
			}
		}).then((post) => {
			if (!post) {
				return notFound()
			}
			return post
		}),
		getCurrentUser()
	])

	const isAuthorOrAdmin = user?.id === post?.authorId || user?.role === "admin"

	// if expired
	if (post.expiresAt && !isAuthorOrAdmin) {
		const expirationDate = new Date(post.expiresAt)
		if (expirationDate < new Date()) {
			return redirect("/expired")
		}
	}

	if (post.visibility === "public" || post.visibility === "unlisted") {
		return { post, isAuthorOrAdmin }
	}

	if (post.visibility === "private" && !isAuthorOrAdmin) {
		return redirect("/signin")
	}

	if (post.visibility === "protected" && !isAuthorOrAdmin) {
		return {
			// TODO: remove this. It's temporary to appease typescript
			post: {
				visibility: "protected",
				id: post.id,
				files: [],
				parentId: "",
				title: "",
				createdAt: "",
				expiresAt: "",
				author: {
					displayName: ""
				},
				description: "",
				authorId: ""
			},
			isAuthor: isAuthorOrAdmin
		}
	}

	return { post, isAuthor: isAuthorOrAdmin }
}

export default async function PostPage({
	params
}: {
	params: {
		id: string
	}
}) {
	const { post, isAuthor } = await getPost(params.id)
	const stringifiedPost = JSON.stringify(post)
	return <PostFiles post={stringifiedPost} isAuthor={isAuthor} />
}
