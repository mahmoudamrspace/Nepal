'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <SessionProvider>
      {isLoginPage ? (
        <>{children}</>
      ) : (
        <AdminLayout>{children}</AdminLayout>
      )}
    </SessionProvider>
  );
}

