import Button from "@components/button"
import Input from "@components/input"
import Note from "@components/note"
import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import styles from "./modal.module.css"

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

	const onSubmit = () => {
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
				<Dialog.Root
					open={isOpen}
					onOpenChange={(open) => {
						if (!open) onClose()
					}}
				>
					<Dialog.Portal>
						<Dialog.Overlay className={styles.overlay} />
						<Dialog.Content
							className={styles.content}
							onEscapeKeyDown={onClose}
						>
							<Dialog.Title>
								{creating ? "Add a password" : "Enter password"}
							</Dialog.Title>
							<Dialog.Description>
								{creating
									? "Enter a password to protect your post"
									: "Enter the password to access the post"}
							</Dialog.Description>
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
							<footer className={styles.footer}>
								<Button onClick={onClose}>Cancel</Button>
								<Button onClick={onSubmit}>Submit</Button>
							</footer>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			}
		</>
	)
}

export default PasswordModal
