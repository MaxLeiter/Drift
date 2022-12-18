"use client"

import { useState } from "react"
import styles from "./auth.module.css"
import Link from "../../components/link"
import { signIn } from "next-auth/react"
import Input from "@components/input"
import Button from "@components/button"
import Note from "@components/note"
import { GitHub } from "react-feather"
const Auth = ({
	page,
	requiresServerPassword
}: {
	page: "signup" | "signin"
	requiresServerPassword?: boolean
}) => {
	const [serverPassword, setServerPassword] = useState("")
	const [errorMsg, setErrorMsg] = useState("")
	const signingIn = page === "signin"
	const signText = signingIn ? "In" : "Up"
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	return (
		<div className={styles.container}>
			<div className={styles.form}>
				<div className={styles.formContentSpace}>
					<h1>Sign {signText}</h1>
				</div>
				{/* <form onSubmit={handleSubmit}> */}
				<form>
					<div className={styles.formGroup}>
						<Input
							type="text"
							id="username"
							value={username}
							onChange={(event) => setUsername(event.currentTarget.value)}
							placeholder="Username"
							required
							minLength={3}
							width="100%"
							aria-label="Username"
						/>
						<Input
							type="password"
							id="password"
							value={password}
							onChange={(event) => setPassword(event.currentTarget.value)}
							placeholder="Password"
							required
							minLength={6}
							width="100%"
							aria-label="Password"
						/>
						{requiresServerPassword && (
							<Input
								type="password"
								id="server-password"
								value={serverPassword}
								onChange={(event) =>
									setServerPassword(event.currentTarget.value)
								}
								placeholder="Server Password"
								required
								width="100%"
								aria-label="Server Password"
							/>
						)}
						<Button
							width={"100%"}
							type="submit"
							onClick={(e) => {
								e.preventDefault()
								signIn("credentials", {
									username,
									password,
									callbackUrl: "/"
								})
							}}
						>
							Sign {signText}
						</Button>
						<hr style={{ width: "100%" }} />
						<Button
							type="submit"
							buttonType="primary"
							width="100%"
							style={{
								color: "var(--fg)"
							}}
							iconLeft={<GitHub />}
							onClick={(e) => {
								e.preventDefault()
								signIn("github", {
									callbackUrl: "/"
								})
							}}
						>
							Sign {signText.toLowerCase()} with GitHub
						</Button>
					</div>
					<div className={styles.formContentSpace}>
						{signingIn ? (
							<p>
								Don&apos;t have an account?{" "}
								<Link colored href="/signup">
									Sign up
								</Link>
							</p>
						) : (
							<p>
								Have an account?{" "}
								<Link colored href="/signin">
									Sign in
								</Link>
							</p>
						)}
					</div>
					{errorMsg && <Note type="error">{errorMsg}</Note>}
				</form>
			</div>
		</div>
	)
}

export default Auth
