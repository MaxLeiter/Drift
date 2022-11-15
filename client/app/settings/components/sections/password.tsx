"use client"

import { Input, Button, useToasts } from "@geist-ui/core/dist"
import { useState } from "react"

const Password = () => {
	const [password, setPassword] = useState<string>("")
	const [newPassword, setNewPassword] = useState<string>("")
	const [confirmPassword, setConfirmPassword] = useState<string>("")

	const { setToast } = useToasts()

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
	}

	const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewPassword(e.target.value)
	}

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setConfirmPassword(e.target.value)
	}

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!password || !newPassword || !confirmPassword) {
			setToast({
				text: "Please fill out all fields",
				type: "error"
			})
		}

		if (newPassword !== confirmPassword) {
			setToast({
				text: "New password and confirm password do not match",
				type: "error"
			})
		}

		const res = await fetch("/server-api/auth/change-password", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				oldPassword: password,
				newPassword
			})
		})

		if (res.status === 200) {
			setToast({
				text: "Password updated successfully",
				type: "success"
			})
			setPassword("")
			setNewPassword("")
			setConfirmPassword("")
		} else {
			const data = await res.json()

			setToast({
				text: data.error ?? "Failed to update password",
				type: "error"
			})
		}
	}

	return (
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
				<label htmlFor="current-password">Current password</label>
				<Input
					onChange={handlePasswordChange}
					minLength={6}
					maxLength={128}
					value={password}
					id="current-password"
					htmlType="password"
					required
					autoComplete="current-password"
					placeholder="Current Password"
					width={"100%"}
				/>
			</div>
			<div>
				<label htmlFor="new-password">New password</label>
				<Input
					onChange={handleNewPasswordChange}
					minLength={6}
					maxLength={128}
					value={newPassword}
					id="new-password"
					htmlType="password"
					required
					autoComplete="new-password"
					placeholder="New Password"
					width={"100%"}
				/>
			</div>
			<div>
				<label htmlFor="confirm-password">Confirm password</label>
				<Input
					onChange={handleConfirmPasswordChange}
					minLength={6}
					maxLength={128}
					value={confirmPassword}
					id="confirm-password"
					htmlType="password"
					required
					autoComplete="confirm-password"
					placeholder="Confirm Password"
					width={"100%"}
				/>
			</div>
			<Button htmlType="submit" auto>
				Change Password
			</Button>
		</form>
	)
}

export default Password
