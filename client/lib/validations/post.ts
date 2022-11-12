import { z } from "zod"

export const CreatePostSchema = z.object({
	title: z.string(),
	description: z.string(),
	files: z.array(z.object({
		title: z.string(),
		content: z.string(),
	})),
	visibility: z.string(),
	password: z.string().optional(),
	expiresAt: z.number().optional().nullish(),
	parentId: z.string().optional()
})

export const DeletePostSchema = z.object({
	id: z.string()
})
