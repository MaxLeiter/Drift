import { Text, useMediaQuery, useTheme, useToasts } from "@geist-ui/core/dist"
import { memo } from "react"
import { useDropzone } from "react-dropzone"
import styles from "./drag-and-drop.module.css"
import type { Document } from "@lib/types"
import generateUUID from "@lib/generate-uuid"
import {
	allowedFileTypes,
	allowedFileNames,
	allowedFileExtensions
} from "@lib/constants"
import byteToMB from "@lib/byte-to-mb"

function FileDropzone({ setDocs }: { setDocs: (docs: Document[]) => void }) {
	const { palette } = useTheme()
	const { setToast } = useToasts()
	const isMobile = useMediaQuery("xs", {
		match: "down"
	})
	const onDrop = async (acceptedFiles: File[]) => {
		const newDocs = await Promise.all(
			acceptedFiles.map((file) => {
				return new Promise<Document>((resolve) => {
					const reader = new FileReader()

					reader.onabort = () =>
						setToast({ text: "File reading was aborted", type: "error" })
					reader.onerror = () =>
						setToast({ text: "File reading failed", type: "error" })
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
					<li key={e.code}>
						<Text>{e.message}</Text>
					</li>
				))}
			</ul>
		</li>
	))

	const verb = isMobile ? "tap" : "click"
	return (
		<div className={styles.container}>
			<div
				{...getRootProps()}
				className={styles.dropzone}
				style={{
					borderColor: palette.accents_3
				}}
			>
				<input {...getInputProps()} />
				{!isDragActive && (
					<Text p>Drag some files here, or {verb} to select files</Text>
				)}
				{isDragActive && <Text p>Release to drop the files here</Text>}
			</div>
			{fileRejections.length > 0 && (
				<ul className={styles.error}>
					{/* <Button style={{ float: 'right' }} type="abort" onClick={() => fileRejections.splice(0, fileRejections.length)} auto iconRight={<XCircle />}></Button> */}
					<Text h5>There was a problem with one or more of your files.</Text>
					{fileRejectionItems}
				</ul>
			)}
		</div>
	)
}

export default FileDropzone
