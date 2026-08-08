import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from './lib/db';

// Type augmentation for custom session/User fields
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
      authMethod?: 'GOOGLE' | 'CREDENTIALS';
    };
  }

  interface User {
    role?: 'USER' | 'ADMIN';
    accountStatus?: 'ACTIVE' | 'SUSPENDED';
    requiresPasswordChange?: boolean;
    tokenVersion?: number;
    authMethod?: 'GOOGLE' | 'CREDENTIALS';
  }
}

// Derive a stable MongoDB ObjectId from the admin username so the same
// user row is reused across logins (avoids creating duplicates).
function adminObjectId(username: string): string {
  return crypto.createHash('sha256').update(`admin:${username}`).digest('hex').substring(0, 24);
}

export const { handlers, auth, signOut } = NextAuth({
  // Credentials provider requires JWT sessions (no DB persistence).
  // Google continues to use the PrismaAdapter for its own user/account rows.
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === 'production',
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 },
  providers: [
    // ─────────────────────────────────────────────────────────────
    // CUSTOMER AUTH — Google OAuth
    // A Google account can never become an admin. Admin access is
    // reserved for the Credentials provider below.
    // ─────────────────────────────────────────────────────────────
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    // ─────────────────────────────────────────────────────────────
    // ADMIN AUTH — Username + Password (independent of Google)
    // Credentials live in environment variables; the browser never
    // sees the password hash. The lookup happens server-side and
    // returns an admin user only when username + bcrypt match.
    // The admin identity is stored in the JWT — no DB row required.
    // ─────────────────────────────────────────────────────────────
    Credentials({
      id: 'admin-credentials',
      name: 'AdminCredentials',
      // Admin auth uses JWT sessions only — no CSRF token required.
      skipCSRFCheck: true,
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(rawCredentials) {
        const username = (rawCredentials?.username ?? '').toString().trim();
        const password = (rawCredentials?.password ?? '').toString();

        if (!username || !password) return null;

        const expectedUsername = process.env.ADMIN_USERNAME;
        const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        // Allow plaintext ADMIN_PASSWORD in development only.
        const plaintextPassword =
          process.env.NODE_ENV !== 'production'
            ? process.env.ADMIN_PASSWORD
            : undefined;

        if (!expectedUsername || (!expectedPasswordHash && !plaintextPassword)) {
          return null;
        }

        if (username !== expectedUsername) return null;

        let passwordOk = false;
        if (expectedPasswordHash) {
          passwordOk = await bcrypt.compare(password, expectedPasswordHash);
        }
        if (!passwordOk && plaintextPassword) {
          passwordOk = password === plaintextPassword;
        }
        if (!passwordOk) return null;

        // Return a stable admin identity stored in the JWT.
        // The id is a deterministic ObjectId so Prisma tokenVersion
        // lookups (used by proxy.ts to invalidate stale sessions)
        // can find the corresponding admin User row.
        const adminEmail = `${expectedUsername}@admin.local`;
        const adminId = adminObjectId(expectedUsername);

        // Best-effort upsert — ignored if the DB is unreachable; the
        // JWT still carries the role/admin claims and grants access.
        try {
          await prisma.user.upsert({
            where: { id: adminId },
            update: { role: 'ADMIN', accountStatus: 'ACTIVE' },
            create: {
              id: adminId,
              email: adminEmail,
              name: 'Administrator',
              role: 'ADMIN',
              accountStatus: 'ACTIVE',
              tokenVersion: 1,
            },
          });
        } catch {
          // Swallow DB errors — admin auth still works without a row.
        }

        return {
          id: adminId,
          email: adminEmail,
          name: 'Administrator',
          role: 'ADMIN',
          accountStatus: 'ACTIVE',
          requiresPasswordChange: false,
          tokenVersion: 1,
          authMethod: 'CREDENTIALS',
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Google sign-ins must never produce admin sessions.
      if (account?.provider === 'google') {
        if (user && (user as { role?: string }).role === 'ADMIN') {
          (user as { role?: string }).role = 'USER';
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: string }).role ?? 'USER';
        token.accountStatus = (user as { accountStatus?: string }).accountStatus ?? 'ACTIVE';
        token.requiresPasswordChange =
          (user as { requiresPasswordChange?: boolean }).requiresPasswordChange ?? false;
        token.tokenVersion = (user as { tokenVersion?: number }).tokenVersion ?? 1;
        token.authMethod =
          (user as { authMethod?: 'GOOGLE' | 'CREDENTIALS' }).authMethod ??
          (account?.provider === 'credentials' ? 'CREDENTIALS' : 'GOOGLE');
      }
      // On refresh: if the session was created via Google, force USER role.
      if (token.authMethod === 'GOOGLE' && token.role === 'ADMIN') {
        token.role = 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        const authMethod =
          (token.authMethod as 'GOOGLE' | 'CREDENTIALS' | undefined) ?? 'GOOGLE';
        // Customers are never admins — even if a stale token says so.
        const role =
          authMethod === 'CREDENTIALS'
            ? ((token.role as 'USER' | 'ADMIN') ?? 'USER')
            : 'USER';
        session.user.role = role;
        session.user.accountStatus = (token.accountStatus as 'ACTIVE' | 'SUSPENDED') ?? 'ACTIVE';
        session.user.requiresPasswordChange = (token.requiresPasswordChange as boolean) ?? false;
        session.user.tokenVersion = (token.tokenVersion as number) ?? 1;
        session.user.authMethod = authMethod;
      }
      return session;
    },
  },
});