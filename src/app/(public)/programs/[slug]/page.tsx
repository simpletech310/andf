"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PROGRAMS_BY_SLUG } from "@/lib/programs";
import { getBuiltInEvents } from "@/lib/featured-events";
import { YouTubeCard } from "@/components/shared/youtube-card";
import {
  ArrowLeft, ArrowRight, Calendar, MapPin, Users, Heart, Music, Cpu,
  Target, GraduationCap, MessageCircle, Play, X, ChevronLeft, ChevronRight,
  CheckCircle2, Star, Zap, Camera, Award, BookOpen, Rocket, Globe, Sparkles,
  Loader2,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { BrandDivider } from "@/components/shared/brand-divider";
import { Button } from "@/components/ui/button";



/* ─── Icon map ─────────────────────────────────────────────── */

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Music, Cpu, Target, Users, GraduationCap, Heart, MessageCircle,
  Star, Zap, Camera, Award, BookOpen, Rocket, Globe, Sparkles, Play,
};

/* ─── Hardcoded fallback data ──────────────────────────────── */



// Program content comes from the official site (src/lib/programs.ts).
const fallbackData: Record<string, any> = PROGRAMS_BY_SLUG;

/* ─── Lightbox ─────────────────────────────────────────────── */

function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: {
  images: string[]; currentIndex: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  return (
    <motion.div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-10" aria-label="Close"><X className="h-8 w-8" /></button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 md:left-8 text-white/70 hover:text-white p-2 z-10" aria-label="Previous"><ChevronLeft className="h-10 w-10" /></button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 md:right-8 text-white/70 hover:text-white p-2 z-10" aria-label="Next"><ChevronRight className="h-10 w-10" /></button>
      <motion.div key={currentIndex} className="relative w-[90vw] h-[70vh] max-w-5xl" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
        <Image src={images[currentIndex]} alt={`Gallery image ${currentIndex + 1}`} fill className="object-contain" sizes="90vw" priority />
      </motion.div>
      <div className="absolute bottom-6 text-white/60 text-sm">{currentIndex + 1} / {images.length}</div>
    </motion.div>
  );
}

/* ─── Video Section ────────────────────────────────────────── */

function VideoSection({ videoTitle, youtubeId }: { videoTitle?: string; youtubeId?: string }) {
  // Only real program footage from the ANDF YouTube channel; no section when there is none.
  if (!youtubeId) return null;
  return (
    <SectionWrapper className="py-16 px-6">
      <div className="mx-auto max-w-5xl">
        <YouTubeCard id={youtubeId} title={videoTitle || "Watch the Highlights"} tag="From A New Day Now" large />
      </div>
    </SectionWrapper>
  );
}

/* ─── Gallery Section ──────────────────────────────────────── */

