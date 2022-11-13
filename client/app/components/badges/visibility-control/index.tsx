import { Button, ButtonGroup, Loading, useToasts } from "@geist-ui/core/dist"
import { TOKEN_COOKIE_NAME } from "@lib/constants"
import type { PostVisibility } from "@lib/types"
import PasswordModal from "@components/password-modal"
import { getCookie } from "cookies-next"
import { useCallback, useState } from "react"

type Props = {
	postId: string
	visibility: string
	setVisibility: (visibility: string) => void
}

const VisibilityControl = ({ postId, visibility, setVisibility }: Props) => {
	const [isSubmitting, setSubmitting] = useState(false)
	const [passwordModalVisible, setPasswordModalVisible] = useState(false)
	const { setToast } = useToasts()

	const sendRequest = useCallback(
		async (visibility: string, password?: string) => {
			const res = await fetch(`/api/post/${postId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ visibility, password })
			})

			if (res.ok) {
				const json = await res.json()
				setVisibility(json.visibility)
			} else {
				setToast({
					text: "An error occurred",
					type: "error"
				})
				setPasswordModalVisible(false)
			}
		},
		[postId, setToast, setVisibility]
	)

	const onSubmit = useCallback(
		async (visibility: PostVisibility, password?: string) => {
			if (visibility === "protected" && !password) {
				setPasswordModalVisible(true)
				return
			}
			setPasswordModalVisible(false)
			const timeout = setTimeout(() => setSubmitting(true), 100)

			await sendRequest(visibility, password)
			clearTimeout(timeout)
			setSubmitting(false)
		},
		[sendRequest]
	)

	const onClosePasswordModal = () => {
		setPasswordModalVisible(false)
		setSubmitting(false)
	}

	const submitPassword = (password: string) => onSubmit("protected", password)

	return (
		<>
			{isSubmitting ? (
				<Loading />
			) : (
				<ButtonGroup margin={0}>
					<Button
						disabled={visibility === "private"}
						onClick={() => onSubmit("private")}
					>
						Make private
					</Button>
					<Button
						disabled={visibility === "public"}
						onClick={() => onSubmit("public")}
					>
						Make Public
					</Button>
					<Button
						disabled={visibility === "unlisted"}
						onClick={() => onSubmit("unlisted")}
					>
						Unlist
					</Button>
					<Button onClick={() => onSubmit("protected")}>
						{visibility === "protected"
							? "Change Password"
							: "Protect with password"}
					</Button>
				</ButtonGroup>
			)}
			<PasswordModal
				creating={true}
				isOpen={passwordModalVisible}
				onClose={onClosePasswordModal}
				onSubmit={submitPassword}
			/>
		</>
	)
}

export default VisibilityControl
