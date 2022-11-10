import NewPost from "@components/new-post"
import { useRouter } from "next/navigation"
import { cookies } from "next/headers"
import { TOKEN_COOKIE_NAME } from "@lib/constants"
import { getPostWithFiles } from "app/prisma"
import { useRedirectIfNotAuthed } from "@lib/server/hooks/use-redirect-if-not-authed"

const NewFromExisting = async ({
	params
}: {
	params: {
		id: string
	}
}) => {
	const { id } = params
	const router = useRouter()
	const cookieList = cookies()
	useRedirectIfNotAuthed()
	const driftToken = cookieList.get(TOKEN_COOKIE_NAME)

	if (!driftToken) {
		return router.push("/signin")
	}

	if (!id) {
		return router.push("/new")
	}

	const post = await getPostWithFiles(id)

	return <NewPost initialPost={post} newPostParent={id} />
}

export default NewFromExisting
