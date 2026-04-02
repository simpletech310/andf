"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function BrandDivider({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={cn("flex items-center justify-center py-2", className)}>
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"
        initial={{ width: 0, opacity: 0 }}
        animate={isInView ? { width: "100%", opacity: 1 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ maxWidth: "200px" }}
      />
    </div>
  );
}

// Keep backward compat export
export { BrandDivider as GoldDivider };
