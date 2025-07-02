'use client';

import { Routes } from '@/constants/routes';
import { redirect } from '@/i18n/navigation';
import { useAuthStore } from '@/modules/auth';
import { Role } from '@/modules/user';
import { AdminLayout } from '@/components/layout';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  // const user = useAuthStore((state) => state.user);
  // const { locale } = useParams<{ locale: string }>();

  // useEffect(() => {
  //   if (user?.role !== Role.Admin) {
  //     return redirect({ href: Routes.Discover, locale });
  //   }
  // }, [locale, user?.role]);

  return <AdminLayout>{children}</AdminLayout>;
}
