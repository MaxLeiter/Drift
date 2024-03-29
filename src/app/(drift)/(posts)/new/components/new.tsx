"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState, ClipboardEvent } from "react"
import generateUUID from "@lib/generate-uuid"
import EditDocumentList from "./edit-document-list"
import { ChangeEvent } from "react"
import getTitleForPostCopy from "src/app/lib/get-title-for-post-copy"
// import Description from "./description"
import { PostWithFiles } from "@lib/server/prisma"
import PasswordModal from "../../../../components/password-modal"
import Title from "./title"
import FileDropzone from "./drag-and-drop"
import { Button, buttonVariants } from "@components/button"
import { useToasts } from "@components/toasts"
import { fetchWithUser } from "src/app/lib/fetch-with-user"
import dynamic from "next/dynamic"
import ButtonDropdown from "@components/button-dropdown"
import clsx from "clsx"
import { Spinner } from "@components/spinner"
import { cn } from "@lib/cn"
import { Calendar as CalendarIcon } from "react-feather"

const DatePicker = dynamic(
	() => import("@components/date-picker").then((m) => m.DatePicker),
	{
		ssr: false,
		loading: () => (
			<Button
				variant={"outline"}
				className={cn(
					"w-[280px] justify-start text-left font-normal",
					"text-muted-foreground"
				)}
			>
				<CalendarIcon className="w-4 h-4 mr-2" />
				<span>Won&apos;t expire</span>
			</Button>
		)
	}
)

const emptyDoc = {
	title: "",
	content: "",
	id: generateUUID()
}

export type Document = {
	title: string
	content: string
	id: string
}

