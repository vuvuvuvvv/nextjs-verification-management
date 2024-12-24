import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { logout } from './app/api/auth/logout/route';
import { jwtVerify } from 'jose';
import { ACCESS_LINKS } from '@lib/system-constant';

const CUSTOM_404_PATH = '/error/404';
const CUSTOM_500_PATH = '/error/500';
const CUSTOM_AUTH_ERROR_TOKEN_PATH = '/error/error-token';

const ADMIN_PATHS = ['/dashboard'];
const AUTH_PATHS = [
    ACCESS_LINKS.AUTH_FORGOT_PW.src,
    ACCESS_LINKS.AUTH_LOGIN.src,
    ACCESS_LINKS.AUTH_REGISTER.src,
    // ACCESS_LINKS.AUTH_UNVERIFIED.src,
];
const PROTECTED_PATHS = [
    ACCESS_LINKS.CHANGE_EMAIL.src,
    ACCESS_LINKS.CHANGE_PW.src,
    ACCESS_LINKS.DHN_ADD.src,
    ACCESS_LINKS.DHN_DETAIL_DH.src,
    ACCESS_LINKS.DHN_DETAIL_NDH.src,
    ACCESS_LINKS.DHN.src,
    ACCESS_LINKS.PDM.src,
    ACCESS_LINKS.PDM_ADD.src,
    ACCESS_LINKS.PDM_DETAIL.src
];

const ERROR_PATHS = [CUSTOM_404_PATH, CUSTOM_500_PATH];
const VALID_PATHS = [
    ...ADMIN_PATHS,
    ...AUTH_PATHS,
    ...PROTECTED_PATHS,
    ...ERROR_PATHS,
    ACCESS_LINKS.HOME.src
];


export async function middleware(req: NextRequest) {
    const { pathname, searchParams } = new URL(req.url);

    // const userAgent = req.headers.get('user-agent') || '';
    // console.log('User-Agent:', userAgent); // Ghi log user-agent để kiểm tra

    // const isOldBrowser =
    //     /MSIE \d|Trident.*rv:/.test(userAgent) || // Internet Explorer
    //     /(Chrome\/[0-6][0-3]|Chrome\/[0-5]\d)/.test(userAgent) || // Chrome < 64
    //     /(Edg\/[0-7][0-8]|Edg\/[0-7]\d|Edg\/[1-6]\d{2})/.test(userAgent) || // Edge < 79
    //     /(Firefox\/[0-6][0-6]|Firefox\/[0-6]\d)/.test(userAgent) || // Firefox < 67
    //     /(OPR\/[0-5][1]|OPR\/[0-5]\d|OPR\/[1-4]\d{2})/.test(userAgent) || // Opera < 51
    //     /(Version\/[0-1][2]|Version\/[0-2]\d|Version\/[1-9]\d{2})/.test(userAgent); // Safari < 12


    // if (isOldBrowser) {
    //     if (CUSTOM_UNSUPPORTED_BROWSER.includes(pathname)) {
    //         return NextResponse.next();
    //     }
    //     return NextResponse.redirect(new URL(CUSTOM_UNSUPPORTED_BROWSER, req.url));
    // }

    const refreshTokenCookie = req.cookies.get('refreshToken')?.value;
    const userCookie = req.cookies.get('user')?.value;

    const isConfirmed = (userCookie ? JSON.parse(userCookie)?.confirmed : "") == "1" ? true : false;

    if (pathname.startsWith(ACCESS_LINKS.AUTH_RESET_PW.src)) {
        const token = pathname.split(ACCESS_LINKS.AUTH_RESET_PW.src + "/")[1];
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
    const redirectUrl = new URL(ACCESS_LINKS.AUTH_LOGIN.src, req.url);
    redirectUrl.searchParams.set('redirect', pathname + searchParams.toString());

    if (!refreshTokenCookie || !userCookie) {
        if (AUTH_PATHS.includes(pathname)) {
            return NextResponse.next();
        }
        return NextResponse.redirect(redirectUrl);
    }

    // Check if refreshToken is expired
    if (refreshTokenCookie) {
        try {
            const { payload } = await jwtVerify(refreshTokenCookie, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                console.log("refreshTokenCookie")
                // logout();
                return NextResponse.redirect(redirectUrl);
            }
        } catch (error) {
            const response = NextResponse.redirect(redirectUrl);
            response.cookies.delete('accessToken');
            response.cookies.delete('refreshToken');
            response.cookies.delete('user');
            return response;
        }
    } else {
        console.log("!refreshTokenCookie")
        return NextResponse.redirect(redirectUrl);
    }

    if (AUTH_PATHS.some(authPath => pathname.includes(authPath))) {
        return NextResponse.redirect(new URL(ACCESS_LINKS.HOME.src, req.url));
    }

    if (!isConfirmed) {
        if (pathname.includes(ACCESS_LINKS.AUTH_UNVERIFIED.src) || pathname.includes(ACCESS_LINKS.AUTH_VERIFY.src)) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL(ACCESS_LINKS.AUTH_UNVERIFIED.src, req.url));
    } else {
        if (pathname.includes(ACCESS_LINKS.AUTH_UNVERIFIED.src) || pathname.includes(ACCESS_LINKS.AUTH_VERIFY.src)) {
            return NextResponse.redirect(new URL(ACCESS_LINKS.HOME.src, req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|js|css|images|favicon.ico).*)',
    ],
}