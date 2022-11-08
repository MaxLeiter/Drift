import ShiftBy from "@components/shift-by"
import { Spacer, Tabs, Card, Textarea, Text } from "@geist-ui/core"
import Image from "next/image"
import styles from "./home.module.css"
import markdownStyles from "@components/preview/preview.module.css"
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
				<ShiftBy y={-2}>
					<Image
						src={"/assets/logo-optimized.svg"}
						width={48}
						height={48}
						alt=""
					/>
				</ShiftBy>
				<Spacer />
				<Text style={{ display: "inline" }} h1>
					{introTitle}
				</Text>
			</div>
			<Card>
				<Tabs initialValue={"preview"} hideDivider leftSpace={0}>
					<Tabs.Item label={"Raw"} value="edit">
						{/* <textarea className={styles.lineCounter} wrap='off' readOnly ref={lineNumberRef}>1.</textarea> */}
						<div
							style={{
								marginTop: "var(--gap-half)",
								display: "flex",
								flexDirection: "column"
							}}
						>
							<Textarea
								readOnly
								value={introContent}
								width="100%"
								// TODO: Textarea should grow to fill parent if height == 100%
								style={{ flex: 1, minHeight: 350 }}
								resize="vertical"
								className={styles.textarea}
							/>
						</div>
					</Tabs.Item>
					<Tabs.Item label="Preview" value="preview">
						<div style={{ marginTop: "var(--gap-half)" }}>
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
