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
	})

	const serialized = JSON.stringify(post)

	return <NewPost initialPost={serialized} newPostParent={id} />
}

export default NewFromExisting
