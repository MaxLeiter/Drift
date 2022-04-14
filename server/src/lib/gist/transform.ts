import getHtmlFromFile from "@lib/get-html-from-drift-file"
import { Post } from "@lib/models/Post"
import { File } from "@lib/models/File"
import { Gist } from "./types"
import * as crypto from "crypto"

export type AdditionalPostInformation = Pick<
	Post,
	"visibility" | "password" | "expiresAt"
> & {
	userId: string
}

export async function createPostFromGist(
	{ userId, visibility, password, expiresAt }: AdditionalPostInformation,
	gist: Gist
): Promise<Post> {
	const files = Object.values(gist.files)
	const [title, description] = gist.description.split("\n", 1)

	if (files.length === 0) {
		throw new Error("The gist did not have any files")
	}

	const newPost = new Post({
		title,
		description,
		visibility,
		password,
		expiresAt,
		createdAt: new Date(gist.created_at)
	})

	await newPost.save()
	await newPost.$add("users", userId)
	const newFiles = await Promise.all(
		files.map(async (file) => {
			const content = await file.content()
			const html = getHtmlFromFile({ content, title: file.filename })
			const newFile = new File({
				title: file.filename,
				content,
				sha: crypto
					.createHash("sha256")
					.update(content)
					.digest("hex")
					.toString(),
				html: html || "",
				userId: userId,
				postId: newPost.id
			})
			await newFile.save()
			return newFile
		})
	)

	await Promise.all(
		newFiles.map(async (file) => {
			await newPost.$add("files", file.id)
			await newPost.save()
		})
	)

	return newPost
}
