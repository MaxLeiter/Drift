import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /.(.*)$/

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    const pathname = req.nextUrl.pathname
    // const isPageRequest =
    //     !PUBLIC_FILE.test(req.nextUrl.pathname) &&
    //     !req.nextUrl.pathname.startsWith('/api') &&
    //     // header added when next/link pre-fetches a route
    //     !req.headers.get('x-middleware-preflight')

    // If you're signed in we replace the home page with the new post page
    if (pathname === '/') {
        if (req.cookies['drift-token']) {
            return NextResponse.rewrite(new URL(`/new`, req.url).href)
        }
        // If you're not signed in we redirect the new post page to the home page
    } else if (pathname === '/new') {
        if (!req.cookies['drift-token']) {
            return NextResponse.redirect(new URL(`/`, req.url).href)
        }
        // If you're signed in we redirect the sign in page to the home page (which is the new page)
    } else if (pathname === '/signin') {
        if (req.cookies['drift-token']) {
            return NextResponse.redirect(new URL(`/`, req.url).href)
        }
    }

    return NextResponse.next()
}
