import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

const PAGES_REQUIRE_AUTH = ["/new", "/settings", "/mine", "/admin"]

export default withAuth(
	async function middleware(req) {
		const token = await getToken({ req })

		const isAuthed = !!token
		const isAuthPage =
			req.nextUrl.pathname.startsWith("/signup") ||
			req.nextUrl.pathname.startsWith("/signin")

		const isPageRequireAuth = PAGES_REQUIRE_AUTH.includes(req.nextUrl.pathname)

		if (isAuthPage) {
			if (isAuthed) {
				return NextResponse.redirect(new URL("/new", req.url))
			}

			return null
		} else if (isPageRequireAuth && !isAuthed) {
			return NextResponse.redirect(new URL("/signin", req.url))
		}

		return NextResponse.next()
	},
	{
		callbacks: {
			async authorized() {
				// This is a work-around for handling redirect on auth pages.
				// We return true here so that the middleware function above
				// is always called.
				return true
			}
		}
	}
)

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)"
	]
}
