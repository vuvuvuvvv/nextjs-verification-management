import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { LoginCredentials } from '@lib/types';
import { login } from '../auth/login/route';

const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                if (!credentials) {
                    return null;
                }
                // Implement your own login logic here
                const user = await login(credentials as LoginCredentials);
                if (user) {
                    return user;
                } else {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user = {
                    ...session.user,
                    id: token.id as string | null,
                    role: token.role as string | undefined
                } as { name?: string | null; email?: string | null; image?: string | null; id?: string | null; role?: string | undefined };
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
        signOut: '/logout',
    },
    secret: process.env.JWT_SECRET_KEY,
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.JWT_SECRET_KEY,
    }
};
export default NextAuth(options);