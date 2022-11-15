import NewPost from "../../components/new"
import { notFound } from "next/navigation"
import { getPostById } from "@lib/server/prisma"

const NewFromExisting = async ({
	params
}: {
	params: {
		id: string
	}
}) => {
	const { id } = params

	if (!id) {
		return notFound()
	}

	const post = await getPostById(id, {
		withFiles: true,
		withAuthor: false
	})

	return <NewPost initialPost={post} newPostParent={id} />
}

export default NewFromExisting
