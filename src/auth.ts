import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './lib/db';

// Resolve the lazy Prisma instance once — PrismaAdapter needs a real client, not a getter.
const prismaClient = (prisma as () => import('@prisma/client').PrismaClient)();

export const { handlers, auth, signOut } = NextAuth({
  adapter: PrismaAdapter(prismaClient),
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

export const { handlers, auth, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === 'production',
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
        params: { prompt: 'consent', access_type: 'offline', response_type: 'code' },
      },
      token: 'https://oauth2.googleapis.com/token',
      userinfo: 'https://openidconnect.googleapis.com/v1/userinfo',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Only allow Google OAuth — this is the sole customer sign-in method.
      if (account?.provider !== 'google') return false;
      if (!user.email) return false;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: string }).role ?? 'USER';
        token.accountStatus = (user as { accountStatus?: string }).accountStatus ?? 'ACTIVE';
        token.requiresPasswordChange = (user as { requiresPasswordChange?: boolean }).requiresPasswordChange ?? false;
        token.tokenVersion = (user as { tokenVersion?: number }).tokenVersion ?? 1;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as 'USER' | 'ADMIN') ?? 'USER';
        session.user.accountStatus = (token.accountStatus as 'ACTIVE' | 'SUSPENDED') ?? 'ACTIVE';
        session.user.requiresPasswordChange = (token.requiresPasswordChange as boolean) ?? false;
        session.user.tokenVersion = (token.tokenVersion as number) ?? 1;
      }
      return session;
    },
  },
});
