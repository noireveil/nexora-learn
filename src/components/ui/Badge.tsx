import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning';
  className?: string;
}

export const Badge = ({ children, variant = 'primary', className }: BadgeProps) => {
  const variants = {
    primary: "bg-primary/10 border-primary/20 text-primary",
    success: "bg-green-500/10 border-green-500/20 text-green-500",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
  };

  return (
    <div className={cn(
      "inline-block px-4 py-1.5 rounded-full border text-sm font-medium backdrop-blur-sm",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
};