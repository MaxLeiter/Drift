import { useDropzone } from "react-dropzone"
import styles from "./drag-and-drop.module.css"
import generateUUID from "@lib/generate-uuid"
import {
	allowedFileTypes,
	allowedFileNames,
	allowedFileExtensions
} from "@lib/constants"
import byteToMB from "@lib/byte-to-mb"
import type { Document } from "../new"
import { useToasts } from "@components/toasts"

function FileDropzone({ setDocs }: { setDocs: (docs: Document[]) => void }) {
	const { setToast } = useToasts()
	const onDrop = async (acceptedFiles: File[]) => {
		const newDocs = await Promise.all(
			acceptedFiles.map((file) => {
				return new Promise<Document>((resolve) => {
					const reader = new FileReader()

					reader.onabort = () =>
						setToast({ message: "File reading was aborted", type: "error" })
					reader.onerror = () =>
						setToast({ message: "File reading failed", type: "error" })
					reader.onload = () => {
						const content = reader.result as string
						resolve({
							title: file.name,
							content,
							id: generateUUID()
						})
					}
					reader.readAsText(file)
				})
			})
		)

		setDocs(newDocs)
	}

	const validator = (file: File) => {
		// TODO: make this configurable
		const maxFileSize = 50000000
		if (file.size > maxFileSize) {
			return {
				code: "file-too-big",
				message:
					"File is too big. Maximum file size is " +
					byteToMB(maxFileSize) +
					" MB."
			}
		}

		// We initially try to use the browser provided mime type, and then fall back to file names and finally extensions
		if (
			allowedFileTypes.includes(file.type) ||
			allowedFileNames.includes(file.name) ||
			allowedFileExtensions.includes(file.name?.split(".").pop() || "")
		) {
			return null
		} else {
			return {
				code: "not-plain-text",
				message: `Only plain text files are allowed.`
			}
		}
	}

	const { getRootProps, getInputProps, isDragActive, fileRejections } =
		useDropzone({ onDrop, validator })

	const fileRejectionItems = fileRejections.map(({ file, errors }) => (
		<li key={file.name}>
			{file.name}:
			<ul>
				{errors.map((e) => (
					<li key={e.code}>{e.message}</li>
				))}
			</ul>
		</li>
	))

	return (
		<div className={styles.container}>
			<div {...getRootProps()} className={styles.dropzone}>
				<input {...getInputProps()} />
				{!isDragActive && (
					<p style={{ color: "var(--gray)" }}>
						Drag some files here, or <span className={styles.verb} /> to select files
					</p>
				)}
				{isDragActive && <p>Release to drop the files here</p>}
			</div>
			{fileRejections.length > 0 && (
				<ul className={styles.error}>
					{/* <Button style={{ float: 'right' }} type="abort" onClick={() => fileRejections.splice(0, fileRejections.length)} auto iconRight={<XCircle />}></Button> */}
					<p>There was a problem with one or more of your files.</p>
					{fileRejectionItems}
				</ul>
			)}
		</div>
	)
}

export default FileDropzone
