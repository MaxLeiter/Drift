import { PostButtons } from "./components/header/post-buttons"
import { PostTitle } from "./components/header/title"
import DocumentComponent from "./components/post-files/view-document"
import styles from "./layout.module.css"

export default function PostLoading() {
	return (
		<>
			<div className={styles.header}>
				<PostButtons loading title="" />
				<PostTitle title="" loading />
				<DocumentComponent skeleton initialTab="preview" />
			</div>
		</>
	)
}
