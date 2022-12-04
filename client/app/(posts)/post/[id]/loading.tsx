import { PostButtons } from "./components/header/post-buttons"
import { PostTitle } from "./components/header/title"
import styles from "./styles.module.css"

export default function PostLoading() {
	return (
		<>
			<div className={styles.header}>
				<PostButtons loading title="" />
				<PostTitle title="" loading />
			</div>
		</>
	)
}
