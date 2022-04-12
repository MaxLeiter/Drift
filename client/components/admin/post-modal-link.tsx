import { Link, Modal, useModal } from "@geist-ui/core"
import { Post } from "@lib/types"
import Cookies from "js-cookie"
import useSWR from "swr"
import { adminFetcher } from "."
import styles from "./admin.module.css"

const PostModal = ({ id }: { id: string }) => {
	const { visible, setVisible, bindings } = useModal()
	const { data: post, error } = useSWR<Post>(
		`/server-api/admin/post/${id}`,
		adminFetcher
	)
	if (error) return <Modal>failed to load</Modal>
	if (!post) return <Modal>loading...</Modal>

	const deletePost = async () => {
		await fetch(`/server-api/admin/post/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${Cookies.get("drift-token")}`
			}
		})
		setVisible(false)
	}

	return (
		<>
			<Link href="#" color onClick={() => setVisible(true)}>
				{post.title}
			</Link>
			<Modal width={"var(--main-content)"} {...bindings}>
				<Modal.Title>{post.title}</Modal.Title>
				<Modal.Subtitle>Click an item to expand</Modal.Subtitle>
				{post.files?.map((file) => (
					<div key={file.id} className={styles.postModal}>
						<Modal.Content>
							<details>
								<summary>{file.title}</summary>
								<div dangerouslySetInnerHTML={{ __html: file.html }}></div>
							</details>
						</Modal.Content>
					</div>
				))}
				<Modal.Action type="warning" onClick={deletePost}>
					Delete
				</Modal.Action>
				<Modal.Action passive onClick={() => setVisible(false)}>
					Close
				</Modal.Action>
			</Modal>
		</>
	)
}

export default PostModal
