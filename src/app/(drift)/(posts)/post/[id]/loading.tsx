import DocumentComponent from "./components/post-files/view-document"
import styles from "./layout.module.css"

export default function PostLoading() {
	return (
		<>
			<div className={styles.header}>
				<DocumentComponent skeleton initialTab="preview" />
			</div>
		</>
	)
}
