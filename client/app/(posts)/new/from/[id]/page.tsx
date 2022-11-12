import NewPost from "@components/new-post"
import { useRouter } from "next/navigation"
import { getPostWithFiles } from "@lib/server/prisma"
import Header from "@components/header"

const NewFromExisting = async ({
	params
}: {
	params: {
		id: string
	}
}) => {
	const { id } = params
	const router = useRouter()

	if (!id) {
		return router.push("/new")
	}

	const post = await getPostWithFiles(id)

	return (
		<>
			<Header signedIn />
			<NewPost initialPost={post} newPostParent={id} />
		</>
	)
}

export default NewFromExisting
