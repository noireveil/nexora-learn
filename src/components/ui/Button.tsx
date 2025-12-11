import { cn } from "@/lib/utils/cn";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children?: ReactNode; 
  variant?: "primary" | "secondary" | "danger" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-primary hover:bg-indigo-600 text-white shadow-md shadow-primary/20 border border-transparent",
    accent: "bg-accent hover:bg-orange-600 text-white shadow-lg shadow-accent/30 hover:-translate-y-0.5 border border-transparent",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-primary/30 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
    ghost: "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg font-medium",
    md: "px-5 py-2.5 text-sm rounded-xl font-semibold",
    lg: "px-8 py-3.5 text-base rounded-xl font-bold",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center justify-center gap-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
};