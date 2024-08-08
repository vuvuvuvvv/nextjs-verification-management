import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { logout } from './app/api/auth/logout/route';
import { jwtVerify } from 'jose';

const ADMIN_ROLE = 'ADMIN';
const CUSTOM_404_PATH = '/404'; // Đường dẫn cho trang 404 tùy chỉnh
const CUSTOM_500_PATH = '/500'; // Đường dẫn cho trang 500 tùy chỉnh
const CUSTOM_AUTH_ERROR_TOKEN_PATH = '/auth-error/error-token'; // Đường dẫn cho trang 500 tùy chỉnh

const ADMIN_PATHS = ['/dashboard'];
const AUTH_PATHS = [
    '/login',
    '/register'
];
const PROTECTED_PATHS = [
    '/change',
    '/verification/watermeter'
];

const ERROR_PATHS = [CUSTOM_404_PATH, CUSTOM_500_PATH];
const VALID_PATHS = [
    ...ADMIN_PATHS,
    ...AUTH_PATHS,
    ...PROTECTED_PATHS,
    ...ERROR_PATHS,
    "/about",
    "/"
];


export async function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get('accessToken')?.value;
    const refreshTokenCookie = req.cookies.get('refreshToken')?.value;
    const userCookie = req.cookies.get('user')?.value;
    const { pathname, searchParams } = new URL(req.url);

    if (pathname.startsWith('/reset-password')) {
        const token = pathname.split('/reset-password/')[1];
        if (token) {
            try {
                const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    return NextResponse.redirect(new URL(CUSTOM_AUTH_ERROR_TOKEN_PATH, req.url));
                }
                return NextResponse.next();
            } catch (error) {
                return NextResponse.redirect(new URL(CUSTOM_AUTH_ERROR_TOKEN_PATH, req.url));
            }
        } else {
            return NextResponse.redirect(new URL(CUSTOM_AUTH_ERROR_TOKEN_PATH, req.url));
        }
    }

    // Redirect to login if user is not logged in
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname + searchParams.toString());

    if (!tokenCookie && !refreshTokenCookie && !userCookie) {
        if (AUTH_PATHS.includes(pathname)) {
            return NextResponse.next();
        }
        // logout();
        return NextResponse.redirect(redirectUrl);
    }

    // Check if refreshToken is expired
    if (refreshTokenCookie) {
        try {
            const { payload } = await jwtVerify(refreshTokenCookie, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                logout();
                return NextResponse.redirect(redirectUrl);
            }
        } catch (error) {
            logout();
            return NextResponse.redirect(redirectUrl);
        }
    }

    try {
        const user = userCookie ? JSON.parse(userCookie) : null;
        if (ADMIN_PATHS.includes(pathname) && user?.role !== ADMIN_ROLE) {
            return NextResponse.redirect(redirectUrl);
        }

        if (AUTH_PATHS.includes(pathname)) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        if (!VALID_PATHS.some(path => pathname.includes(path) || pathname.startsWith(path))) {
            return NextResponse.redirect(new URL(CUSTOM_404_PATH, req.url));
        }

        return NextResponse.next();
    } catch (error) {
        logout();
        return NextResponse.redirect(redirectUrl);
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|js|css|images|favicon.ico).*)',
    ],
}