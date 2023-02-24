import NewPost from "../../components/new"
import { notFound, redirect } from "next/navigation"
import {
	getPostById,
	serverPostToClientPost,
	ServerPostWithFiles
} from "@lib/server/prisma"
import { getSession } from "@lib/server/session"

async function NewFromExisting({
	params
}: {
	params: {
		id: string
	}
}) {
	const session = await getSession()
	if (!session?.user) {
		return redirect("/signin")
	}

	const { id } = params

	if (!id) {
		return notFound()
	}

	const post = (await getPostById(id, {
		select: {
			authorId: true,
			title: true,
			description: true,
			id: true,
			files: {
				select: {
					title: true,
					content: true,
					id: true
				}
			}
		}
	})) as ServerPostWithFiles

	const clientPost = post ? serverPostToClientPost(post) : undefined

	return <NewPost initialPost={clientPost} newPostParent={id} />
}

export default NewFromExisting
