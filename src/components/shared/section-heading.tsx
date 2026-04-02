"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  gradient?: boolean;
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
  gradient = false,
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" && "mx-auto text-center",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {label && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
          {label}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
          gradient ? "text-brand-gradient" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-lg text-foreground-muted leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
