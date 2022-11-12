import PasswordModal from "@components/new-post/password-modal"
import { useToasts } from "@geist-ui/core/dist"
import { Post } from "@lib/server/prisma"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
	setPost: (post: Post) => void
	postId: Post["id"]
}

const PasswordModalPage = ({ setPost, postId }: Props) => {
	const router = useRouter()
	const { setToast } = useToasts()
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true)

	const onSubmit = async (password: string) => {
		const res = await fetch(
			`/api/posts/authenticate?id=${postId}&password=${password}`,
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
				text: "Wrong password"
			})
			return
		}

		const data = await res.json()
		if (data) {
			if (data.error) {
				setToast({
					text: data.error,
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
