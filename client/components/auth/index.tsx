"use client"

import { FormEvent, useState } from "react"
import styles from "./auth.module.css"
import { useRouter } from "next/navigation"
import Link from "../link"
import { Button, Input, Note } from "@geist-ui/core/dist"
import { signIn } from "next-auth/react"
import { Github as GithubIcon } from "@geist-ui/icons"
const NO_EMPTY_SPACE_REGEX = /^\S*$/
const ERROR_MESSAGE =
	"Provide a non empty username and a password with at least 6 characters"

const Auth = ({
	page,
	requiresServerPassword
}: {
	page: "signup" | "signin"
	requiresServerPassword?: boolean
}) => {
	const router = useRouter()

	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [serverPassword, setServerPassword] = useState("")
	const [errorMsg, setErrorMsg] = useState("")
	const signingIn = page === "signin"

	const handleJson = (json: any) => {
		// setCookie(USER_COOKIE_NAME, json.userId)

		router.push("/new")
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		// if (
		// 	!signingIn &&
		// 	(!NO_EMPTY_SPACE_REGEX.test(username) || password.length < 6)
		// )
		// 	return setErrorMsg(ERROR_MESSAGE)
		// if (
		// 	!signingIn &&
		// 	requiresServerPassword &&
		// 	!NO_EMPTY_SPACE_REGEX.test(serverPassword)
		// )
		// 	return setErrorMsg(ERROR_MESSAGE)
		// else setErrorMsg("")

		const reqOpts = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username, password, serverPassword })
		}

		try {
			// signIn("credentials", {
			// 	callbackUrl: "/new",
			// 	redirect: false,
			// 	username,
			// 	password,
			// 	serverPassword
			// })
			// const signUrl = signingIn ? "/api/auth/signin" : "/api/auth/signup"
			// const resp = await fetch(signUrl, reqOpts)
			// const json = await resp.json()
			// if (!resp.ok) throw new Error(json.error.message)
			// handleJson(json)
		} catch (err: any) {
			setErrorMsg(err.message ?? "Something went wrong")
		}
	}

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
							onClick={() => signIn("github")}
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
