"use client"

import { Button } from "@components/button"
import { Input } from "@components/input"
import Note from "@components/note"
import { Spinner } from "@components/spinner"
import { useToasts } from "@components/toasts"
import {
	SerializedApiToken,
	useApiTokens
} from "src/app/hooks/swr/use-api-tokens"
import { copyToClipboard } from "src/app/lib/copy-to-clipboard"
import { useState } from "react"
import styles from "./api-keys.module.css"
import { useSessionSWR } from "@lib/use-session-swr"
import { TypographyH4 } from "@components/typography"

// need to pass in the accessToken
const APIKeys = ({
	tokens: initialTokens
}: {
	tokens?: SerializedApiToken[]
}) => {
	const { session } = useSessionSWR()
	const { setToast } = useToasts()
	const { data, error, createToken, expireToken } = useApiTokens({
		userId: session?.user?.id,
		initialTokens
	})

	const [submitting, setSubmitting] = useState<boolean>(false)
	const [newToken, setNewToken] = useState<string>("")

	const onChangeNewToken = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewToken(e.target.value)
	}

	const onCreateTokenClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setSubmitting(true)
		try {
			const createdToken = await createToken(newToken)
			setNewToken("")
			await copyToClipboard(createdToken?.token || "")
			setToast({
				message: "Your new API key has been copied to your clipboard.",
				type: "success"
			})
			setSubmitting(false)
		} catch (e) {
			if (e instanceof Error) {
				setToast({
					message: e.message,
					type: "error"
				})
			}
			setSubmitting(false)
		}
	}

	const onRevoke = (tokenId: string) => {
		expireToken(tokenId)
		setToast({
			message: "Your API key has been revoked.",
			type: "success"
		})
	}

	const hasError = Boolean(error)
	return (
		<>
			{!hasError && (
				<Note type="info">
					API keys allow you to access the API from 3rd party tools.
				</Note>
			)}
			{hasError && <Note type="error">{error?.message}</Note>}
			<form className={styles.form}>
				<TypographyH4>Create new</TypographyH4>
				<fieldset className={styles.fieldset}>
					<Input
						type="text"
						value={newToken}
						onChange={onChangeNewToken}
						aria-label="API Key name"
						placeholder="Name"
					/>
					<Button
						onClick={onCreateTokenClick}
						disabled={!newToken}
						loading={submitting}
					>
						Submit
					</Button>
				</fieldset>
			</form>

			<div className={styles.tokens}>
				{data ? (
					data?.length ? (
						<table width={"100%"}>
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
											<Button type="button" onClick={() => onRevoke(token.id)}>
												Revoke
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p className="p-4 text-center text-muted-foreground">No API keys found.</p>
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
