'use client';

import { Routes } from '@/constants/routes';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/modules/auth';
import { Role } from '@/modules/user';
import { AdminLayout } from '@/components/layout';
import { useEffect } from 'react';

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && (!user || user.role !== Role.Admin)) {
      router.push(Routes.Discover);
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
