'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { LayoutDashboard, Map, UserCircle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/schema';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  const user = useLiveQuery(() => db.users.orderBy('lastLogin').last());
  const isLandingOrOnboarding = pathname === '/' || pathname === '/onboarding';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const NavItem = ({ href, icon: Icon, label }: any) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
      )}>
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md hidden md:block">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="relative w-32 h-8 md:w-72 md:h-16"> 
             <Image 
               src="/logo.png" 
               alt="Nexora Learn Logo" 
               fill
               className="object-contain object-left" 
               priority
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
             />
          </div>
        </Link>

        {isMounted && !isLandingOrOnboarding && user && user.startingLevel && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
            <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem href="/learn" icon={Map} label="Learning Paths" />
            <NavItem href="/profile" icon={UserCircle} label="Profile" />
          </div>
        )}
      </div>
    </nav>
  );
};