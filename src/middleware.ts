import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getMe } from './app/api/auth/get-me/route';

export async function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get('accessToken')?.value;

    const allCookies = req.cookies.getAll()
    console.log("all cookie: ", allCookies);

    if (!tokenCookie) {
        return NextResponse.redirect(`${req.nextUrl.origin}/login`);
    } else {
        // try {

        //     if (response.status === 200) {
        //         console.log("a")
        //         const user = response.user;

        //         // if (req.nextUrl.pathname.startsWith('/admin') && user.role !== 'ADMIN') {
        //         //     return NextResponse.redirect(req.nextUrl.origin);   // to "/"
        //         // }
        //         return NextResponse.next();
        //     } else {
        //         console.log("b")
        //         // Handle case when the getMe request fails (non-200 status code)
        //         return NextResponse.redirect(`${req.nextUrl.origin}/login`);
        //     }
        // } catch (error) {
        //     console.log("c")
        //     // Handle any other errors
        //     console.error('Error fetching user data:', error);
        //     return NextResponse.redirect(`${req.nextUrl.origin}/login`);
        // }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/', '/about', '/admin'],
}
