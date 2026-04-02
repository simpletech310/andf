"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    id: "1",
    title: "Summer Band Camp 2026",
    date: "June 15-20, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Los Angeles, CA",
    type: "In Person",
    status: "Registration Open" as const,
    description: "A week-long immersive music experience featuring professional musicians, ensemble workshops, and a closing night concert.",
    image: "/images/events/andf-event-1.png",
    accent: "border-l-violet-500",
  },
  {
    id: "2",
    title: "TopGolf Atlanta Experience",
    date: "July 22, 2026",
    time: "10:00 AM - 3:00 PM",
    location: "TopGolf, Atlanta",
    type: "In Person",
    status: "Registration Open" as const,
    description: "Networking, mentorship, and fun — connecting youth with successful professionals in an exciting environment.",
    image: "/images/events/topgolf-atlanta.png",
    accent: "border-l-emerald-500",
  },
  {
    id: "3",
    title: "HBCU Heroes Virtual Summit",
    date: "August 12, 2026",
    time: "12:00 PM - 4:00 PM",
    location: "Virtual Event",
    type: "Virtual",
    status: "Coming Soon" as const,
    description: "An inspiring virtual event celebrating HBCU excellence with keynote speakers, panel discussions, and networking.",
    image: "/images/events/hbcu-classic.png",
    accent: "border-l-gold-500",
  },
];

export function EventsCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionWrapper className="py-24 lg:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="Upcoming Events"
          title="Join the Movement"
          description="Experience transformative events that connect, inspire, and empower. Reserve your spot today."
        />

        <div ref={ref} className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Link href={`/events/${event.id}`} className="block group h-full">
                <div className={`h-full flex flex-col rounded-2xl bg-white border border-neutral-200 border-l-4 ${event.accent} group-hover:shadow-lg transition-all duration-500 overflow-hidden`}>
                  {/* Event flyer image */}
                  <div className="relative h-48 bg-neutral-100 overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant={event.status === "Registration Open" ? "success" : "secondary"}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="primary">{event.type}</Badge>
                    </div>
                  </div>

                  <div className="flex-1 p-6 flex flex-col">
                    <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar className="h-4 w-4 text-primary-500 shrink-0" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Clock className="h-4 w-4 text-primary-500 shrink-0" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
                        {event.location}
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-neutral-500 leading-relaxed flex-1">
                      {event.description}
                    </p>

                    <div className="mt-4 flex items-center text-sm font-medium text-primary-500 group-hover:text-primary-600">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
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
