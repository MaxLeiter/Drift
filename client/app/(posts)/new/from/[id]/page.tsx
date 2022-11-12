import NewPost from "app/(posts)/new/components/new"
import { useRouter } from "next/navigation"
import { getPostWithFiles } from "@lib/server/prisma"
import Header from "app/components/header"

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
		router.push("/new")
		return;
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
