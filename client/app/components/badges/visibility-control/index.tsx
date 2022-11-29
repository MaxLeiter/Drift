import PasswordModal from "@components/password-modal"
import { useCallback, useState } from "react"
import ButtonGroup from "@components/button-group"
import Button from "@components/button"
import { useToasts } from "@components/toasts"
import { Spinner } from "@components/spinner"

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
					message: "An error occurred",
					type: "error"
				})
				setPasswordModalVisible(false)
			}
		},
		[postId, setToast, setVisibility]
	)

	const onSubmit = useCallback(
		async (visibility: string, password?: string) => {
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
				<Spinner />
			) : (
				<ButtonGroup verticalIfMobile>
					<Button
						disabled={visibility === "private"}
						onClick={() => onSubmit("private")}
					>
						Make Private
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
							: "Protect with Password"}
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
