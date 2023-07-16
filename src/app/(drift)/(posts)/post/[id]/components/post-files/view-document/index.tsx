import { Button } from "@components/button"
import ButtonGroup from "@components/button-group"
import Skeleton from "@components/skeleton"
import { Tooltip } from "@components/tooltip"
import DocumentTabs from "src/app/(drift)/(posts)/components/document-tabs"
import Link from "next/link"
import { memo } from "react"
import { Download, ExternalLink, Globe } from "react-feather"
import styles from "./document.module.css"
import { getURLFriendlyTitle } from "src/app/lib/get-url-friendly-title"
import { PostWithFiles, ServerPost } from "@lib/server/prisma"
import { isAllowedVisibilityForWebpage } from "@lib/constants"

type SharedProps = {
	initialTab: "edit" | "preview"
	file?: PostWithFiles["files"][0]
	post?: Pick<ServerPost, "id" | "title" | "visibility">
}

type Props = (
	| {
			skeleton?: true
	  }
	| {
			skeleton?: false
	  }
) &
	SharedProps

const DownloadButtons = ({
	rawLink,
	siteLink
}: {
	rawLink?: string
	siteLink?: string
}) => {
	return (
		<ButtonGroup>
			<Tooltip content="Download">
				<Link
					href={`${rawLink}?download=true`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button
						aria-label="Download"
						style={{ border: "none", background: "transparent" }}
					>
						<Download color="var(--fg)" className="w-4 h-4" />
					</Button>
				</Link>
			</Tooltip>
			{rawLink ? (
				<Tooltip content="Open raw in new tab">
					<Link href={rawLink || ""} target="_blank" rel="noopener noreferrer">
						<Button
							aria-label="Open raw file in new tab"
							style={{ border: "none", background: "transparent" }}
						>
							<ExternalLink color="var(--fg)" className="w-4 h-4" />
						</Button>
					</Link>
				</Tooltip>
			) : null}
			{siteLink ? (
				<Tooltip content="Open as webpage">
					<Link href={siteLink || ""} target="_blank" rel="noopener noreferrer">
						<Button
							aria-label="Open as webpage"
							style={{ border: "none", background: "transparent" }}
						>
							<Globe color="var(--fg)" className="w-4 h-4" />
						</Button>
					</Link>
				</Tooltip>
			) : null}
		</ButtonGroup>
	)
}

const Document = ({ skeleton, ...props }: Props) => {
	if (skeleton) {
		return (
			<>
				<div className={styles.card}>
					<div>
						<Skeleton width={"100%"} height={36} />
					</div>
					<div className={styles.documentContainer}>
						<Skeleton width={175} height={36} borderRadius={"4px 4px 0 0"} />
						<Skeleton
							width={"100%"}
							height={350}
							borderRadius={"0 0 4px 4px"}
						/>
					</div>
				</div>
			</>
		)
	}

	const { file, post } = props

	// if the query has our title, we can use it to scroll to the file.
	// we can't use the browsers implementation because the data isn't loaded yet
	if (file?.title && typeof window !== "undefined") {
		const hash = window.location.hash
		if (file && hash && hash === `#${file?.title}`) {
			const element = document.getElementById(file.title)
			if (element) {
				element.scrollIntoView()
			}
		}
	}
	/* .card header {
	display: flex;
	align-items: center;
	flex-direction: row;
	justify-content: space-between;
	height: 40px;
	line-height: 40px;
	padding: 0 16px;
	background: var(--lighter-gray);
	border-radius: 8px 8px 0px 0px;
}

.documentContainer {
	display: flex;
	flex-direction: column;
	overflow: auto;
	padding: var(--gap);
	border: 1px solid var(--lighter-gray);
	border-top: none;
	border-radius: 0px 0px 8px 8px;
} */
	return (
		<>
			<div>
				<header
					id={file?.title}
					className="flex h-10 items-center justify-between rounded-t bg-[var(--lighter-gray)] px-2"
				>
					<Link
						href={`#${file?.title}`}
						aria-label="File"
						// show an # when hovered avia :after
						className="text-gray-900 hover:after:ml-1 hover:after:content-[#] dark:text-gray-100"
					>
						{file?.title}
					</Link>
					{/* TODO: switch to api once next.js bug is fixed */}
					{/* Not /api/ because of rewrites defined in next.config.mjs */}
					<DownloadButtons
						rawLink={`/api/file/raw/${file?.id}`}
						siteLink={
							file && post && isAllowedVisibilityForWebpage(post.visibility)
								? `/pages/${file.id}/${getURLFriendlyTitle(file?.title || "")}`
								: undefined
						}
					/>
				</header>
				<div className="flex flex-col h-full pt-2">
					<DocumentTabs
						defaultTab={props.initialTab}
						staticPreview={file?.html}
						isEditing={false}
					>
						{file?.content || ""}
					</DocumentTabs>
				</div>
			</div>
		</>
	)
}

export default memo(Document)
