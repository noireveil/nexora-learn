import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

export const Card = ({ children, className, glow = false }: { children: React.ReactNode, className?: string, glow?: boolean }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden",
        glow && "hover:shadow-md hover:border-primary/40 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
};