'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Cpu, LayoutDashboard, Map, UserCircle } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();

  const NavItem = ({ href, icon: Icon, label }: any) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm",
        isActive 
          ? "bg-primary/20 text-primary border border-primary/20" 
          : "text-text-muted hover:text-white hover:bg-white/5"
      )}>
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
            <Cpu size={20} className="text-white" />
          </div>
          Nexora<span className="text-primary">Learn</span>
        </Link>

        <div className="flex items-center gap-2">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/learn" icon={Map} label="Learning Paths" />
          <NavItem href="/profile" icon={UserCircle} label="Profile" />
        </div>
      </div>
    </nav>
  );
};
