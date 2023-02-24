import { parseQueryParam } from "@lib/server/parse-query-param"
import { notFound } from "next/navigation"
import { NextResponse } from "next/server"
import { prisma } from "src/lib/server/prisma"

export async function GET(
	req: Request,
	{
		params
	}: {
		params: {
			fileId: string
		}
	}
) {
	console.log("GET /api/file/raw/[fileId]/route.ts")
	const id = params.fileId
	const download = new URL(req.url).searchParams.get("download") === "true"

	if (!id) {
		return notFound()
	}

	const file = await prisma.file.findUnique({
		where: {
			id: parseQueryParam(id)
		}
	})

	if (!file) {
		return notFound()
	}

	const { title, content: contentBuffer } = file
	const content = contentBuffer.toString("utf-8")

	console.log("title", title)
	let headers: HeadersInit = {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "s-maxage=86400"
	}

	if (download) {
		headers = {
			...headers,
			"Content-Disposition": `attachment; filename="${title}"`
		}
	} else {
		headers = {
			...headers,
			"Content-Disposition": `inline; filename="${title}"`
		}
	}

	// TODO: we need to return the raw content for this to work. not currently implemented in next.js
	return NextResponse.json(
		{ data: content },
		{
			headers
		}
	)
}
