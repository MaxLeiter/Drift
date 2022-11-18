"use client"
import { Tabs, Textarea } from "@geist-ui/core/dist"
import Image from "next/image"
import styles from "./home.module.css"
// TODO:components/new-post/ move these styles
import markdownStyles from "app/(posts)/components/preview/preview.module.css"
import Card from "./card"
const Home = ({
	introTitle,
	introContent,
	rendered
}: {
	introTitle: string
	introContent: string
	rendered: string
}) => {
	return (
		<>
			<div
				style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
			>
				<Image
					src={"/assets/logo-optimized.svg"}
					width={48}
					height={48}
					alt=""
					priority
				/>
				<h1 style={{ marginLeft: "var(--gap)" }}>{introTitle}</h1>
			</div>
			<Card>
				<Tabs initialValue={"preview"} hideDivider leftSpace={0}>
					<Tabs.Item label={"Raw"} value="edit">
						{/* <textarea className={styles.lineCounter} wrap='off' readOnly ref={lineNumberRef}>1.</textarea> */}
						<div
							style={{
								marginTop: "var(--gap)",
								display: "flex",
								flexDirection: "column"
							}}
						>
							<textarea
								readOnly
								value={introContent}
								// TODO: Textarea should grow to fill parent if height == 100%
								style={{ flex: 1, minHeight: 350 }}
								className={styles.textarea}
							/>
						</div>
					</Tabs.Item>
					<Tabs.Item label="Preview" value="preview">
						<div>
							<article
								className={markdownStyles.markdownPreview}
								dangerouslySetInnerHTML={{ __html: rendered }}
								style={{
									height: "100%"
								}}
							/>
						</div>
					</Tabs.Item>
				</Tabs>
			</Card>
		</>
	)
}

export default Home
