"use client"

import { useToasts, ButtonDropdown } from "@geist-ui/core/dist"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import generateUUID from "@lib/generate-uuid"
import styles from "./post.module.css"
import EditDocumentList from "./edit-document-list"
import { ChangeEvent } from "react"
import DatePicker from "react-datepicker"
import getTitleForPostCopy from "@lib/get-title-for-post-copy"
import Description from "./description"
import { PostWithFiles } from "@lib/server/prisma"
import PasswordModal from "../../../components/password-modal"
import Title from "./title"
import FileDropzone from "./drag-and-drop"
import Button from "@components/button"
import Input from "@components/input"
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

const Post = ({
	initialPost,
	newPostParent
}: {
	initialPost?: PostWithFiles
	newPostParent?: string
}) => {
	const { setToast } = useToasts()
	const router = useRouter()
	const [title, setTitle] = useState(
		getTitleForPostCopy(initialPost?.title) || ""
	)
	const [description, setDescription] = useState(initialPost?.description || "")
	const [expiresAt, setExpiresAt] = useState(initialPost?.expiresAt)

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
			const res = await fetch(url, {
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
				const json = await res.json()
				router.push(`/post/${json.id}`)
			} else {
				const json = await res.json()
				console.error(json)
				setToast({
					text: "Please fill out all fields",
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
					text: "Please fill out the post title",
					type: "error"
				})
				hasErrored = true
			}

			if (!docs.length) {
				setToast({
					text: "Please add at least one document",
					type: "error"
				})
				hasErrored = true
			}

			for (const doc of docs) {
				if (!doc.title) {
					setToast({
						text: "Please fill out all the document titles",
						type: "error"
					})
					hasErrored = true
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

	const onClosePasswordModal = () => {
		setPasswordModalVisible(false)
		setSubmitting(false)
	}

	const submitPassword = (password: string) => onSubmit("protected", password)

	const onChangeExpiration = (date: Date) => setExpiresAt(date)

	const onChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setTitle(e.target.value)
	}, [])

	const onChangeDescription = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			e.preventDefault()
			setDescription(e.target.value)
		},
		[]
	)

	const updateDocTitle = (i: number) => (title: string) => {
		setDocs((docs) =>
			docs.map((doc, index) => (i === index ? { ...doc, title } : doc))
		)
	}

	const updateDocContent = (i: number) => (content: string) => {
		setDocs((docs) =>
			docs.map((doc, index) => (i === index ? { ...doc, content } : doc))
		)
	}

	const removeDoc = (i: number) => () => {
		setDocs((docs) => docs.filter((_, index) => i !== index))
	}

	const uploadDocs = (files: Document[]) => {
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

	// pasted files
	// const files = e.clipboardData.files as File[]
	// if (files.length) {
	//     const docs = Array.from(files).map((file) => ({
	//         title: file.name,
	//         content: '',
	//         id: generateUUID()
	//     }))
	// }

	const onPaste = (e: ClipboardEvent) => {
		const pastedText = e.clipboardData?.getData("text")

		if (pastedText) {
			if (!title) {
				setTitle("Pasted text")
			}
		}
	}

	const CustomTimeInput = ({
		date,
		value,
		onChange
	}: {
		date: Date
		value: string
		onChange: (date: string) => void
	}) => (
		<input
			type="time"
			value={value}
			onChange={(e) => {
				if (!isNaN(date.getTime())) {
					onChange(e.target.value || date.toISOString().slice(11, 16))
				}
			}}
			style={{
				backgroundColor: "var(--bg)",
				border: "1px solid var(--light-gray)",
				borderRadius: "var(--radius)"
			}}
			required
		/>
	)

	return (
		// 150 so the post dropdown doesn't overflow
		<div style={{ paddingBottom: 150 }}>
			<Title title={title} onChange={onChangeTitle} />
			<Description description={description} onChange={onChangeDescription} />
			<FileDropzone setDocs={uploadDocs} />
			<EditDocumentList
				onPaste={onPaste}
				docs={docs}
				updateDocTitle={updateDocTitle}
				updateDocContent={updateDocContent}
				removeDoc={removeDoc}
			/>
			<div className={styles.buttons}>
				<Button
					className={styles.button}
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
					type="default"
					style={{
						flex: 1
					}}
				>
					Add a File
				</Button>
				<div className={styles.rightButtons}>
					<DatePicker
						onChange={onChangeExpiration}
						customInput={
							<Input label="Expires at" width="100%" height="40px" />
						}
						placeholderText="Won't expire"
						selected={expiresAt}
						showTimeInput={true}
						// @ts-ignore
						customTimeInput={<CustomTimeInput />}
						timeInputLabel="Time:"
						dateFormat="MM/dd/yyyy h:mm aa"
						className={styles.datePicker}
						clearButtonTitle={"Clear"}
						// TODO: investigate why this causes margin shift if true
						enableTabLoop={false}
						minDate={new Date()}
					/>
					<ButtonDropdown loading={isSubmitting} type="success">
						<ButtonDropdown.Item main onClick={() => onSubmit("unlisted")}>
							Create Unlisted
						</ButtonDropdown.Item>
						<ButtonDropdown.Item onClick={() => onSubmit("private")}>
							Create Private
						</ButtonDropdown.Item>
						<ButtonDropdown.Item onClick={() => onSubmit("public")}>
							Create Public
						</ButtonDropdown.Item>
						<ButtonDropdown.Item onClick={() => onSubmit("protected")}>
							Create with Password
						</ButtonDropdown.Item>
					</ButtonDropdown>
				</div>
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