function GallerySection({ gallery, programTitle }: { gallery: string[]; programTitle: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  if (!gallery || gallery.length === 0) return null;

  return (
    <>
      <SectionWrapper className="py-16 px-6 bg-primary-50/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Moments that matter</span>
            <h2 className="font-display text-3xl font-bold text-foreground mt-2">{programTitle} in Pictures</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {gallery.map((url, i) => {
              const isLarge = i === 0 || i === 3;
              return (
                <motion.div key={url} className={`relative overflow-hidden rounded-xl cursor-pointer group ${isLarge ? "row-span-2 aspect-[3/4]" : "aspect-[4/3]"}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} onClick={() => setLightboxIndex(i)}>
                  <Image src={url} alt={`${programTitle} photo ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={gallery}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex(prev => prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0)}
            onNext={() => setLightboxIndex(prev => prev !== null ? (prev + 1) % gallery.length : 0)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */

export default function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const program: any = fallbackData[slug] ?? null;
  const events = getBuiltInEvents()
    .filter((e) => e.programs?.slug === slug && e.status === "published")
    .map((e) => ({
      id: e.id,
      title: e.title,
      location: e.location_name,
      date: new Date(e.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" }),
    }));

  if (!program) {
    return (
      <div className="pt-32 pb-24 px-6 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground">Program Not Found</h1>
        <Link href="/programs" className="text-primary-500 mt-4 inline-block">Back to Programs</Link>
      </div>
    );
  }

  const Icon = ICON_MAP[program.icon] || Music;
  const color = program.color || "from-primary-500 to-primary-700";
  const features: string[] = program.features || [];
  const outcomes: { stat: string; label: string }[] = program.outcomes || [];
  const gallery: string[] = program.gallery_urls || [];
  const upcomingEvents = events.length > 0 ? events : [];

  return (
    <div className="pb-0">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {program.hero_image_url ? (
          <div className="absolute inset-0">
            <Image src={program.hero_image_url} alt={program.title} fill className="object-cover" sizes="100vw" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90`} />
        )}

        <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-36">
          <Link href="/programs" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> All Programs
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex items-center gap-4">
              {program.logo_url ? (
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm shrink-0 border border-white/10">
                  <Image src={program.logo_url} alt={`${program.title} logo`} fill className="object-contain p-1" sizes="64px" />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <Icon className="h-7 w-7 text-white" />
                </div>
              )}
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-400">{program.tagline}</span>
            </div>
            <h1 className="font-display text-5xl lg:text-7xl font-bold text-white">{program.title}</h1>
            <p className="text-xl text-white/80 max-w-2xl">{program.description}</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href={`/programs/${slug}/apply`}>
                <Button variant="primary" size="lg"><ArrowRight className="h-4 w-4" /> Apply Now</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10"><Heart className="h-4 w-4" /> Get Involved</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Impact Stats Bar ── */}
      {outcomes.length > 0 && (
        <section className="bg-primary-600 py-8 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {outcomes.map((outcome) => (
                <motion.div key={outcome.label} className="text-center" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="text-3xl md:text-4xl font-display font-bold text-white">{outcome.stat}</div>
                  <div className="text-sm text-primary-100 mt-1">{outcome.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Video ── */}
      <VideoSection videoTitle={program.video_title} youtubeId={program.youtube_id} />

      {/* ── About + Features ── */}
      <SectionWrapper className="py-20 px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">About the program</span>
            <h2 className="font-display text-3xl font-bold text-foreground">What Makes {program.title} Special</h2>
            {(program.long_description || program.description || "").split("\n\n").map((p: string, i: number) => (
              <p key={i} className="text-foreground-muted leading-relaxed text-lg">{p}</p>
            ))}
          </div>
          {features.length > 0 && (
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-background-card border border-border p-6 space-y-5 sticky top-28">
                <h3 className="font-display font-semibold text-foreground text-lg">What&apos;s Included</h3>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-foreground-muted">
                      <CheckCircle2 className="h-5 w-5 text-accent-500 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <BrandDivider className="!my-4" />
                <Link href={`/programs/${slug}/apply`} className="block">
                  <Button variant="primary" className="w-full">Apply Now <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* ── Photo Gallery ── */}
      <GallerySection gallery={gallery} programTitle={program.title} />

      {/* ── Upcoming Events ── */}
      {upcomingEvents.length > 0 && (
        <SectionWrapper className="py-16 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Mark your calendar</span>
              <h2 className="font-display text-3xl font-bold text-foreground mt-2">Upcoming Events</h2>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event: any) => (
                <motion.div key={event.id || event.title} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-background-card border border-border hover:border-primary-200 hover:shadow-md transition-all" whileHover={{ y: -2 }}>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-lg">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-foreground-muted">
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary-500" /> {event.date}</span>
                      {event.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary-500" /> {event.location}</span>}
                    </div>
                  </div>
                  <Link href={`/events/${event.id}/register`} className="mt-3 sm:mt-0">
                    <Button variant="outline" size="sm">RSVP <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* ── CTA ── */}
      <section className="bg-secondary-500 py-20 px-6 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">Ready to Make a Difference?</h2>
          <p className="text-white/90 text-lg">Join {program.title} and be part of something transformative.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/contact"><Button variant="primary" size="lg" className="bg-white text-secondary-600 hover:bg-white/90">Get Started</Button></Link>
            <Link href="/donate"><Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10"><Heart className="h-4 w-4" /> Donate</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
