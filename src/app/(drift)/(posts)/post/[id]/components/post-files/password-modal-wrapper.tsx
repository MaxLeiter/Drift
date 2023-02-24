"use client"

import { PostWithFilesAndAuthor } from "@lib/server/prisma"
import PasswordModal from "@components/password-modal"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useToasts } from "@components/toasts"
import { useSessionSWR } from "@lib/use-session-swr"
import { fetchWithUser } from "src/app/lib/fetch-with-user"

type Props = {
	setPost: (post: PostWithFilesAndAuthor) => void
	postId: PostWithFilesAndAuthor["id"]
	authorId: PostWithFilesAndAuthor["authorId"]
}

const PasswordModalWrapper = ({ setPost, postId, authorId }: Props) => {
	const router = useRouter()
	const { setToast } = useToasts()
	const { session, isLoading } = useSessionSWR()
	const isAuthor = isLoading
		? undefined
		: session?.user
		? session?.user?.id === authorId
		: false
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
	const onSubmit = useCallback(
		async (password: string) => {
			const res = await fetchWithUser(
				`/api/post/${postId}?password=${password}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				}
			)

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
		},
		[postId, setPost, setToast]
	)

	const onClose = () => {
		setIsPasswordModalOpen(false)
		router.push("/")
	}

	useEffect(() => {
		if (isAuthor === true) {
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

export default PasswordModalWrapper
