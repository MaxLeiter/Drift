import type { PostVisibility } from "./types"

export default function getPostPath(visibility: PostVisibility, id: string) {
	switch (visibility) {
		case "private":
			return `/post/private/${id}`
		case "protected":
			return `/post/protected/${id}`
		case "unlisted":
		case "public":
			return `/post/${id}`
		default:
			console.error(`Unknown visibility: ${visibility}`)
			return `/post/${id}`
	}
}
