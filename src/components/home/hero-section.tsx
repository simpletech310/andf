"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
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

const DEFAULTS = {
  title_line1: "Every young person",
  title_line2: "deserves a new day.",
  subtitle:
    "Founded in 2017 by Grammy Award-winning artist Dawnn Lewis, A New Day Foundation gives teens ages 13–19 the mentors, experiences, and skills to build the future they want.",
  background_image: "/images/experiences/fnf-2025.jpg",
  cta1_text: "Partner with us",
  cta1_link: "/sponsor",
  cta2_text: "Donate",
  cta2_link: "/donate",
};

export function HeroSection({ cms }: { cms?: HeroContent }) {
  const c = { ...DEFAULTS, ...cms };
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-primary-900">
      <div className="absolute inset-0">
        <Image
          src={c.background_image}
          alt="Students, parents, and mentors gathered at Focused N F.I.T. For A Different World, 2025"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%]"
        />
        {/* Night-to-sunrise wash: dark where the type sits, warm at the horizon */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/70 to-primary-900/10" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_15%_100%,rgba(240,125,26,0.35),transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 pt-40 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-3xl">
          <motion.h1
            className="font-display font-bold text-white text-4xl leading-[1.08] sm:text-6xl lg:text-7xl tracking-tight"
            {...rise(0.1)}
          >
            {c.title_line1}
            <br />
            {c.title_line2}
            {c.title_line3 ? (
              <>
                <br />
                {c.title_line3}
              </>
            ) : null}
          </motion.h1>

          <motion.p className="mt-6 max-w-[38rem] text-lg sm:text-xl text-white/85 leading-relaxed" {...rise(0.3)}>
            {c.subtitle}
          </motion.p>

          <motion.div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4" {...rise(0.45)}>
            <Link href={c.cta1_link}>
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary-800 hover:bg-primary-50">
                {c.cta1_text}
              </Button>
            </Link>
            <Link href={c.cta2_link}>
              <Button size="lg" variant="donate" className="w-full sm:w-auto">
                <Heart className="h-4 w-4" />
                {c.cta2_text}
              </Button>
            </Link>
          </motion.div>
        </div>

        <p className="mt-14 text-xs text-white/55 sm:text-right">Focused N F.I.T. For A Different World, 2025</p>
      </div>
    </section>
  );
}
