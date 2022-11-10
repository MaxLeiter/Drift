"use client"

import { Note, Input, Textarea, Button, useToasts } from "@geist-ui/core/dist"
import { TOKEN_COOKIE_NAME } from "@lib/constants"
import useUserData from "@lib/hooks/use-user-data"
import { getCookie } from "cookies-next"
import { useEffect, useState } from "react"

const Profile = () => {
	const user = useUserData()
	const [name, setName] = useState<string>()
	const [email, setEmail] = useState<string>()
	const [bio, setBio] = useState<string>()

	useEffect(() => {
		console.log(user)
		if (user?.displayName) setName(user.displayName)
		if (user?.email) setEmail(user.email)
		if (user?.bio) setBio(user.bio)
	}, [user])

	const { setToast } = useToasts()

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
	}

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
	}

	const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setBio(e.target.value)
	}

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!name && !email && !bio) {
			setToast({
				text: "Please fill out at least one field",
				type: "error"
			})
			return
		}

		const data = {
			displayName: name,
			email,
			bio
		}

		const res = await fetch("/server-api/user/profile", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${getCookie(TOKEN_COOKIE_NAME)}`
			},
			body: JSON.stringify(data)
		})

		if (res.status === 200) {
			setToast({
				text: "Profile updated",
				type: "success"
			})
		} else {
			setToast({
				text: "Something went wrong updating your profile",
				type: "error"
			})
		}
	}

	return (
		<>
			<Note type="warning" marginBottom={"var(--gap)"}>
				This information will be publicly available on your profile
			</Note>
			<form
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "var(--gap)",
					maxWidth: "300px"
				}}
				onSubmit={onSubmit}
			>
				<div>
					<label htmlFor="displayName">Display name</label>
					<Input
						id="displayName"
						width={"100%"}
						placeholder="my name"
						value={name || ""}
						onChange={handleNameChange}
					/>
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<Input
						id="email"
						htmlType="email"
						width={"100%"}
						placeholder="my@email.io"
						value={email || ""}
						onChange={handleEmailChange}
					/>
				</div>
				<div>
					<label htmlFor="bio">Biography (max 250 characters)</label>
					<Textarea
						id="bio"
						width="100%"
						maxLength={250}
						placeholder="I enjoy..."
						value={bio || ""}
						onChange={handleBioChange}
					/>
				</div>
				<Button htmlType="submit" auto>
					Submit
				</Button>
			</form>
		</>
	)
}

export default Profile
