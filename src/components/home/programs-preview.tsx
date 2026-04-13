"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Music, Cpu, Target, Users, GraduationCap, Heart,
  MessageCircle, Star, Zap, Camera, Award, BookOpen, Rocket, Globe, Sparkles, Play,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import Image from "next/image";

/* ─── Icon map for DB icon strings ──────────────────────────────── */

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Music, Cpu, Target, Users, GraduationCap, Heart, MessageCircle,
  Star, Zap, Camera, Award, BookOpen, Rocket, Globe, Sparkles, Play,
};

/* ─── Color to Tailwind icon bg/text mapping ─────────────────────── */

const COLOR_ICON_MAP: Record<string, { bg: string; text: string }> = {
  "from-violet-500 to-purple-600": { bg: "bg-violet-100", text: "text-violet-600" },
  "from-cyan-500 to-blue-600": { bg: "bg-cyan-100", text: "text-cyan-600" },
  "from-emerald-500 to-green-600": { bg: "bg-emerald-100", text: "text-emerald-600" },
  "from-red-500 to-rose-600": { bg: "bg-red-100", text: "text-red-600" },
  "from-rose-700 to-red-900": { bg: "bg-rose-100", text: "text-rose-600" },
  "from-amber-500 to-orange-600": { bg: "bg-amber-100", text: "text-amber-600" },
  "from-primary-500 to-primary-700": { bg: "bg-primary-100", text: "text-primary-600" },
};

const DEFAULT_ICON_STYLE = { bg: "bg-primary-100", text: "text-primary-600" };

export function ProgramsPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/api/programs");
        if (!res.ok) return;
        const data = await res.json();
        if (data.programs?.length > 0) {
          setPrograms(data.programs);
        }
      } catch {
        // Keep empty — section won't render if no programs
      }
    }
    fetchPrograms();
  }, []);

  if (programs.length === 0) return null;

  return (
    <SectionWrapper className="py-24 lg:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="What We Do"
          title="Programs That Transform Lives"
          description="From music to technology, mentorship to community engagement — our programs create lasting impact."
        />

        <div ref={ref} className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => {
            const Icon = ICON_MAP[program.icon] || Music;
            const iconStyle = COLOR_ICON_MAP[program.color] || DEFAULT_ICON_STYLE;

            return (
              <motion.div
                key={program.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={`/programs/${program.slug}`} className="block group">
                  <div className="relative h-full p-6 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 transition-all duration-500 hover:shadow-lg">
                    <div className="space-y-4">
                      {program.logo_url ? (
                        <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-neutral-100">
                          <Image src={program.logo_url} alt={`${program.title} logo`} fill className="object-contain p-1" sizes="56px" />
                        </div>
                      ) : (
                        <div className={`h-12 w-12 rounded-xl ${iconStyle.bg} flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${iconStyle.text}`} />
                        </div>
                      )}

                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                          {program.title}
                        </h3>
                        <p className="text-sm text-secondary-500 mt-1">{program.tagline}</p>
                      </div>

                      <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
                        {program.description}
                      </p>

                      <div className="flex items-center text-sm font-medium text-primary-500 group-hover:text-primary-600">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/programs">
            <Button variant="outline" size="lg">
              View All Programs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
