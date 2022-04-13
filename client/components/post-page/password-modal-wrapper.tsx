import PasswordModal from "@components/new-post/password-modal"
import { Page, useToasts } from "@geist-ui/core"
import { Post } from "@lib/types"
import { useRouter } from "next/router"
import { useState } from "react"

type Props = {
	setPost: (post: Post) => void
}

const PasswordModalPage = ({ setPost }: Props) => {
	const router = useRouter()
	const { setToast } = useToasts()
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true)

	const onSubmit = async (password: string) => {
		const res = await fetch(
			`/server-api/posts/authenticate?id=${router.query.id}&password=${password}`,
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
