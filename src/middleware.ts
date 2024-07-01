import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { logout, refreshJWT } from './app/api/auth/route';

export async function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get('accessToken');

    console.log(req.nextUrl.pathname, (req.nextUrl.pathname === '/login'));

    if (req.nextUrl.pathname == '/login' || req.nextUrl.pathname == '/register') {
        if (!tokenCookie) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(`${req.nextUrl.origin}/`);
        }
    } else {
        if (!tokenCookie) {
            console.error("Token cookie is undefined");
            return NextResponse.redirect(`${req.nextUrl.origin}/login`);
        }

        try {
            const { payload } = await jwtVerify(tokenCookie.value, new TextEncoder().encode(process.env.JWT_SECRET_KEY));
            const user = payload?.sub as unknown as { [key: string]: any }; // Lấy thông tin người dùng từ sub
            const role = user?.['role']; // Giả sử role được lưu trong payload

            if (!user || typeof user !== 'object' || !('username' in user)) {
                console.error("User information is missing or invalid");
                return NextResponse.redirect(`${req.nextUrl.origin}/login`);
            }

            console.log('User:', user, user['username']);

            // Kiểm tra role của user
            if (!role || (role !== 'ADMIN' && req.nextUrl.pathname.startsWith('/admin'))) {
                console.error("User role is missing or unauthorized");
                return NextResponse.redirect(`${req.nextUrl.origin}/`);
            }

            // Thực hiện các hành động khác với thông tin người dùng
            return NextResponse.next();
        } catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'ERR_JWT_EXPIRED') {
                // console.error("JWT has expired:", error);
                const new_jwt = await refreshJWT();
                if (new_jwt) {
                    console.log("okeeeyyy let's go!")
                    return NextResponse.next();
                }
            } 
            logout();
            return NextResponse.redirect(`${req.nextUrl.origin}/login`);
        }
    }
}

export const config = {
    matcher: ['/', '/admin', "/login", "/register"], // Apply middleware to all routes
};