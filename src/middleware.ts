import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getMe } from './app/api/auth/get-me/route';
import { logout } from './app/api/auth/logout/route';

const ADMIN_ROLE = 'ADMIN';
const CUSTOM_404_PATH = '/404'; // Đường dẫn cho trang 404 tùy chỉnh
const CUSTOM_500_PATH = '/500'; // Đường dẫn cho trang 500 tùy chỉnh

const ADMIN_PATHS = ['/admin'];
const UNPROTECTED_PATHS = [
    '/login',
    '/register'
];
const PROTECTED_PATHS = [
    '/reset/email',
    '/reset/password',
    '/kiem-dinh/dong-ho-nuoc'
];

const ERROR_PATHS = [CUSTOM_404_PATH, CUSTOM_500_PATH];
const VALID_PATHS = [
    ...ADMIN_PATHS,
    ...UNPROTECTED_PATHS,
    ...PROTECTED_PATHS,
    ...ERROR_PATHS,
    "/about",
    "/"
];


export async function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get('accessToken')?.value;
    const refreshTokenCookie = req.cookies.get('refreshToken')?.value;
    const userCookie = req.cookies.get('user')?.value;
    const { pathname } = req.nextUrl;

    if(!tokenCookie && !refreshTokenCookie && !userCookie) {
        if (UNPROTECTED_PATHS.includes(pathname)) {
            return NextResponse.next();
        }
        logout();
    }

    try {
        const user = userCookie ? JSON.parse(userCookie) : null;
        if (ADMIN_PATHS.includes(pathname) && user?.role !== ADMIN_ROLE) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        if (UNPROTECTED_PATHS.includes(pathname)) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        if (!VALID_PATHS.includes(pathname)) {
            return NextResponse.redirect(new URL(CUSTOM_404_PATH, req.url));
        }

        return NextResponse.next();
    } catch (error) {
        logout();
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|js|css|images|favicon.ico).*)',
    ],
}