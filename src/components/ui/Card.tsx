import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

export const Card = ({ children, className, glow = false }: { children: React.ReactNode, className?: string, glow?: boolean }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/5 bg-surface/50 backdrop-blur-xl p-6",
        glow && "shadow-[0_0_40px_-10px_rgba(99,102,241,0.15)]",
        className
      )}
    >
      {/* Aesthetic Noise Texture optional */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
