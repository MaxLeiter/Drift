"use client"
import { Tabs, Textarea } from "@geist-ui/core/dist"
import Image from "next/image"
import styles from "./home.module.css"
// TODO:components/new-post/ move these styles
import markdownStyles from "app/(posts)/components/preview/preview.module.css"
import Card from "./card"
import DocumentTabs from "app/(posts)/components/tabs"
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
				<DocumentTabs
					defaultTab="preview"
					isEditing={false}
					content={introContent}
					preview={rendered}
					title={introTitle}
				/>
			</Card>
		</>
	)
}

export default Home
