import { ApiToken } from "@prisma/client"
import useSWR from "swr"

type ConvertDateToString<T> = {
	[P in keyof T]: T[P] extends Date ? string : T[P]
}

export type SerializedApiToken = ConvertDateToString<ApiToken>

type UseApiTokens = {
	userId?: string
	initialTokens?: SerializedApiToken[]
}

const TOKENS_ENDPOINT = "/api/user/tokens"

export function useApiTokens({ userId, initialTokens }: UseApiTokens) {
	const { data, mutate, error, isLoading } = useSWR<SerializedApiToken[]>(
		userId ? "/api/user/tokens?userId=" + userId : null,
		{
			refreshInterval: 10000,
			fallbackData: initialTokens
		}
	)

	async function createToken(newToken: string) {
		if (!newToken) {
			throw new Error("Token name is required")
		}

		const res = await fetch(
			`${TOKENS_ENDPOINT}?userId=${userId}&name=${newToken}`,
			{
				method: "POST"
			}
		)

		const response = await res.json()
		if (response.error) {
			throw new Error(response.error)
			return
		}

		mutate([...(data || []), response])

		return response as SerializedApiToken
	}

	const expireToken = async (id: string) => {
		await fetch(`${TOKENS_ENDPOINT}?userId=${userId}&tokenId=${id}`, {
			method: "DELETE"
		})
		mutate(data?.filter((token) => token.id !== id))
	}

	return {
		data,
		isLoading,
		error,
		createToken,
		expireToken
	}
}
