import config from "@lib/config"
import { NextRequest } from "next/server"

export const getRequiresPasscode = async () => {
	const requiresPasscode = Boolean(config.registration_password)
	return requiresPasscode
}

export default async function GET(req: NextRequest) {
	const searchParams = new URL(req.nextUrl).searchParams
	const slug = searchParams.get("slug")

	if (!slug || Array.isArray(slug)) {
		return new Response(null, {
			status: 400,
			statusText: "Bad request"
		})
	}

	if (slug === "requires-passcode") {
		// return res.json({ requiresPasscode: await getRequiresPasscode() })
		return new Response(
			JSON.stringify({ requiresPasscode: await getRequiresPasscode() }),
			{
				status: 200,
				statusText: "OK",
				headers: {
					"Content-Type": "application/json"
				}
			}
		)
	}

	return new Response(JSON.stringify({ error: "Not found" }), {
		status: 404,
		statusText: "Not found",
		headers: {
			"Content-Type": "application/json"
		}
	})
}
