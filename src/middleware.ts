import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getMe } from '@api/auth/get-me/route';

const LOGIN_URL = '/login';
const REGISTER_URL = '/register';
const HOME_URL = '/';
const ADMIN_URL_PREFIX = '/admin';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();
    const user = await getMe();
    if (user) {
        
        // if(response.status == 200 && 'data' in response) {
        //     return response.data;
        // } else {
        //     return null;
        // }

        if (pathname.startsWith(ADMIN_URL_PREFIX) && user.data.user.role !== 'ADMIN') {
            return NextResponse.redirect(new URL(LOGIN_URL, request.url));
        }

        if ([LOGIN_URL, REGISTER_URL].includes(pathname)) {
            return NextResponse.redirect(new URL(HOME_URL, request.url));
        }

        return response;
    } else {
        if ([LOGIN_URL, REGISTER_URL].includes(pathname)) {
            return response;
        }
        return NextResponse.redirect(new URL(LOGIN_URL, request.url));
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|js|css|images|favicon.ico).*)',
        // '/admin'
    ],
};