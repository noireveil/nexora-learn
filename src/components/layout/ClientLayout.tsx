'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { cn } from '@/lib/utils/cn';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  const isFullScreenPage = pathname === '/' || pathname === '/onboarding';
  const isChallengePage = pathname.startsWith('/challenge/');

  return (
    <>
      {!isFullScreenPage && !isChallengePage && <Navbar />}

      <main className={cn(
        "min-h-screen", 
        !isFullScreenPage && !isChallengePage && "md:pt-24 pb-24 md:pb-0"
      )}>
        {children}
      </main>

      {/* Bottom Nav juga disembunyikan di Challenge Page agar fokus coding */}
      {!isFullScreenPage && !isChallengePage && <BottomNav />}
    </>
  );
};