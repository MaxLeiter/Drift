/* eslint-disable */
// @ts-nocheck

import { Post } from "@lib/models/Post"
import { User } from "@lib/models/User"
import { File } from "@lib/models/File"
import { Sequelize } from "sequelize-typescript"
import { createPostFromGist, responseToGist } from ".."
import { GistResponse } from "../fetch"
import { AdditionalPostInformation } from "../transform"
import * as path from "path"

let aUser: User

let sequelize: Sequelize

beforeAll(async () => {
	sequelize = new Sequelize({
		dialect: "sqlite",
		storage: ":memory:",
		models: [path.resolve(__dirname, "../../models")],
		logging: false
	})
	await sequelize.authenticate()
	await sequelize.sync({ force: true })

	aUser = await User.create({
		username: "a user",
		password: "monkey",
		role: "user"
	})
})

afterAll(async () => {
	await sequelize.close()
})

async function createPost(
	response: GistResponse,
	override: Partial<AdditionalPostInformation> = {}
): Promise<Post> {
	const info: AdditionalPostInformation = {
		userId: aUser.id,
		visibility: "public",
		...override
	}
	return createPostFromGist(info, responseToGist(response))
}

describe("Gist", () => {
	it("should fail if the gist has too many files", () => {
		const tooManyFiles: GistResponse = {
			id: "some id",
			created_at: "2022-04-05T18:23:31Z",
			description: "many files",
			files: {
				//... many many files
			},
			truncated: true
		}

		expect(createPost(tooManyFiles)).rejects.toEqual(
			new Error("Gist has too many files to import")
		)
	})

	it("should fail if the gist has no files", () => {
		const noFiles: GistResponse = {
			id: "some id",
			created_at: "2022-04-05T18:23:31Z",
			description: "no files",
			files: {},
			truncated: false
		}

		expect(createPost(noFiles)).rejects.toEqual(
			new Error("The gist did not have any files")
		)
	})

	it("should create a post for the user with all the files", async () => {
		const noFiles: GistResponse = {
			id: "some id",
			created_at: "2022-04-05T18:23:31Z",
			description: "This is a gist",
			files: {
				"README.md": {
					content: "this is a readme",
					filename: "README.md",
					raw_url: "http://some.url",
					truncated: false
				}
			},
			truncated: false
		}
		const expiresAt = new Date("2022-04-25T18:23:31Z")
		const newPost = await createPost(noFiles, {
			password: "password",
			visibility: "protected",
			expiresAt
		})

		const post = await Post.findByPk(newPost.id, {
			include: [
				{ model: File, as: "files" },
				{ model: User, as: "users" }
			]
		})

		expect(post).not.toBeNull()
		expect(post!.title).toBe("This is a gist")
		expect(post!.visibility).toBe("protected")
		expect(post!.password).toBe("password")
		expect(post!.expiresAt!.getDate()).toBe(expiresAt.getDate())
		expect(post!.createdAt.getDate()).toBe(
			new Date("2022-04-05T18:23:31Z").getDate()
		)

		expect(post!.files).toHaveLength(1)
		expect(post!.files![0].title).toBe("README.md")
		expect(post!.files![0].content).toBe("this is a readme")

		expect(post!.users).toContainEqual(
			expect.objectContaining({
				PostAuthor: expect.objectContaining({ userId: aUser.id })
			})
		)
	})
})
