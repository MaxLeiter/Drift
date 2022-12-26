import VisibilityControl from "@components/badges/visibility-control"
import PostFiles from "./components/post-files"
import { getPost } from "./get-post"

export default async function PostPage({
	params
}: {
	params: {
		id: string
	}
}) {
	const { post } = await getPost(params.id)
	const stringifiedPost = JSON.stringify(post)
	return (
		<>
			<PostFiles post={stringifiedPost} />
			<VisibilityControl
				authorId={post.authorId}
				postId={post.id}
				visibility={post.visibility}
			/>
		</>
	)
}
