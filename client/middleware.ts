import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
	async function middleware(req) {
		const token = await getToken({ req })
		const isAuth = !!token
		const isAuthPage =
			req.nextUrl.pathname.startsWith("/signup") ||
			req.nextUrl.pathname.startsWith("/signin")

		if (isAuthPage) {
			if (isAuth) {
				return NextResponse.redirect(new URL("/new", req.url))
			}

			return null
		}

		if (!isAuth) {
			return NextResponse.redirect(new URL("/signin", req.url))
		}
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
	match: [
		// "/signout",
		// "/",
		"/signin",
		"/signup",
		"/new",
		"/private/:path*"
	]
}
