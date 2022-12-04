'use client';

import { Post, PostWithFilesAndAuthor } from "@lib/server/prisma"
import PasswordModal from "@components/password-modal"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToasts } from "@components/toasts"

type Props = {
	setPost: (post: PostWithFilesAndAuthor) => void
	postId: Post["id"]
}

const PasswordModalPage = ({ setPost, postId }: Props) => {
	const router = useRouter()
	const { setToast } = useToasts()
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true)

	const onSubmit = async (password: string) => {
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
				setPost(data)
			}
		}
	}

	const onClose = () => {
		setIsPasswordModalOpen(false)
		router.push("/")
	}

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
