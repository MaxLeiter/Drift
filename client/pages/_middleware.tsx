import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest, event: NextFetchEvent) {
	const pathname = req.nextUrl.pathname
	const signedIn = req.cookies["drift-token"]
	const getURL = (pageName: string) => new URL(`/${pageName}`, req.url).href
	const isPageRequest =
		!PUBLIC_FILE.test(pathname) &&
		!pathname.startsWith("/api") &&
		// header added when next/link pre-fetches a route
		!req.headers.get("x-middleware-preflight")

	if (!req.headers.get("x-middleware-preflight") && pathname === "/signout") {
		// If you're signed in we remove the cookie and redirect to the home page
		// If you're not signed in we redirect to the home page
		if (signedIn) {
			const resp = NextResponse.redirect(getURL(""))
			resp.clearCookie("drift-token")
			resp.clearCookie("drift-userid")
			const signoutPromise = new Promise((resolve) => {
				fetch(`${process.env.API_URL}/auth/signout`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${signedIn}`,
						"x-secret-key": process.env.SECRET_KEY || ""
					}
				}).then(() => {
					resolve(true)
				})
			})
			event.waitUntil(signoutPromise)

			return resp
		}
	} else if (isPageRequest) {
		if (signedIn) {
			if (
				pathname === "/" ||
				pathname === "/signin" ||
				pathname === "/signup"
			) {
				return NextResponse.redirect(getURL("new"))
			}
		} else if (!signedIn) {
			if (pathname === "/new") {
				return NextResponse.redirect(getURL("signin"))
			}
		}

		if (pathname.includes("/protected/") || pathname.includes("/private/")) {
			const urlWithoutVisibility = pathname.replace("/protected/", "/").replace("/private/", "/").substring(1)
			return NextResponse.redirect(getURL(urlWithoutVisibility))
		}
	}

	return NextResponse.next()
}
