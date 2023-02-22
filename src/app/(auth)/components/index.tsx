"use client"

import { startTransition, Suspense, useState } from "react"
import styles from "./auth.module.css"
import Link from "../../components/link"
import { signIn } from "next-auth/react"
import Input from "@components/input"
import Button from "@components/button"
import { GitHub } from "react-feather"
import { useToasts } from "@components/toasts"
import { useRouter } from "next/navigation"
import Note from "@components/note"
import { ErrorQueryParamsHandler } from "./query-handler"

function Auth({
	page,
	requiresServerPassword,
	isGithubEnabled
}: {
	page: "signup" | "signin"
	requiresServerPassword?: boolean
	isGithubEnabled?: boolean
}) {
	const [serverPassword, setServerPassword] = useState("")
	const { setToast } = useToasts()
	const signingIn = page === "signin"
	const router = useRouter()
	const signText = signingIn ? "In" : "Up"
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [submitting, setSubmitting] = useState(false)

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setSubmitting(true)

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
			setSubmitting(false)
		} else {
			startTransition(() => {
				router.push("/new")
				router.refresh()
			})
		}
	}

	function handleChangeUsername(event: React.ChangeEvent<HTMLInputElement>) {
		setUsername(event.target.value)
	}

	function handleChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
		setPassword(event.target.value)
	}

	function handleChangeServerPassword(
		event: React.ChangeEvent<HTMLInputElement>
	) {
		setServerPassword(event.target.value)
	}

	return (
		<div className={styles.container}>
			{/* Suspense boundary because useSearchParams causes static bailout */}
			<Suspense fallback={null}>
				<ErrorQueryParamsHandler />
			</Suspense>
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
									onChange={handleChangeServerPassword}
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
						<Button width={"100%"} type="submit" loading={submitting}>
							Sign {signText}
						</Button>
						{isGithubEnabled ? (
							<>
								<hr style={{ width: "100%" }} />
								<Button
									type="submit"
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
							</>
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
