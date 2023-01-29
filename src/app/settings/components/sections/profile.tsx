"use client"

import Button from "@components/button"
import Input from "@components/input"
import Note from "@components/note"
import { useToasts } from "@components/toasts"
import { useSessionSWR } from "@lib/use-session-swr"
import { useEffect, useState } from "react"
import styles from "./profile.module.css"
import useSWR from "swr"
import { User } from "@prisma/client"

function Profile() {
	const { session } = useSessionSWR()
	const { data: userData } = useSWR<User>(
		session?.user?.id ? `/api/user/${session?.user?.id}` : null
	)
	const [name, setName] = useState<string>(userData?.displayName || "")
	const [submitting, setSubmitting] = useState<boolean>(false)
	const { setToast } = useToasts()

	useEffect(() => {
		if (!name && userData?.displayName) {
			setName(userData?.displayName)
		}
	}, [name, userData?.displayName])

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
	}

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!name) {
			setToast({
				message: "Please fill out at least one field",
				type: "error"
			})
			return
		}
		setSubmitting(true)

		const data = {
			displayName: name
		}

		const res = await fetch(`/api/user/${session?.user?.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})

		setSubmitting(false)

		if (res.status === 200) {
			setToast({
				message: "Profile updated",
				type: "success"
			})
		} else {
			setToast({
				message: "Something went wrong updating your profile",
				type: "error"
			})
		}
	}

	/* if we have their email, they signed in with OAuth */
	// const imageViaOauth = Boolean(session?.user.email)
	// const TooltipComponent = ({ children }: { children: React.ReactNode }) =>
	// 	imageViaOauth ? (
	// 		<Tooltip content="Change your profile image on your OAuth provider">
	// 			{children}
	// 		</Tooltip>
	// 	) : (
	// 		<>{children}</>
	// 	)
	return (
		<>
			<Note type="warning">
				Your display name is publicly available on your profile.
			</Note>
			<form onSubmit={onSubmit} className={styles.form}>
				<div>
					<label htmlFor="displayName">Display name</label>
					<Input
						id="displayName"
						width={"100%"}
						placeholder="my name"
						value={name || ""}
						onChange={handleNameChange}
						aria-label="Display name"
						minLength={1}
						maxLength={32}
					/>
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<Input
						id="email"
						type="email"
						width={"100%"}
						placeholder="my@email.io"
						value={session?.user.email || ""}
						disabled
						aria-label="Email"
					/>
				</div>
				{/* <div>
                <label htmlFor="image">User Avatar</label>
                {user.image ? (
                    <Input
                        id="image"
                        type="file"
                        width={"100%"}
                        placeholder="my image"
                        disabled
                        aria-label="Image"
                        src={user.image}
                    />
                ) : (
                    <UserIcon />
                )}
                <TooltipComponent>
                    <div className={styles.upload}>
                        <input
                            type="file"
                            disabled={imageViaOauth}
                            className={styles.uploadInput}
                        />
                        <Button
                            type="button"
                            disabled={imageViaOauth}
                            width="100%"
                            className={styles.uploadButton}
                            aria-hidden="true"
                        >
                            Upload
                        </Button>
                    </div>
                </TooltipComponent>
            </div> */}

				<Button type="submit" loading={submitting}>
					Submit
				</Button>
			</form>
		</>
	)
}

export default Profile
