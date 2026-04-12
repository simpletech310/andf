"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroContent {
  label?: string;
  title_line1?: string;
  title_line2?: string;
  title_line3?: string;
  subtitle?: string;
  background_image?: string;
  cta1_text?: string;
  cta1_link?: string;
  cta2_text?: string;
  cta2_link?: string;
}

const DEFAULTS: HeroContent = {
  label: "Empowering Youth Since Day One",
  title_line1: "Building",
  title_line2: "Tomorrow's",
  title_line3: "Leaders",
  subtitle: "A New Day Foundation creates transformative experiences for young people through music, technology, mentorship, and community — shaping the future, one life at a time.",
  background_image: "/images/hero/community-group.jpg",
  cta1_text: "Explore Programs",
  cta1_link: "/programs",
  cta2_text: "Make a Donation",
  cta2_link: "/donate",
};

export function HeroSection({ cms }: { cms?: HeroContent }) {
  const c = { ...DEFAULTS, ...cms };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src={c.background_image!}
          alt="A New Day Foundation community"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white" />
      </div>

      {/* Content — pushed down to clear navbar */}
      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Label */}
          <motion.span
            className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 bg-primary-50 border border-primary-200 rounded-full px-6 py-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {c.label}
          </motion.span>

          {/* Main heading */}
          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <span className="text-neutral-900">{c.title_line1}</span>
            <br />
            <span className="text-brand-gradient">{c.title_line2}</span>
            <br />
            <span className="text-neutral-900">{c.title_line3}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto max-w-2xl text-lg sm:text-xl text-neutral-600 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {c.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link href={c.cta1_link!}>
              <Button size="lg" variant="outline" className="group border-primary-500/80 text-primary-700 hover:bg-primary-500 hover:text-white">
                {c.cta1_text}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href={c.cta2_link!}>
              <Button size="lg" variant="donate" className="group">
                <Heart className="h-4 w-4" />
                {c.cta2_text}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator — arrow only */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-primary-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
