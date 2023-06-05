import { Button } from "@components/button"
import { Input } from "@components/input"
import Note from "@components/note"
import { useState } from "react"
import styles from "./modal.module.css"
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogFooter
} from "@components/alert-dialog"

type Props = {
	creating: boolean
	isOpen: boolean
	onClose: () => void
	onSubmit: (password: string) => void
}

const PasswordModal = ({
	isOpen,
	onClose,
	onSubmit: onSubmitAfterVerify,
	creating
}: Props) => {
	const [password, setPassword] = useState<string>("")
	const [confirmPassword, setConfirmPassword] = useState<string>("")
	const [error, setError] = useState<string>()

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		if (!password || (creating && !confirmPassword)) {
			setError("Please enter a password")
			return
		}

		if (password !== confirmPassword && creating) {
			setError("Passwords do not match")
			return
		}

		onSubmitAfterVerify(password)
	}

	return (
		<>
			{
				<AlertDialog
					open={isOpen}
					onOpenChange={(open) => {
						if (!open) onClose()
					}}
				>
					{/* <AlertDialogOverlay className={styles.overlay} /> */}
					<AlertDialogContent onEscapeKeyDown={onClose}>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{creating ? "Add a password" : "Enter password"}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{creating
									? "Enter a password to protect your post"
									: "Enter the password to access the post"}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<fieldset className={styles.fieldset}>
							{!error && creating && (
								<Note type="warning">
									This doesn&apos;t protect your post from the server
									administrator.
								</Note>
							)}
							{error && <Note type="error">{error}</Note>}
							<Input
								width={"100%"}
								label="Password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.currentTarget.value)}
							/>
							{creating && (
								<Input
									width={"100%"}
									label="Confirm"
									type="password"
									placeholder="Confirm Password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.currentTarget.value)}
								/>
							)}
						</fieldset>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={onSubmit}>Submit</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			}
		</>
	)
}

export default PasswordModal
