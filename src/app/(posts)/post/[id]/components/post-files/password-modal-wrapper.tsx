"use client"

import { Post, PostWithFilesAndAuthor } from "@lib/server/prisma"
import PasswordModal from "@components/password-modal"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useToasts } from "@components/toasts"
import { useSession } from "next-auth/react"

type Props = {
	setPost: (post: PostWithFilesAndAuthor) => void
	postId: Post["id"]
	authorId: Post["authorId"]
}

const PasswordModalPage = ({ setPost, postId, authorId }: Props) => {
	const router = useRouter()
	const { setToast } = useToasts()
	const { data: session, status } = useSession()
	const isAuthor =
		status === "loading"
			? undefined
			: session?.user && session?.user?.id === authorId
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
	const onSubmit = useCallback(async (password: string) => {
		const res = await fetch(`/api/post/${postId}?password=${password}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})

		if (!res.ok) {
			setToast({
				type: "error",
				message: "Wrong password"
			})
			return
		}

		const data = await res.json()
		if (data) {
			if (data.error) {
				setToast({
					message: data.error,
					type: "error"
				})
			} else {
				setIsPasswordModalOpen(false)
				setPost(data.post)
			}
		}
	}, [postId, setPost, setToast])

	const onClose = () => {
		setIsPasswordModalOpen(false)
		router.push("/")
	}

	useEffect(() => {
		if (isAuthor) {
			onSubmit("author")
			setToast({
				message:
					"You're the author of this post, so you automatically have access to it.",
				type: "default"
			})
		} else if (isAuthor === false) {
			setIsPasswordModalOpen(true)
		}
	}, [isAuthor, onSubmit, setToast])

	return (
		<PasswordModal
			creating={false}
			onClose={onClose}
			onSubmit={onSubmit}
			isOpen={isPasswordModalOpen}
		/>
	)
}

export default PasswordModalPage
