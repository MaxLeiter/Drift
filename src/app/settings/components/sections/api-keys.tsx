"use client"

import Button from "@components/button"
import Input from "@components/input"
import Note from "@components/note"
import { Spinner } from "@components/spinner"
import { useToasts } from "@components/toasts"
import { ApiToken } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useState } from "react"
import useSWR from "swr"
import styles from "./api-keys.module.css"

type ConvertDateToString<T> = {
	[P in keyof T]: T[P] extends Date ? string : T[P]
}

type SerializedApiToken = ConvertDateToString<ApiToken>

// need to pass in the accessToken
const APIKeys = ({ tokens: initialTokens }: { tokens?: SerializedApiToken[] }) => {
	const session = useSession()
	const { setToast } = useToasts()
	const { data, error, mutate } = useSWR<SerializedApiToken[]>(
		"/api/user/tokens?userId=" + session?.data?.user?.id,
		{
			fetcher: async (url: string) => {
				if (session.status === "loading") return initialTokens

				return fetch(url).then(async (res) => {
					const data = await res.json()
					if (data.error) {
						setError(data.error)
						return
					} else {
						setError(undefined)
					}

					return data
				})
			},
			fallbackData: initialTokens
		}
	)

	const [submitting, setSubmitting] = useState<boolean>(false)
	const [newToken, setNewToken] = useState<string>("")
	const [errorText, setError] = useState<string>()

	const createToken = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!newToken) {
			return
		}
		setSubmitting(true)

		const res = await fetch(
			`/api/user/tokens?userId=${session.data?.user.id}&name=${newToken}`,
			{
				method: "POST",
			}
		)

		const response = await res.json()
		if (response.error) {
			setError(response.error)
			return
		} else {
			setError(undefined)
		}

		setSubmitting(false)
		navigator.clipboard.writeText(response.token)
		mutate([...(data || []), response])
		setNewToken("")
		setToast({
			message: "Copied to clipboard!",
			type: "success"
		})
	}

	const expireToken = async (id: string) => {
		setSubmitting(true)
		await fetch(`/api/user/tokens?userId=${session.data?.user.id}&tokenId=${id}`, {
			method: "DELETE",
			headers: {
				Authorization: "Bearer " + session?.data?.user.sessionToken
			}
		})
		setSubmitting(false)
		mutate(data?.filter((token) => token.id !== id))
	}

	const onChangeNewToken = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewToken(e.target.value)
	}

	const hasError = Boolean(error || errorText)
	return (
		<>
			{!hasError && (
				<Note type="info">
					API keys allow you to access the API from 3rd party tools.
				</Note>
			)}
			{hasError && <Note type="error">{error?.message || errorText}</Note>}

			<form className={styles.form}>
				<h3>Create new</h3>
				<Input
					type="text"
					value={newToken}
					onChange={onChangeNewToken}
					aria-label="API Key name"
					placeholder="Name"
				/>
				<Button
					type="button"
					onClick={createToken}
					loading={submitting}
					disabled={!newToken}
				>
					Submit
				</Button>
			</form>

			<div className={styles.tokens}>
				{data ? (
					data?.length ? (
						<table width={'100%'}>
							<thead>
								<tr>
									<th>Name</th>
									<th>Expires</th>
									<th>Delete</th>
								</tr>
							</thead>
							<tbody>
								{data?.map((token) => (
									<tr key={token.id}>
										<td>{token.name}</td>
										<td>{new Date(token.expiresAt).toDateString()}</td>
										<td>
											<Button
												type="button"
												onClick={() => expireToken(token.id)}
												loading={submitting}
											>
												Revoke
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>You have no API keys.</p>
					)
				) : (
					<div style={{ marginTop: "var(--gap-quarter)" }}>
						<Spinner />
					</div>
				)}
			</div>
		</>
	)
}

export default APIKeys
