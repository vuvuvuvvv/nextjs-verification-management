// import NextAuth, { AuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import axios from 'axios';
// import { User } from '@lib/types';

// const NEXT_API_URL = process.env.NEXT_API_URL

// const handler = NextAuth({
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 username: { label: 'Tên đăng nhập', type: 'text' },
//                 password: { label: 'Mật khẩu', type: 'password' }
//             },
//             async authorize(credentials) {
//                 try {
//                     const user = await axios.post(`${NEXT_API_URL}/auth/login`, {
//                         username: credentials?.username,
//                         password: credentials?.password
//                     }, { withCredentials: true });

//                     if (user.data) {
//                         return user.data;
//                     } else {
//                         return null;
//                     }
//                 } catch (error) {
//                     return null;
//                 }
//             }
//         })
//     ],
//     jwt: {
//         secret: process.env.JWT_SECRET_KEY,
//         maxAge: 30 * 60
//     },
//     session: {
//         strategy: 'jwt',
//         maxAge: 30 * 60,
//         updateAge: 5 * 60,
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 const userData = user as unknown as User;
//                 token.id = userData.id;
//                 token.email = userData.email;
//                 token.role = userData.role;
//             }

//             try {
//                 const response = await axios.get(`${NEXT_API_URL}/auth/me`, {
//                     withCredentials: true
//                 });
//                 if (!response.data) {
//                     throw new Error('User not found');
//                 }
//             } catch (error) {
//                 throw error;
//             }

//             console.log("TOKEN: " + token);
//             return token;
//         },
//         async session({ session, token }) {
//             if (token) {
//                 session.user = {
//                     id: token.id,
//                     email: token.email,
//                     role: token.role
//                 } as User;
//             }
//             console.log("SESSION: " + session);
//             return session;
//         }
//     }
// });

// export { handler as GET, handler as POST };