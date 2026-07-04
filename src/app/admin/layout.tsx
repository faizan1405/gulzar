import React from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-pathname') || '';

  // Login page must be accessible without a session — render it bare (no sidebar).
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const session = await auth();

  // In production a genuine ADMIN session is required.
  const isAdmin = session?.user?.role === 'ADMIN';

  if (!isAdmin) {
    redirect('/admin/login');
  }

  // Check if they need to change their password
  if (session?.user?.requiresPasswordChange && pathname !== '/admin/change-password') {
    redirect('/admin/change-password');
  }

  if (!session?.user?.requiresPasswordChange && pathname === '/admin/change-password') {
    redirect('/admin');
  }

  // Do not render AdminLayoutClient wrapper if they are on change-password
  if (pathname === '/admin/change-password') {
    return <>{children}</>;
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
