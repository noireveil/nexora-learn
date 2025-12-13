'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { cn } from '@/lib/utils/cn';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  const isFullScreenPage = pathname === '/' || pathname === '/onboarding' || pathname.startsWith('/challenge/');

  return (
    <>
      {!isFullScreenPage && <Navbar />}
      
      <main className={cn("min-h-screen", !isFullScreenPage && "pt-24")}>
        {children}
      </main>
    </>
  );
};