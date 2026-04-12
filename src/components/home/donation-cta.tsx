"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationCTAContent {
  label?: string;
  title?: string;
  description?: string;
  amounts?: { value: number; label: string }[];
  cta_text?: string;
  cta_link?: string;
  cta2_text?: string;
  cta2_link?: string;
}

const DEFAULTS: DonationCTAContent = {
  label: "Make an Impact",
  title: "Every Donation Creates\nA New Day",
  description: "Your generosity directly funds programs that change young lives. From instruments for Band Camp to drones for STEM workshops — every dollar makes a difference.",
  amounts: [
    { value: 25, label: "Supplies" },
    { value: 50, label: "Mentoring" },
    { value: 100, label: "Full Day" },
  ],
  cta_text: "Donate Now",
  cta_link: "/donate",
  cta2_text: "See Our Impact",
  cta2_link: "/programs",
};

export function DonationCTA({ cms }: { cms?: DonationCTAContent }) {
  const c = { ...DEFAULTS, ...cms };
  const amounts = c.amounts || DEFAULTS.amounts!;
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 lg:py-32 px-6 relative overflow-hidden bg-secondary-500">
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />

      <motion.div
        className="mx-auto max-w-4xl text-center relative"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-white/80 mb-6">
          {c.label}
        </span>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight whitespace-pre-line">
          {c.title}
        </h2>

        <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
          {c.description}
        </p>

        <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {amounts.map((amount) => (
            <motion.div
              key={amount.value}
              className="p-4 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-center hover:bg-white/25 transition-all cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="text-2xl font-display font-bold text-white">${amount.value}</div>
              <div className="text-xs text-white/70 mt-1">{amount.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={c.cta_link!}>
            <Button size="lg" variant="primary" className="text-lg px-10">
              <Heart className="h-5 w-5" />
              {c.cta_text}
            </Button>
          </Link>
          <Link href={c.cta2_link!}>
            <Button size="lg" variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10">
              {c.cta2_text}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
