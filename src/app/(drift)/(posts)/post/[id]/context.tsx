"use client"

import { createContext, useContext } from "react"
import { getPost } from "./get-post"

const PostContext = createContext<Awaited<ReturnType<typeof getPost>> | null>(
	null
)

export const PostProvider = PostContext.Provider

export const usePost = () => {
	const post = useContext(PostContext)

	if (!post) {
		throw new Error("usePost must be used within a PostProvider")
	}

	return post
}
