"use client"

import PasswordModal from "@components/password-modal"
import { useCallback, useState } from "react"
import ButtonGroup from "@components/button-group"
import Button from "@components/button"
import { useToasts } from "@components/toasts"
import { Spinner } from "@components/spinner"
import { useRouter } from "next/navigation"
import { useSessionSWR } from "@lib/use-session-swr"
import { fetchWithUser } from "src/app/lib/fetch-with-user"
import FadeIn from "@components/fade-in"

type Props = {
	authorId: string
	postId: string
	visibility: string
}

function VisibilityControl({
	authorId,
	postId,
	visibility: postVisibility
}: Props) {
	const { session } = useSessionSWR()
	const isAuthor = session?.user && session?.user?.id === authorId
	const [visibility, setVisibility] = useState<string>(postVisibility)

	const [isSubmitting, setSubmitting] = useState<string | null>()
	const [passwordModalVisible, setPasswordModalVisible] = useState(false)
	const { setToast } = useToasts()
	const router = useRouter()

	const sendRequest = useCallback(
		async (visibility: string, password?: string) => {
			const res = await fetchWithUser(`/api/post/${postId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ visibility, password })
			})

			if (res.ok) {
				const json = await res.json()
				setVisibility(json.visibility)
				router.refresh()
				setToast({
					message: "Visibility updated",
					type: "success"
				})
			} else {
				setToast({
					message: "An error occurred",
					type: "error"
				})
				setPasswordModalVisible(false)
			}
		},
		[postId, router, setToast]
	)

	const onSubmit = useCallback(
		async (visibility: string, password?: string) => {
			if (visibility === "protected" && !password) {
				setPasswordModalVisible(true)
				return
			}
			setPasswordModalVisible(false)
			const timeout = setTimeout(() => setSubmitting(visibility), 100)

			await sendRequest(visibility, password)
			clearTimeout(timeout)
			setSubmitting(null)
		},
		[sendRequest]
	)

	const onClosePasswordModal = () => {
		setPasswordModalVisible(false)
		setSubmitting(null)
	}

	const submitPassword = (password: string) => onSubmit("protected", password)

	if (!isAuthor) {
		return null
	}

	return (
		<FadeIn>
			<ButtonGroup
				style={{
					maxWidth: 600,
					margin: "var(--gap) auto"
				}}
			>
				<Button
					disabled={visibility === "private"}
					onClick={() => onSubmit("private")}
				>
					{isSubmitting === "private" ? <Spinner /> : "Make Private"}
				</Button>
				<Button
					disabled={visibility === "public"}
					onClick={() => onSubmit("public")}
				>
					{isSubmitting === "public" ? <Spinner /> : "Make Public"}
				</Button>
				<Button
					disabled={visibility === "unlisted"}
					onClick={() => onSubmit("unlisted")}
				>
					{isSubmitting === "unlisted" ? <Spinner /> : "Make Unlisted"}
				</Button>
				<Button onClick={() => onSubmit("protected")}>
					{isSubmitting === "protected" ? (
						<Spinner />
					) : visibility === "protected" ? (
						"Change Password"
					) : (
						"Protect with Password"
					)}
				</Button>
			</ButtonGroup>
			<PasswordModal
				creating={true}
				isOpen={passwordModalVisible}
				onClose={onClosePasswordModal}
				onSubmit={submitPassword}
			/>
		</FadeIn>
	)
}

export default VisibilityControl
