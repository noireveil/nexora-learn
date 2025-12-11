import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'neutral';
  className?: string;
}

export const Badge = ({ children, variant = 'primary', className }: BadgeProps) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/10 text-success-700 border-success/20",
    warning: "bg-warning/10 text-warning-700 border-warning/20",
    neutral: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
};