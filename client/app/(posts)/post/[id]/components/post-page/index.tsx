"use client"

import DocumentComponent from "./view-document"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PasswordModalPage from "./password-modal-wrapper"
import { File, PostWithFilesAndAuthor } from "@lib/server/prisma"

type Props = {
	post: string | PostWithFilesAndAuthor
	isProtected?: boolean
	isAuthor?: boolean
}

const PostPage = ({ post: initialPost, isProtected, isAuthor }: Props) => {
	const [post, setPost] = useState<PostWithFilesAndAuthor>(
		typeof initialPost === "string" ? JSON.parse(initialPost) : initialPost
	)

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

	if (isProtected) {
		return <PasswordModalPage setPost={setPost} postId={post.id} />
	}

	return (
		<>
			{post.files?.map(({ id, content, title, html }: File) => (
				<DocumentComponent
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

export default PostPage
