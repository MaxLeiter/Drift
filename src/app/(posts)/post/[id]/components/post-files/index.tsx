"use client"

import DocumentComponent from "./view-document"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PasswordModalPage from "./password-modal-wrapper"
import { File, PostWithFilesAndAuthor } from "@lib/server/prisma"
import { useSession } from "next-auth/react"

type Props = {
	post: string | PostWithFilesAndAuthor
	isProtected?: boolean
	isAuthor?: boolean
}

const PostFiles = ({
	post: _initialPost,
	isAuthor: isAuthorFromServer
}: Props) => {
	console.log("PostFiles")
	const { data: session, status } = useSession()
	const isLoading = status === "loading"
	const initialPost =
		typeof _initialPost === "string"
			? (JSON.parse(_initialPost) as PostWithFilesAndAuthor)
			: _initialPost
	const [post, setPost] = useState<PostWithFilesAndAuthor>(initialPost)
	const isProtected = initialPost.visibility === "protected"
	console.log(_initialPost, post)

	// We generate public and unlisted posts at build time, so we can't use
	// the session to determine if the user is the author on the server. We need to check
	// the post's authorId against the session's user id.
	const isAuthor = isAuthorFromServer
		? true
		: session?.user?.id === post?.authorId
	const router = useRouter()

	useEffect(() => {
		if (post.expiresAt) {
			if (new Date(post.expiresAt) < new Date()) {
				if (!isAuthor) {
					router.push("/expired")
				}

				const expirationDate = new Date(post.expiresAt ? post.expiresAt : "")
				if (!isAuthor && expirationDate < new Date()) {
					router.push("/expired")
				}

				let interval: NodeJS.Timer | null = null
				if (post.expiresAt) {
					interval = setInterval(() => {
						const expirationDate = new Date(
							post.expiresAt ? post.expiresAt : ""
						)
						if (expirationDate < new Date()) {
							if (!isAuthor) {
								router.push("/expired")
							}
							clearInterval(interval!)
						}
					}, 4000)
				}
				return () => {
					if (interval) clearInterval(interval)
				}
			}
		}
	}, [isAuthor, post.expiresAt, router])
	
	if (isLoading) {
		return (
			<DocumentComponent
				skeleton={true}
				initialTab={"preview"}
			/>
		)
	}

	if (isProtected) {
		return <PasswordModalPage setPost={setPost} postId={post.id} />
	}

	return (
		<>
			{post.files?.map(({ id, content, title, html }: File) => (
				<DocumentComponent
					skeleton={false}
					key={id}
					title={title}
					initialTab={"preview"}
					id={id}
					content={content}
					preview={html}
				/>
			))}
		</>
	)
}

export default PostFiles
