import { MainLayout } from '@/components/layout';

export default function LayoutWeb({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
