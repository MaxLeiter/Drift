import NewPost from "../../components/new"
import { notFound, redirect } from "next/navigation"
import { getPostById } from "@lib/server/prisma"
import { getSession } from "@lib/server/session"

const NewFromExisting = async ({
	params
}: {
	params: {
		id: string
	}
}) => {
	const session = await getSession()
	if (!session?.user) {
		return redirect("/signin")
	}

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