function Post({
	initialPost,
	newPostParent
}: {
	initialPost?: PostWithFiles
	newPostParent?: string
}): JSX.Element {
	const { setToast } = useToasts()
	const router = useRouter()
	const [title, setTitle] = useState(
		getTitleForPostCopy(initialPost?.title) || ""
	)
	const [description /*, setDescription */] = useState(
		initialPost?.description || ""
	)
	const [expiresAt, setExpiresAt] = useState<Date>()

	const defaultDocs: Document[] = initialPost
		? initialPost.files?.map((doc) => ({
				title: doc.title,
				content: doc.content,
				id: doc.id
		  }))
		: [emptyDoc]

	const [docs, setDocs] = useState(defaultDocs)

	const [passwordModalVisible, setPasswordModalVisible] = useState(false)

	const sendRequest = useCallback(
		async (
			url: string,
			data: {
				expiresAt: Date | null
				visibility?: string
				title?: string
				files?: Document[]
				password?: string
				parentId?: string
			}
		) => {
			const res = await fetchWithUser(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					title,
					description,
					files: docs,
					...data
				})
			})

			if (res.ok) {
				const json = (await res.json()) as { id: string }
				router.push(`/post/${json.id}`)
				return
			} else {
				const json = (await res.json()) as { error: string }
				console.error(json)
				setToast({
					id: "error",
					message: json.error ?? "Please fill out all fields",
					type: "error"
				})
				setPasswordModalVisible(false)
				setSubmitting(false)
			}
		},
		[description, docs, router, setToast, title]
	)

	const [isSubmitting, setSubmitting] = useState(false)

	const onSubmit = useCallback(
		async (visibility: string, password?: string) => {
			if (visibility === "protected" && !password) {
				setPasswordModalVisible(true)
				return
			}

			setPasswordModalVisible(false)
			setSubmitting(true)

			let hasErrored = false

			if (!title) {
				setToast({
					message: "Please fill out the post title",
					type: "error"
				})
				hasErrored = true
			}

			if (!docs.length) {
				setToast({
					message: "Please add at least one file",
					type: "error"
				})
				hasErrored = true
			}

			for (const doc of docs) {
				if (!doc.title) {
					setToast({
						message: "Please fill out all the filenames",
						type: "error"
					})
					hasErrored = true
					break
				}
			}

			if (hasErrored) {
				setSubmitting(false)
				return
			}

			await sendRequest("/api/post", {
				title,
				files: docs,
				visibility,
				password,
				expiresAt: expiresAt || null,
				parentId: newPostParent
			})
		},
		[docs, expiresAt, newPostParent, sendRequest, setToast, title]
	)

	const onChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setTitle(e.target.value)
	}, [])

	// const onChangeDescription = useCallback(
	// 	(e: ChangeEvent<HTMLInputElement>) => {
	// 		e.preventDefault()
	// 		setDescription(e.target.value)
	// 	},
	// 	[]
	// )

	function onClosePasswordModal() {
		setPasswordModalVisible(false)
		setSubmitting(false)
	}

	function submitPassword(password: string) {
		return onSubmit("protected", password)
	}

	function updateDocTitle(i: number) {
		return (title: string) => {
			setDocs((docs) =>
				docs.map((doc, index) => (i === index ? { ...doc, title } : doc))
			)
		}
	}

	function updateDocContent(i: number) {
		return (content: string) => {
			setDocs((docs) =>
				docs.map((doc, index) => (i === index ? { ...doc, content } : doc))
			)
		}
	}

	function removeDoc(i: number) {
		return () => {
			setDocs((docs) => docs.filter((_, index) => i !== index))
		}
	}

	function uploadDocs(files: Document[]) {
		// if no title is set and the only document is empty,
		const isFirstDocEmpty =
			docs.length <= 1 && (docs.length ? docs[0].title === "" : true)
		const shouldSetTitle = !title && isFirstDocEmpty
		if (shouldSetTitle) {
			if (files.length === 1) {
				setTitle(files[0].title)
			} else if (files.length > 1) {
				setTitle("Uploaded files")
			}
		}

		if (isFirstDocEmpty) setDocs(files)
		else setDocs((docs) => [...docs, ...files])
	}

	function onPaste(e: ClipboardEvent<HTMLTextAreaElement>) {
		const pastedText = e.clipboardData?.getData("text")

		if (pastedText) {
			if (!title) {
				setTitle("Pasted text")
			}
		}
	}

	return (
		<div className="flex flex-col flex-1 gap-4">
			<Title title={title} onChange={onChangeTitle} className="py-4" />
			{/* <Description description={description} onChange={onChangeDescription} /> */}
			<EditDocumentList
				onPaste={onPaste}
				docs={docs}
				updateDocTitle={updateDocTitle}
				updateDocContent={updateDocContent}
				removeDoc={removeDoc}
			/>
			<FileDropzone setDocs={uploadDocs} />

			<div className="flex flex-col items-end justify-between gap-4 mt-4 sm:flex-row sm:items-center">
				<span className="flex flex-1 gap-2">
					<Button
						onClick={() => {
							setDocs([
								...docs,
								{
									title: "",
									content: "",
									id: generateUUID()
								}
							])
						}}
						className="min-w-[120px] max-w-[200px] flex-1"
						variant={"secondary"}
					>
						Add a File
					</Button>
					<DatePicker setExpiresAt={setExpiresAt} expiresAt={expiresAt} />
				</span>
				<ButtonDropdown>
					<span
						className={clsx(
							"w-full cursor-pointer rounded-br-none rounded-tr-none",
							buttonVariants({
								variant: "default"
							})
						)}
						onClick={() => onSubmit("unlisted")}
					>
						{isSubmitting ? <Spinner className="mr-2" /> : null}
						Create Unlisted
					</span>
					<span
						className={clsx("w-full cursor-pointer")}
						onClick={() => onSubmit("private")}
					>
						Create Private
					</span>
					<span
						className={clsx("w-full cursor-pointer")}
						onClick={() => onSubmit("public")}
					>
						Create Public
					</span>
					<span
						className={clsx("w-full cursor-pointer")}
						onClick={() => onSubmit("protected")}
					>
						Create with Password
					</span>
				</ButtonDropdown>
			</div>
			<PasswordModal
				creating={true}
				isOpen={passwordModalVisible}
				onClose={onClosePasswordModal}
				onSubmit={submitPassword}
			/>
		</div>
	)
}

export default Post

// function CustomTimeInput({
// 	date,
// 	value,
// 	onChange
// }: {
// 	date: Date
// 	value: string
// 	onChange: (date: string) => void
// }) {
// 	return (
// 		<input
// 			type="time"
// 			value={value}
// 			onChange={(e) => {
// 				if (!isNaN(date.getTime())) {
// 					onChange(e.target.value || date.toISOString().slice(11, 16))
// 				}
// 			}}
// 			style={{
// 				backgroundColor: "var(--bg)",
// 				border: "1px solid var(--light-gray)",
// 				borderRadius: "var(--radius)"
// 			}}
// 			required
// 		/>
// 	)
// }
