import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { encode } from '@auth/core/jwt';

// Derive a stable MongoDB ObjectId from the admin username.
function adminObjectId(username: string): string {
  return crypto
    .createHash('sha256')
    .update(`admin:${username}`)
    .digest('hex')
    .substring(0, 24);
}

// Admin authentication uses server-side JWT — not NextAuth's
// CSRF-protected callback. The browser never sees the password hash,
// and the response is a Set-Cookie containing only the signed JWT.
//
// This is intentionally a SEPARATE endpoint from the customer
// NextAuth flow — Google OAuth cannot authenticate admin users,
// and admin credentials cannot authenticate customer users.
export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const username = (body.username ?? '').toString().trim();
  const password = (body.password ?? '').toString();

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 }
    );
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const plaintextPassword =
    process.env.NODE_ENV !== 'production'
      ? process.env.ADMIN_PASSWORD
      : undefined;

  if (!expectedUsername || (!expectedPasswordHash && !plaintextPassword)) {
    return NextResponse.json(
      { error: 'Admin authentication is not configured' },
      { status: 500 }
    );
  }

  if (username !== expectedUsername) {
    // Generic error to avoid leaking which field is wrong.
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  let passwordOk = false;
  if (expectedPasswordHash) {
    passwordOk = await bcrypt.compare(password, expectedPasswordHash);
  }
  if (!passwordOk && plaintextPassword) {
    passwordOk = password === plaintextPassword;
  }
  if (!passwordOk) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const adminEmail = `${expectedUsername}@admin.local`;
  const adminId = adminObjectId(expectedUsername);

  // Best-effort upsert — ignored if DB unreachable; JWT still works.
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
    // non-fatal
  }

  // Mint a JWT compatible with Auth.js v5 cookie format.
  const maxAge = 60 * 60 * 24;
  const sessionToken = await encode({
    token: {
      sub: adminId,
      name: 'Administrator',
      email: adminEmail,
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
      requiresPasswordChange: false,
      tokenVersion: 1,
      authMethod: 'CREDENTIALS',
    },
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '',
    maxAge,
    salt: 'authjs.session-token',
  });

  const cookieName =
    process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token';

  const response = NextResponse.json({
    ok: true,
    user: {
      id: adminId,
      email: adminEmail,
      name: 'Administrator',
      role: 'ADMIN',
      authMethod: 'CREDENTIALS',
    },
  });

  response.cookies.set(cookieName, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });

  return response;
}