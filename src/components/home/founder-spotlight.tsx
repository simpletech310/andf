"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DAWNN_CREDITS } from "@/lib/impact";

/**
 * The homepage's one bold moment: Dawnn Lewis, framed like a playbill.
 * Midnight band, a sunrise rising behind her portrait (the "new day" in the logo),
 * and her credits set like a cast list.
 */
export function FounderSpotlight() {
  const reduce = useReducedMotion();

  return (
    <section id="founder" className="relative overflow-hidden bg-primary-900 text-white">
      {/* Sunrise */}
      <div
        aria-hidden
        className="absolute left-1/2 lg:left-[28%] -translate-x-1/2 bottom-[-38rem] h-[64rem] w-[64rem] rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.55)_0%,rgba(240,125,26,0.28)_28%,rgba(26,115,212,0.12)_52%,transparent_68%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
        {/* Portrait */}
        <motion.div
          className="lg:col-span-5 flex justify-center"
          initial={reduce ? undefined : { opacity: 0, y: 40 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <figure className="relative w-full max-w-[26rem]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[13rem] rounded-b-md ring-1 ring-white/15 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <Image
                src="/images/team/dawnn-lewis.jpg"
                alt="Dawnn Lewis, founder and president of A New Day Foundation"
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover object-[50%_20%]"
              />
            </div>
            <figcaption className="mt-5 flex items-baseline justify-between gap-4 text-sm">
              <span className="font-display font-semibold text-lg text-white">Dawnn Lewis</span>
              <span className="text-white/60">Founder &amp; President</span>
            </figcaption>
          </figure>
        </motion.div>

        {/* Story */}
        <div className="lg:col-span-7">
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] tracking-[-0.01em] max-w-[16ch]">
            From A Different World to a new day for young people.
          </h2>

          <div className="mt-8 space-y-5 text-lg text-white/80 leading-relaxed max-w-[40rem]">
            <p>
              Millions know Dawnn Lewis as Jaleesa Vinson on <em>A Different World</em>. She is also a Grammy
              Award-winning singer, an ASCAP and BMI Award-winning songwriter, and a composer and series
              creator. In 2017 she turned decades of service and advocacy into A New Day Foundation.
            </p>
            <p>
              When Dawnn calls, people show up. Her <em>A New Day: Concert for a Cause</em> has brought together
              more than 40 artists, civic leaders, and performers, from Patrice Rushen and Doug E. Fresh to
              Congresswoman Maxine Waters, to fund community organizations. ANDF puts that reach to work for
              young people.
            </p>
          </div>

          {/* Credits, set like a cast list */}
          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 border-t border-white/15">
            {DAWNN_CREDITS.map((c) => (
              <div key={c.role} className="py-4 border-b border-white/15">
                <dt className="font-medium text-white">{c.role}</dt>
                <dd className="text-sm text-white/55 mt-0.5">{c.detail}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/sponsor">
              <Button size="lg" variant="donate" className="w-full sm:w-auto">
                Partner with Dawnn
              </Button>
            </Link>
            <Link href="/about#founder">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                Read her full story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
