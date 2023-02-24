import { Gist } from "./types"
import * as crypto from "crypto"
import { getHtmlFromFile } from "@lib/server/get-html-from-drift-file"
import { prisma, ServerPost } from "@lib/server/prisma"

export type AdditionalPostInformation = Pick<
	ServerPost,
	"visibility" | "password" | "expiresAt"
> & {
	userId: string
}

export async function createPostFromGist(
	{ userId, visibility, password, expiresAt }: AdditionalPostInformation,
	gist: Gist
): Promise<ServerPost> {
	const files = Object.values(gist.files)
	const [title, description] = gist.description.split("\n", 1)

	if (files.length === 0) {
		throw new Error("The gist did not have any files")
	}

	const newPost = await prisma.post.create({
		data: {
			title,
			description,
			visibility,
			password,
			expiresAt,
			createdAt: new Date(gist.created_at),
			author: {
				connect: {
					id: userId
				}
			},
			files: {
				createMany: {
					data: await Promise.all(
						files.map(async (file) => {
							const content = await file.content()
							const html = await getHtmlFromFile({
								content,
								title: file.filename
							})

							return {
								title: file.filename,
								content: Buffer.from(content, "utf-8"),
								sha: crypto
									.createHash("sha256")
									.update(content)
									.digest("hex")
									.toString(),
								html: Buffer.from(html as string, "utf-8"),
								userId: userId
							}
						})
					)
				}
			}
		}
	})

	return newPost
}
