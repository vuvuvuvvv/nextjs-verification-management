import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { jwtVerify } from 'jose';
import { ACCESS_LINKS } from '@/lib/system-constant';

const CUSTOM_AUTH_ERROR_TOKEN_PATH = '/error/error-token';

const AUTH_PATHS = [
    ACCESS_LINKS.AUTH_FORGOT_PW.src,
    ACCESS_LINKS.AUTH_LOGIN.src,
    ACCESS_LINKS.AUTH_REGISTER.src,
    ACCESS_LINKS.AUTH_VERIFY.src,
];

const VERIFY_PATHS = [
    ACCESS_LINKS.AUTH_FORGOT_PW.src,
    ACCESS_LINKS.AUTH_LOGIN.src,
    ACCESS_LINKS.AUTH_REGISTER.src,
    ACCESS_LINKS.AUTH_VERIFY.src,
];



const EXCLUDE_PATHS = [
    ACCESS_LINKS.HC_DHN.src,
    ACCESS_LINKS.PDM.src,
];

export async function middleware(req: NextRequest) {
    const { pathname, searchParams } = new URL(req.url);

    // const refreshTokenCookie = req.cookies.get('refreshToken')?.value;
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

    if (
        // !refreshTokenCookie || 
        !userCookie
    ) {
        if (AUTH_PATHS.some(authPath => pathname.includes(authPath))) {
            return NextResponse.next();
        }
        return NextResponse.redirect(redirectUrl);
    }

    // // Check if refreshToken is expired
    // if (refreshTokenCookie) {
    //     try {
    //         const { payload } = await jwtVerify(refreshTokenCookie, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));
    //         if (payload.exp && payload.exp * 1000 < Date.now()) {
    //             // logout();
    //             return NextResponse.redirect(redirectUrl);
    //         }
    //     } catch (error) {
    //         const response = NextResponse.redirect(redirectUrl);
    //         response.cookies.delete('accessToken');
    //         response.cookies.delete('refreshToken');
    //         response.cookies.delete('user');
    //         return response;
    //     }
    // } else {
    //     return NextResponse.redirect(redirectUrl);
    // }

    if (
        AUTH_PATHS.some(authPath => pathname.includes(authPath))
        || EXCLUDE_PATHS.some(authPath => pathname.includes(authPath))
    ) {
        return NextResponse.redirect(new URL(ACCESS_LINKS.HOME.src, req.url));
    }


    // TODO: Check confirmed
    if (!isConfirmed) {
        if (VERIFY_PATHS.some(vfPath => pathname.includes(vfPath))) {
            console.log("11111")
            return NextResponse.next();
        }
        console.log("22222")
        return NextResponse.redirect(new URL(ACCESS_LINKS.AUTH_UNVERIFIED.src, req.url));
    } else {
        if (pathname.includes(ACCESS_LINKS.AUTH_UNVERIFIED.src)
            || pathname.includes(ACCESS_LINKS.AUTH_VERIFY.src)
        ) {
            console.log("3333")
            return NextResponse.redirect(new URL(ACCESS_LINKS.HOME.src, req.url));
        }
        console.log("4444")
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|js|css|images|favicon.ico).*)',
    ],
}