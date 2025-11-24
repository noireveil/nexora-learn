import { cn } from "@/lib/utils/cn";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children?: ReactNode; 
  variant?: "primary" | "secondary" | "danger" | "ghost";
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
    primary:
      "bg-primary hover:bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-500/50",
    secondary:
      "bg-surfaceHighlight hover:bg-slate-700 text-text-main border border-slate-600",
    danger:
      "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50",
    ghost: "bg-transparent hover:bg-white/5 text-text-muted hover:text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-5 py-2.5 text-base rounded-xl",
    lg: "px-6 py-3 text-lg rounded-xl",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "font-medium flex items-center justify-center gap-2 transition-all duration-200",
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