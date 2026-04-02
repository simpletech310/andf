"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Heart,
  Share2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Ticket,
  Star,
  Music,
  Cpu,
  Target,
  GraduationCap,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { BrandDivider } from "@/components/shared/brand-divider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

/* ─── Icon & Color Mappings ──────────────────────────────────────── */

const programIconMap: Record<string, React.ElementType> = {
  "band-camp": Music,
  "drone-experience": Cpu,
  "topgolf": Target,
  "hbcu-heroes": GraduationCap,
  "mentorship": Users,
  "mentors": MessageCircle,
  "sisters-hangout": Heart,
};

const programColorMap: Record<string, string> = {
  "band-camp": "from-violet-500 to-purple-600",
  "drone-experience": "from-cyan-500 to-blue-600",
  "topgolf": "from-emerald-500 to-green-600",
  "hbcu-heroes": "from-primary-500 to-primary-700",
  "mentorship": "from-amber-500 to-orange-600",
  "mentors": "from-red-500 to-rose-600",
  "sisters-hangout": "from-pink-500 to-rose-600",
};

const defaultImage = "/images/gallery/fnf-group-lineup.jpg";

/* ─── Types ──────────────────────────────────────────────────────── */

interface Program {
  title: string;
  slug: string;
  icon: string | null;
  color: string | null;
}

interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

interface DBEvent {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  short_description: string | null;
  event_type: "in_person" | "virtual" | "hybrid";
  status: "draft" | "published" | "cancelled" | "completed";
  program_id: string | null;
  start_date: string;
  end_date: string | null;
  location_name: string | null;
  location_address: string | null;
  max_capacity: number | null;
  current_registrations: number;
  ticket_price: number | null;
  cover_image_url: string | null;
  gallery_urls: string[] | null;
  video_url: string | null;
  is_featured: boolean;
  highlights: string[] | null;
  schedule: ScheduleItem[] | null;
  what_to_expect: string | null;
  programs: Program | null;
}

/* ─── Helpers ────────────────────────────────────────────────────── */

