import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import RegisterPageClient from './RegisterPageClient';

export default async function RegisterPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/register');
  }

  return <RegisterPageClient />;
}
