"use client"

import { startTransition, useEffect, useRef, useState } from "react"
import styles from "./auth.module.css"
import Link from "../../components/link"
import { getSession, signIn } from "next-auth/react"
import Input from "@components/input"
import Button from "@components/button"
import { GitHub } from "react-feather"
import { useToasts } from "@components/toasts"
import { useRouter, useSearchParams } from "next/navigation"
import Note from "@components/note"
const Auth = ({
	page,
	requiresServerPassword,
	isGithubEnabled
}: {
	page: "signup" | "signin"
	requiresServerPassword?: boolean
	isGithubEnabled?: boolean
}) => {
	const [serverPassword, setServerPassword] = useState("")
	const { setToast } = useToasts()
	const signingIn = page === "signin"
	const router = useRouter()
	const signText = signingIn ? "In" : "Up"
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const queryParams = useSearchParams()

	useEffect(() => {
		if (queryParams.get("error")) {
			setToast({
				message: queryParams.get("error") as string,
				type: "error"
			})
		}
	}, [queryParams, setToast])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const res = await signIn("credentials", {
			username,
			password,
			registration_password: serverPassword,
			redirect: false,
			// callbackUrl: "/signin",
			signingIn: signingIn
		})
		if (res?.error) {
			setToast({
				type: "error",
				message: res.error
			})
		} else {
			console.log("res", res)
			startTransition(() => {
					router.push("/new")
					router.refresh()	
			})
		}
	}

	const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value)
	}

	const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
	}

	const handleChangeServerPassword = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setServerPassword(event.target.value)
	}

	return (
		<div className={styles.container}>
			<div className={styles.form}>
				<div className={styles.formContentSpace}>
					<h1>Sign {signText}</h1>
				</div>
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						{requiresServerPassword ? (
							<>
								{" "}
								<Note type="info">
									The server administrator has set a password for this server.
								</Note>
								<Input
									type="password"
									id="server-password"
									value={serverPassword}
									onChange={(event) =>
										setServerPassword(event.currentTarget.value)
									}
									placeholder="Server Password"
									required={true}
									width="100%"
									aria-label="Server Password"
								/>
								<hr style={{ width: "100%" }} />
							</>
						) : null}

						<Input
							type="text"
							id="username"
							value={username}
							onChange={handleChangeUsername}
							placeholder="Username"
							required={true}
							minLength={3}
							width="100%"
							aria-label="Username"
						/>
						<Input
							type="password"
							id="password"
							value={password}
							onChange={handleChangePassword}
							placeholder="Password"
							required={true}
							minLength={6}
							width="100%"
							aria-label="Password"
						/>
						<Button width={"100%"} type="submit">
							Sign {signText}
						</Button>
						{isGithubEnabled ? <hr style={{ width: "100%" }} /> : null}
						{isGithubEnabled ? (
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
										callbackUrl: "/",
										registration_password: serverPassword
									})
								}}
							>
								Sign {signText.toLowerCase()} with GitHub
							</Button>
						) : null}
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
				</form>
			</div>
		</div>
	)
}

export default Auth
