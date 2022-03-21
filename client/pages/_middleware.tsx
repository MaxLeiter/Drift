import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /.(.*)$/

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    const pathname = req.nextUrl.pathname
    const signedIn = req.cookies['drift-token']
    const getURL = (pageName: string) => new URL(`/${pageName}`, req.url).href
    // const isPageRequest =
    //     !PUBLIC_FILE.test(req.nextUrl.pathname) &&
    //     !req.nextUrl.pathname.startsWith('/api') &&
    //     // header added when next/link pre-fetches a route
    //     !req.headers.get('x-middleware-preflight')

    if (pathname === '/signout') {
        // If you're signed in we remove the cookie and redirect to the home page
        // If you're not signed in we redirect to the home page
        if (signedIn) {
            const resp = NextResponse.redirect(getURL(''));
            resp.clearCookie('drift-token');
            resp.clearCookie('drift-userid');

            return resp
        }
    } else if (pathname === '/') {
        if (signedIn) {
            return NextResponse.rewrite(getURL('new'))
        }
        // If you're not signed in we redirect the new post page to the home page
    } else if (pathname === '/new') {
        if (!signedIn) {
            return NextResponse.redirect(getURL(''))
        }
        // If you're signed in we redirect the sign in page to the home page (which is the new page)
    } else if (pathname === '/signin' || pathname === '/signup') {
        if (signedIn) {
            return NextResponse.redirect(getURL(''))
        }
    } else if (pathname === '/new') {
        if (!signedIn) {
            return NextResponse.redirect(getURL(''))
        }
    }

    return NextResponse.next()
}
