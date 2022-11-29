"use client"

import Button from "@components/button"
import Input from "@components/input"
import Note from "@components/note"
import { useToasts } from "@components/toasts"
import { User } from "next-auth"
import { useState } from "react"

const Profile = ({ user }: { user: User }) => {
	// TODO: make this displayName, requires fetching user from DB as session doesnt have it
	const [name, setName] = useState<string>(user.name || "")
	const [bio, setBio] = useState<string>()

	const { setToast } = useToasts()

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
	}

	const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setBio(e.target.value)
	}

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!name && !bio) {
			setToast({
				message: "Please fill out at least one field",
				type: "error"
			})
			return
		}

		const data = {
			displayName: name,
			bio
		}

		const res = await fetch(`/api/user/${user.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})

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

	return (
		<>
			<Note type="warning">
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
						aria-label="Display name"
					/>
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<Input
						id="email"
						type="email"
						width={"100%"}
						placeholder="my@email.io"
						value={user.email || undefined}
						disabled
						aria-label="Email"
					/>
				</div>
				{/* <div>
					<label htmlFor="bio">Biography (max 250 characters)</label>
					<textarea
						id="bio"
						style={{ width: "100%" }}
						maxLength={250}
						placeholder="I enjoy..."
						value={bio}
						onChange={handleBioChange}
					/>
				</div> */}
				<Button type="submit">
					Submit
				</Button>
			</form>
		</>
	)
}

export default Profile
