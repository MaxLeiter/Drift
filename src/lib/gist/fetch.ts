// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Gist, GistFile } from "./types"

async function fetchHelper(response: Response): Promise<Response> {
	if (!response.ok) {
		const isJson = response.headers
			.get("content-type")
			?.includes("application/json")
		const err = await (isJson ? response.json() : response.text())
		throw new Error(err as string)
	}
	return response
}

type Timestamp = string // e.g.: "2010-04-14T02:15:15Z"
interface File {
	filename: string
	content: string
	raw_url: string
	truncated: boolean
}

export interface GistResponse {
	id: string
	created_at: Timestamp
	description: string
	files: {
		[key: string]: File
	}
	truncated: boolean
}

function toFile(file: File): GistFile {
	return {
		filename: file.filename,
		content: file.truncated
			? () =>
					fetch(file.raw_url)
						.then(fetchHelper)
						.then((res) => res.text())
			: () => Promise.resolve(file.content)
	}
}

export function responseToGist(response: GistResponse): Gist {
	if (response.truncated) throw new Error("Gist has too many files to import")

	return {
		id: response.id,
		created_at: new Date(response.created_at),
		description: response.description || Object.keys(response.files)[0],
		files: Object.values(response.files).map(toFile)
	}
}

export async function getGist(id: string): Promise<Gist> {
	const response: GistResponse = await fetch(
		`https://api.github.com/gists/${id}`,
		{
			method: "GET",
			headers: {
				Accept: "application/vnd.github.v3+json"
			}
		}
	)
		.then(fetchHelper)
		.then((res) => res.json())

	return responseToGist(response)
}
