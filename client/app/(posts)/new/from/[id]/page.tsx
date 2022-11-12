import NewPost from "../../components/new"
import { useRouter } from "next/navigation"
import Header from "@components/header"
import { getPostById } from "@lib/server/prisma"

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

	const post = await getPostById(id, true)

	return (
		<>
			<Header signedIn />
			<NewPost initialPost={post} newPostParent={id} />
		</>
	)
}

export default NewFromExisting
