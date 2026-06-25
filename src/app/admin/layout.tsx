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
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  // In demo deployments every visitor may open the admin showcase.
  // In production a genuine ADMIN session is required.
  const isAdmin = session?.user?.role === 'ADMIN' || isDemoMode;

  if (!isAdmin) {
    redirect('/admin/login');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
