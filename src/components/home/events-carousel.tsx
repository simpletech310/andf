"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

/* ─── Types ───────────────────────────────────────────────────────── */

interface Program {
  title: string;
  slug: string;
  icon: string | null;
  color: string | null;
}

interface DBEvent {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  event_type: "in_person" | "virtual" | "hybrid";
  status: string;
  start_date: string;
  end_date: string | null;
  location_name: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  programs: Program | null;
}

/* ─── Color accent mapping by program slug ────────────────────────── */

const accentMap: Record<string, string> = {
  "band-camp": "border-l-violet-500",
  "drone-experience": "border-l-cyan-500",
  "topgolf": "border-l-emerald-500",
  "hbcu-heroes": "border-l-gold-500",
  "mentorship": "border-l-amber-500",
  "mentors": "border-l-red-500",
  "sisters-hangout": "border-l-pink-500",
};

const defaultAccent = "border-l-primary-500";
const defaultImage = "/images/gallery/fnf-group-lineup.jpg";

/* ─── Helpers ─────────────────────────────────────────────────────── */

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

/* ─── Skeleton ────────────────────────────────────────────────────── */

function EventCardSkeleton() {
  return (
    <div className="h-full flex flex-col rounded-2xl bg-white border border-neutral-200 border-l-4 border-l-neutral-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-neutral-200" />
      <div className="flex-1 p-6 space-y-3">
        <div className="h-5 bg-neutral-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-neutral-100 rounded w-1/2" />
          <div className="h-3 bg-neutral-100 rounded w-1/3" />
          <div className="h-3 bg-neutral-100 rounded w-2/5" />
        </div>
        <div className="h-4 bg-neutral-100 rounded w-full" />
      </div>
    </div>
  );
}

/* ─── Component ───────────────────────────────────────────────────── */

export function EventsCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("events")
        .select("*, programs(title, slug, icon, color)")
        .eq("status", "published")
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true })
        .limit(3);

      if (!error && data) {
        setEvents(data as DBEvent[]);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <SectionWrapper className="py-24 lg:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="Upcoming Events"
          title="Join the Movement"
          description="Experience transformative events that connect, inspire, and empower. Reserve your spot today."
        />

        <div ref={ref} className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {loading && Array.from({ length: 3 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}

          {!loading && events.map((event, i) => {
            const programSlug = event.programs?.slug || "";
            const accent = accentMap[programSlug] || defaultAccent;
            const image = event.cover_image_url || defaultImage;
            const date = formatEventDate(event.start_date, event.end_date);
            const time = formatEventTime(event.start_date, event.end_date);
            const location = event.location_name || (event.event_type === "virtual" ? "Virtual Event" : "TBD");
            const type = formatEventType(event.event_type);
            const description = event.short_description || event.description || "";
            const status = event.is_featured ? "Registration Open" : "Coming Soon";

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Link href={`/events/${event.id}`} className="block group h-full">
                  <div className={`h-full flex flex-col rounded-2xl bg-white border border-neutral-200 border-l-4 ${accent} group-hover:shadow-lg transition-all duration-500 overflow-hidden`}>
                    {/* Event flyer image */}
                    <div className="relative h-48 bg-neutral-100 overflow-hidden">
                      <Image
                        src={image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant={status === "Registration Open" ? "success" : "secondary"}>
                          {status}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="primary">{type}</Badge>
                      </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col">
                      <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {event.title}
                      </h3>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Calendar className="h-4 w-4 text-primary-500 shrink-0" />
                          {date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Clock className="h-4 w-4 text-primary-500 shrink-0" />
                          {time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
                          {location}
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-neutral-500 leading-relaxed flex-1">
                        {description}
                      </p>

                      <div className="mt-4 flex items-center text-sm font-medium text-primary-500 group-hover:text-primary-600">
                        View Details
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
          <Link href="/events">
            <Button variant="outline" size="lg">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
