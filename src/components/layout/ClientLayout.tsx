'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { cn } from '@/lib/utils/cn';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  // Halaman di mana Navbar TIDAK boleh muncul
  // Kita masukkan '/' (Landing) dan '/onboarding' agar fokus
  const isFullScreenPage = pathname === '/' || pathname === '/onboarding';

  return (
    <>
      {/* Navbar hanya muncul jika BUKAN di halaman Landing/Onboarding */}
      {!isFullScreenPage && <Navbar />}
      
      {/* Logika Padding:
          - Jika Landing Page: Tidak ada padding top (konten mulai dari paling atas)
          - Jika Halaman Lain (Dashboard dll): Tambah pt-24 agar konten tidak ketutupan Navbar 
      */}
      <main className={cn("min-h-screen", !isFullScreenPage && "pt-24")}>
        {children}
      </main>
    </>
  );
};