import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './lib/db';

// Extend the session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'USER' | 'ADMIN';
      accountStatus: 'ACTIVE' | 'SUSPENDED';
      requiresPasswordChange: boolean;
      tokenVersion: number;
    };
  }

  interface User {
    role?: 'USER' | 'ADMIN';
    accountStatus?: 'ACTIVE' | 'SUSPENDED';
    requiresPasswordChange?: boolean;
    tokenVersion?: number;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || 'dummy_id',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || 'dummy_secret',
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || user.role !== 'ADMIN') return null;
        if (!user.passwordHash) return null;

        if (user.accountStatus === 'SUSPENDED') return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!isValid) return null;

        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 24 hours
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as 'USER' | 'ADMIN') || 'USER';
        session.user.accountStatus = (token.accountStatus as 'ACTIVE' | 'SUSPENDED') || 'ACTIVE';
        session.user.requiresPasswordChange = token.requiresPasswordChange as boolean || false;
        session.user.tokenVersion = (token.tokenVersion as number) || 1;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accountStatus = user.accountStatus;
        token.requiresPasswordChange = user.requiresPasswordChange;
        token.tokenVersion = user.tokenVersion;
      }
      return token;
    },
  },
});
