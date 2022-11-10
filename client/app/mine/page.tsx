import styles from "@styles/Home.module.css"

import MyPosts from "@components/my-posts"
import type { GetServerSideProps } from "next"
import { Post } from "@lib/types"
import { Page } from "@geist-ui/core/dist"
import { getCookie } from "cookies-next"
import { TOKEN_COOKIE_NAME } from "@lib/constants"
import { useRouter } from "next/navigation"
import { cookies } from "next/headers"
export default function Mine() {
	const router = useRouter()
	const driftToken = cookies().get(TOKEN_COOKIE_NAME)
	if (!driftToken) {
		return router.push("/signin")
	}

	// const posts = await fetch(process.env.API_URL + `/posts/mine`, {
	// 	method: "GET",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 		Authorization: `Bearer ${driftToken}`,
	// 		"x-secret-key": process.env.SECRET_KEY || ""
	// 	}
	// })

	if (!posts.ok) {
		return router.push("/signin")
	}

	const { posts, error, hasMore } = await posts.json()

	return <MyPosts morePosts={hasMore} error={error} posts={posts} />
}
