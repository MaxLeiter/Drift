"use client"

import PasswordModal from "@components/password-modal"
import { useCallback, useState } from "react"
import ButtonGroup from "@components/button-group"
import { Button } from "@components/button"
import { useToasts } from "@components/toasts"
import { Spinner } from "@components/spinner"
import { useRouter } from "next/navigation"
import { useSessionSWR } from "@lib/use-session-swr"
import { fetchWithUser } from "src/app/lib/fetch-with-user"
import FadeIn from "@components/fade-in"
import { PostWithFiles } from "@lib/server/prisma"

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
				const json = (await res.json()) as PostWithFiles
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
					variant={"outline"}
					onClick={() => onSubmit("private")}
					loading={isSubmitting === "private"}
				>
					Make Private
				</Button>
				<Button
					disabled={visibility === "public"}
					variant={"outline"}
					onClick={() => onSubmit("public")}
					loading={isSubmitting === "public"}
				>
					Make Public
				</Button>
				<Button
					disabled={visibility === "unlisted"}
					variant={"outline"}
					onClick={() => onSubmit("unlisted")}
					loading={isSubmitting === "unlisted"}
				>
					Make Unlisted
				</Button>
				<Button
					onClick={() => onSubmit("protected")}
					variant={"outline"}
					loading={isSubmitting === "protected"}
				>
					{visibility === "protected"
						? "Change Password"
						: "Protect with Password"}
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
