import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import * as z from "zod"
import type { ZodSchema, ZodType } from "zod"

type NextApiRequestWithParsedBody<T> = NextApiRequest & {
	parsedBody?: T
}

export type NextApiHandlerWithParsedBody<T> = (
	req: NextApiRequestWithParsedBody<T>,
	res: NextApiResponse
) => ReturnType<NextApiHandler>

export function withValidation<T extends ZodSchema>(
	schema: T,
	handler: NextApiHandler
): (
	req: NextApiRequest,
	res: NextApiResponse
) => Promise<void | NextApiResponse<any> | NextApiHandlerWithParsedBody<T>> {
	return async function (req: NextApiRequest, res: NextApiResponse) {
		try {
			const body = req.body

			await schema.parseAsync(body)

			;(req as NextApiRequestWithParsedBody<T>).parsedBody = body

			return handler(req, res) as Promise<NextApiHandlerWithParsedBody<T>>
		} catch (error) {
			if (process.env.NODE_ENV === "development") {
				console.error(error)
			}
			if (error instanceof z.ZodError) {
				return res.status(422).json(error.issues)
			}

			return res.status(422).end()
		}
	}
}
