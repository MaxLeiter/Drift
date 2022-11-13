"use client"

import { useState } from "react"
import styles from "./auth.module.css"
import Link from "../../components/link"
import { Button, Input, Note } from "@geist-ui/core/dist"
import { signIn } from "next-auth/react"
import { Github as GithubIcon } from "@geist-ui/icons"

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

	return (
		<div className={styles.container}>
			<div className={styles.form}>
				<div className={styles.formContentSpace}>
					<h1>{signingIn ? "Sign In" : "Sign Up"}</h1>
				</div>
				{/* <form onSubmit={handleSubmit}> */}
				<form>
					<div className={styles.formGroup}>
						{/* <Input
							htmlType="text"
							id="username"
							value={username}
							onChange={(event) => setUsername(event.currentTarget.value)}
							placeholder="Username"
							required
							minLength={3}
							width="100%"
						/>
						<Input
							htmlType="password"
							id="password"
							value={password}
							onChange={(event) => setPassword(event.currentTarget.value)}
							placeholder="Password"
							required
							minLength={6}
							width="100%"
						/> */}
						{/* sign in with github */}
						{requiresServerPassword && (
							<Input
								htmlType="password"
								id="server-password"
								value={serverPassword}
								onChange={(event) =>
									setServerPassword(event.currentTarget.value)
								}
								placeholder="Server Password"
								required
								width="100%"
							/>
						)}
						<Button
							htmlType="submit"
							type="success-light"
							auto
							width="100%"
							icon={<GithubIcon />}
							onClick={(e) => {
								e.preventDefault()
								signIn("github", {
									callbackUrl: "/",
								})
							}}
						>
							Sign in with GitHub
						</Button>

						{/* <Button width={"100%"} htmlType="submit">
							{signingIn ? "Sign In" : "Sign Up"}
						</Button> */}
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