function formatEventDate(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };

  if (endDate) {
    const end = new Date(endDate);
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.toLocaleDateString("en-US", { month: "long" })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}`;
  }
  return start.toLocaleDateString("en-US", opts);
}

function formatEventTime(startDate: string, endDate: string | null): string {
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true };
  const start = new Date(startDate);
  const startTime = start.toLocaleTimeString("en-US", timeOpts);

  if (endDate) {
    const end = new Date(endDate);
    const endTime = end.toLocaleTimeString("en-US", timeOpts);
    return `${startTime} - ${endTime}`;
  }
  return startTime;
}

function formatEventType(type: string): string {
  switch (type) {
    case "in_person": return "In Person";
    case "virtual": return "Virtual";
    case "hybrid": return "Hybrid";
    default: return type;
  }
}

/* ─── Countdown Timer ────────────────────────────────────────────── */

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const blocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="flex gap-3">
      {blocks.map((b) => (
        <div key={b.label} className="text-center">
          <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <span className="text-xl md:text-2xl font-display font-bold text-white">
              {String(b.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-white/70 mt-1 block">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Lightbox ───────────────────────────────────────────────────── */

function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-10" aria-label="Close">
        <X className="h-8 w-8" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 md:left-8 text-white/70 hover:text-white p-2 z-10" aria-label="Previous">
        <ChevronLeft className="h-10 w-10" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 md:right-8 text-white/70 hover:text-white p-2 z-10" aria-label="Next">
        <ChevronRight className="h-10 w-10" />
      </button>
      <motion.div
        key={currentIndex}
        className="relative w-[90vw] h-[70vh] max-w-5xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={images[currentIndex].src} alt={images[currentIndex].alt} fill className="object-contain" sizes="90vw" priority />
      </motion.div>
      <div className="absolute bottom-6 text-white/60 text-sm">{currentIndex + 1} / {images.length}</div>
    </motion.div>
  );
}

/* ─── Loading Skeleton ───────────────────────────────────────────── */

function DetailSkeleton() {
  return (
    <div className="pb-0 animate-pulse">
      <div className="h-[400px] bg-neutral-200" />
      <div className="px-6 py-16">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-6 bg-neutral-200 rounded w-1/3" />
            <div className="h-8 bg-neutral-200 rounded w-2/3" />
            <div className="space-y-3">
              <div className="h-4 bg-neutral-100 rounded w-full" />
              <div className="h-4 bg-neutral-100 rounded w-full" />
              <div className="h-4 bg-neutral-100 rounded w-3/4" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-neutral-100 h-80" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<DBEvent | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<DBEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("events")
        .select("*, programs(title, slug, icon, color)")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setEvent(data as DBEvent);

      // Fetch related events from same program
      if (data.program_id) {
        const { data: related } = await supabase
          .from("events")
          .select("*, programs(title, slug, icon, color)")
          .eq("program_id", data.program_id)
          .in("status", ["published", "completed"])
          .neq("id", id)
          .order("start_date", { ascending: true })
          .limit(3);

        if (related) {
          setRelatedEvents(related as DBEvent[]);
        }
      }

      setLoading(false);
    }
    fetchEvent();
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (notFound || !event) {
    return (
      <div className="pt-32 pb-24 px-6 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground">Event Not Found</h1>
        <p className="text-foreground-muted mt-2">The event you are looking for does not exist or has been removed.</p>
        <Link href="/events" className="text-primary-500 mt-4 inline-block font-medium hover:underline">Back to Events</Link>
      </div>
    );
  }

  // Derived display values
  const programSlug = event.programs?.slug || "";
  const ProgramIcon = programIconMap[programSlug] || Calendar;
  const programName = event.programs?.title || "General";
  const displayDate = formatEventDate(event.start_date, event.end_date);
  const displayTime = formatEventTime(event.start_date, event.end_date);
  const displayLocation = event.location_name || (event.event_type === "virtual" ? "Virtual Event" : "TBD");
  const displayType = formatEventType(event.event_type);
  const displayPrice = event.ticket_price && event.ticket_price > 0 ? `$${event.ticket_price}` : "Free";
  const heroImage = event.cover_image_url || defaultImage;
  const description = event.short_description || event.description || "";
  const fullDescription = event.description || "";
  const capacity = event.max_capacity || 0;
  const registered = event.current_registrations || 0;
  const spotsLeft = Math.max(0, capacity - registered);
  const percentFull = capacity > 0 ? (registered / capacity) * 100 : 0;
  const isUpcoming = event.status !== "completed";

  // Build gallery from gallery_urls + cover image
  const galleryImages: { src: string; alt: string }[] = [];
  if (event.gallery_urls && event.gallery_urls.length > 0) {
    event.gallery_urls.forEach((url, i) => {
      if (url) galleryImages.push({ src: url, alt: `${event.title} - Photo ${i + 1}` });
    });
  }
  if (galleryImages.length === 0 && heroImage !== defaultImage) {
    galleryImages.push({ src: heroImage, alt: event.title });
  }

  const eventHighlights = event.highlights?.filter((h) => h.trim()) || [];
  const eventSchedule = event.schedule?.filter((s) => s.time || s.title) || [];
  const whatToExpect = event.what_to_expect || "";

  return (
    <div className="pb-0">
      {/* -- Hero with full-bleed event image -- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={event.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-24 lg:py-32">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> All Events
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="gold" className="bg-secondary-500/90 text-white border-none">
                <ProgramIcon className="h-3 w-3" /> {programName}
              </Badge>
              <Badge variant="info" className="bg-white/20 text-white border-white/30">
                {displayType}
              </Badge>
              {displayPrice === "Free" ? (
                <Badge variant="success" className="bg-green-500/80 text-white border-none">Free</Badge>
              ) : (
                <Badge variant="info" className="bg-white/20 text-white border-white/30">
                  <Ticket className="h-3 w-3" /> {displayPrice}
                </Badge>
              )}
            </div>

            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white">
              {event.title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">{description}</p>

            {/* Quick info pills */}
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-secondary-400" /> {displayDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-secondary-400" /> {displayTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-secondary-400" /> {displayLocation}
              </span>
            </div>

            {/* Countdown */}
            {isUpcoming && (
              <div className="pt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3">Event starts in</p>
                <CountdownTimer targetDate={event.start_date} />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* -- Main content + sidebar -- */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left -- main content */}
          <div className="lg:col-span-2 space-y-16">
            {/* What to Expect */}
            {(whatToExpect || fullDescription) && (
              <SectionWrapper>
                <div className="space-y-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
                    About the event
                  </span>
                  <h2 className="text-3xl font-display font-bold text-foreground">
                    What to Expect
                  </h2>
                  {(whatToExpect || fullDescription).split("\n\n").map((p, i) => (
                    <p key={i} className="text-foreground-muted leading-relaxed text-lg">{p}</p>
                  ))}
                </div>
              </SectionWrapper>
            )}

            {/* Highlights */}
            {eventHighlights.length > 0 && (
              <SectionWrapper>
                <div className="space-y-5">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Event Highlights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {eventHighlights.map((highlight, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-3 p-4 rounded-xl bg-secondary-50 border border-secondary-100"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <CheckCircle2 className="h-5 w-5 text-secondary-500 shrink-0 mt-0.5" />
                        <span className="text-foreground-muted">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </SectionWrapper>
            )}

            {/* Schedule */}
            {eventSchedule.length > 0 && (
              <SectionWrapper>
                <div className="space-y-5">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Event Schedule
                  </h2>
                  <div className="relative space-y-0">
                    {/* Timeline line */}
                    <div className="absolute left-[23px] top-3 bottom-3 w-px bg-primary-200" />

                    {eventSchedule.map((item, i) => (
                      <motion.div
                        key={i}
                        className="relative flex gap-4 py-4"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                      >
                        {/* Timeline dot */}
                        <div className="relative z-10 h-[14px] w-[14px] mt-1.5 rounded-full bg-primary-500 border-[3px] border-primary-100 shrink-0 ml-[17px]" />

                        <div className="flex-1 -mt-0.5">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full w-fit">
                              {item.time}
                            </span>
                            <h4 className="font-semibold text-foreground">{item.title}</h4>
                          </div>
                          {item.description && (
                            <p className="text-sm text-foreground-muted mt-1 ml-0 sm:ml-0">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </SectionWrapper>
            )}

            {/* Event details card */}
            <SectionWrapper>
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Event Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Calendar, label: "Date", value: displayDate },
                    { icon: Clock, label: "Time", value: displayTime },
                    { icon: MapPin, label: "Location", value: displayLocation },
                    { icon: Users, label: "Capacity", value: capacity > 0 ? `${capacity} attendees` : "Unlimited" },
                    { icon: DollarSign, label: "Price", value: displayPrice === "Free" ? "Free Admission" : displayPrice },
                    { icon: Ticket, label: "Type", value: displayType },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      className="flex items-start gap-3 p-4 rounded-xl bg-primary-50/50 border border-primary-100"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <item.icon className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-primary-500 uppercase tracking-wider">{item.label}</div>
                        <div className="text-sm text-foreground-muted mt-0.5">{item.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </SectionWrapper>

            {/* Gallery -- only if we have a cover image */}
            {galleryImages.length > 0 && (
              <SectionWrapper>
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Event Gallery
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {galleryImages.map((photo, i) => (
                      <motion.div
                        key={photo.src}
                        className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                          galleryImages.length === 1 ? "col-span-2 aspect-[2/1]" :
                          i === 0 && galleryImages.length >= 3 ? "col-span-2 aspect-[2/1]" : "aspect-[4/3]"
                        }`}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => setLightboxIndex(i)}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes={i === 0 ? "700px" : "350px"}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </SectionWrapper>
            )}
          </div>

          {/* Right -- sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Event info card */}
              <motion.div
                className="rounded-2xl bg-background-card border border-border p-6 space-y-5 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-display font-semibold text-foreground text-lg">Event Info</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-foreground-muted">
                    <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{displayDate}</div>
                      <div className="text-xs text-foreground-subtle">{displayTime}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-foreground-muted">
                    <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{displayLocation}</div>
                      <div className="text-xs text-foreground-subtle">{displayType}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-foreground-muted">
                    <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <DollarSign className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {displayPrice === "Free" ? "Free Admission" : displayPrice}
                      </div>
                      <div className="text-xs text-foreground-subtle">All materials included</div>
                    </div>
                  </div>
                </div>

                <BrandDivider className="!my-4" />

                {/* Capacity bar */}
                {capacity > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        <Users className="h-4 w-4 inline mr-1 text-primary-500" />
                        {spotsLeft} spots left
                      </span>
                      <span className="text-xs text-foreground-subtle">
                        {registered}/{capacity}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-background-elevated overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          percentFull > 80 ? "bg-secondary-500" : "bg-primary-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentFull}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    {percentFull > 75 && (
                      <p className="text-xs text-secondary-600 mt-1.5 font-medium">
                        Filling up fast — register soon!
                      </p>
                    )}
                  </div>
                )}

                {isUpcoming && (
                  <Link href={`/events/${id}/register`} className="block">
                    <Button variant="primary" className="w-full" size="lg">
                      <Ticket className="h-4 w-4" />
                      Register Now
                    </Button>
                  </Link>
                )}

                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1" size="sm">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Link href="/donate" className="flex-1">
                    <Button variant="secondary" className="w-full" size="sm">
                      <Heart className="h-4 w-4" /> Donate
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Related program link */}
              {programSlug && (
                <Link href={`/programs/${programSlug}`}>
                  <div className="rounded-2xl bg-primary-50 border border-primary-100 p-5 hover:border-primary-200 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
                        <ProgramIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-primary-500 font-semibold uppercase tracking-wider">
                          Part of
                        </p>
                        <p className="font-medium text-foreground group-hover:text-primary-600 transition-colors">
                          {programName} Program
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* -- More Events -- */}
      {relatedEvents.length > 0 && (
        <section className="bg-primary-50/50 py-16 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
                Don&apos;t miss out
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground mt-2">
                More Upcoming Events
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedEvents.map((rel) => {
                const relSlug = rel.programs?.slug || "";
                const RelIcon = programIconMap[relSlug] || Calendar;
                const relImage = rel.cover_image_url || defaultImage;
                const relDate = formatEventDate(rel.start_date, rel.end_date);
                const relLocation = rel.location_name || (rel.event_type === "virtual" ? "Virtual Event" : "TBD");
                const relPrice = rel.ticket_price && rel.ticket_price > 0 ? `$${rel.ticket_price}` : "Free";
                const relProgram = rel.programs?.title || "General";

                return (
                  <Link key={rel.id} href={`/events/${rel.id}`}>
                    <motion.div
                      className="group relative overflow-hidden rounded-2xl bg-white border border-border hover:border-primary-200 hover:shadow-lg transition-all"
                      whileHover={{ y: -4 }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relImage}
                          alt={rel.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="500px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex gap-2">
                          <Badge variant="gold" className="bg-secondary-500/90 text-white border-none text-[10px]">
                            <RelIcon className="h-3 w-3" /> {relProgram}
                          </Badge>
                          {relPrice === "Free" && (
                            <Badge variant="success" className="bg-green-500/80 text-white border-none text-[10px]">
                              Free
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="p-5 space-y-2">
                        <h3 className="font-display font-bold text-foreground text-lg group-hover:text-primary-600 transition-colors">
                          {rel.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-foreground-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-primary-500" /> {relDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-primary-500" /> {relLocation}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* -- CTA -- */}
      <section className="bg-secondary-500 py-16 px-6 text-center">
        <div className="mx-auto max-w-2xl space-y-5">
          <h2 className="font-display text-3xl font-bold text-white">
            Ready to Join Us?
          </h2>
          <p className="text-white/90 text-lg">
            Secure your spot at {event.title} and be part of something special.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {isUpcoming && (
              <Link href={`/events/${id}/register`}>
                <Button variant="primary" size="lg" className="bg-white text-secondary-600 hover:bg-white/90">
                  <Ticket className="h-4 w-4" /> Register Now
                </Button>
              </Link>
            )}
            <Link href="/events">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryImages.length > 0 && (
          <Lightbox
            images={galleryImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((p) => (p !== null ? (p - 1 + galleryImages.length) % galleryImages.length : 0))}
            onNext={() => setLightboxIndex((p) => (p !== null ? (p + 1) % galleryImages.length : 0))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
