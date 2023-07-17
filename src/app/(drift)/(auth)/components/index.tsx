"use client"

import { useState } from "react"
import styles from "./auth.module.css"
import Link from "../../../components/link"
import { signIn } from "next-auth/react"
import { Input } from "@components/input"
import { Button } from "@components/button"
import { GitHub, Key, User } from "react-feather"
import { useToasts } from "@components/toasts"
import { useRouter } from "next/navigation"
import Note from "@components/note"
import { ErrorQueryParamsHandler } from "./query-handler"
import { AuthProviders } from "@lib/server/auth-props"

function Auth({
	page,
	credentialAuth,
	requiresServerPassword,
	authProviders
}: {
	page: "signup" | "signin"
	credentialAuth?: boolean
	requiresServerPassword?: boolean
	authProviders?: AuthProviders
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
			router.push("/new")
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
			<ErrorQueryParamsHandler />
			<div className={"mx-auto w-[300px]"}>
				<div className={styles.formContentSpace}>
					<h1 className="text-3xl font-bold">Sign {signText}</h1>
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
									aria-label="Server Password"
								/>
								<hr style={{ width: "100%" }} />
							</>
						) : null}

						{credentialAuth ? (
							<>
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
								<Button type="submit" loading={submitting}>
									Sign {signText}
								</Button>
							</>
						) : null}

						{authProviders?.length ? (
							<>
								<hr className="w-full" />
								<p className="mt-2 p-0 text-center">
									Or sign {signText.toLowerCase()} with one of the following
								</p>
								{authProviders?.map((provider) => {
									return provider.enabled ? (
										<Button
											type="submit"
											key={provider.id + "-button"}
											onClick={(e) => {
												e.preventDefault()
												signIn(provider.id, {
													callbackUrl: "/",
													registration_password: serverPassword
												})
												router.refresh()
											}}
											className="my-2 flex w-full max-w-[250px] items-center justify-center"
										>
											{getProviderIcon(provider.id)} Sign{" "}
											{signText.toLowerCase()} with {provider.public_name}
										</Button>
									) : null
								})}
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

const getProviderIcon = (provider: string) => {
	switch (provider) {
		case "github":
			return <GitHub className="mr-2 h-5 w-5" />
		case "keycloak":
			return <Key className="mr-2 h-5 w-5" />
		default:
			return <User className="mr-2 h-5 w-5" />
	}
}
