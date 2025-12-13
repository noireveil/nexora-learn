'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { LayoutDashboard, Map, UserCircle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/schema';
import { useEffect, useState } from 'react';

export const BottomNav = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  const user = useLiveQuery(() => db.users.orderBy('lastLogin').last());
  const isHiddenPage = pathname === '/' || pathname === '/onboarding' || pathname.startsWith('/challenge/');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isHiddenPage || !user || !user.startingLevel) return null;

  const NavItem = ({ href, icon: Icon, label }: any) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className="flex-1 flex flex-col items-center justify-center py-2 transition-all active:scale-95">
        <div className={cn(
          "p-1.5 rounded-xl transition-colors mb-1",
          isActive ? "bg-primary/10 text-primary" : "text-slate-400"
        )}>
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className={cn(
          "text-[10px] font-medium transition-colors",
          isActive ? "text-primary" : "text-slate-400"
        )}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-200 md:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Home" />
        <NavItem href="/learn" icon={Map} label="Learn" />
        <NavItem href="/profile" icon={UserCircle} label="Profile" />
      </div>
    </nav>
  );
};