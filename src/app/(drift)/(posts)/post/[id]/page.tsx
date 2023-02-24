import VisibilityControl from "@components/badges/visibility-control"
import {
	PostWithFilesAndAuthor,
	serverPostToClientPost,
	ServerPostWithFilesAndAuthor
} from "@lib/server/prisma"
import PostFiles from "./components/post-files"
import { getPost } from "./get-post"

export default async function PostPage({
	params
}: {
	params: {
		id: string
	}
}) {
	const post = (await getPost(params.id)) as ServerPostWithFilesAndAuthor
	const clientPost = serverPostToClientPost(post) as PostWithFilesAndAuthor

	return (
		<>
			<PostFiles post={clientPost} />
			<VisibilityControl
				authorId={post.authorId}
				postId={post.id}
				visibility={post.visibility}
			/>
		</>
	)
}
