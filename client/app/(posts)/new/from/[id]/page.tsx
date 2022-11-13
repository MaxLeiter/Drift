import NewPost from "../../components/new"
import { notFound } from "next/navigation"
import { getPostById } from "@lib/server/prisma"
import PageWrapper from "@components/page-wrapper"

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

	const post = await getPostById(id, true)

	return (
		<PageWrapper signedIn>
			<NewPost initialPost={post} newPostParent={id} />
		</PageWrapper>
	)
}

export default NewFromExisting
