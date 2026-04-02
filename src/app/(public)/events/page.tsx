"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, MapPin, Clock, ArrowRight, Filter, Heart,
  Sparkles, Users, Music, Cpu, Target, MessageCircle, GraduationCap,
  Ticket, ChevronRight
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerChildren, StaggerItem } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ─── Data ─────────────────────────────────────────────────────────── */

const events = [
  {
    id: "1",
    title: "Summer Band Camp 2026",
    date: "June 15-20, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Los Angeles, CA",
    type: "In Person",
    program: "Band Camp",
    status: "upcoming",
    price: "Free",
    description: "A week-long immersive music experience featuring professional musicians, ensemble workshops, and a closing night concert.",
    image: "/images/programs/engaged-students.jpg",
    icon: Music,
    color: "from-violet-500 to-purple-600",
    spots: 33,
    featured: true,
  },
  {
    id: "2",
    title: "Drone Pilot Workshop",
    date: "July 8, 2026",
    time: "10:00 AM - 3:00 PM",
    location: "Innovation Hub, LA",
    type: "In Person",
    program: "Drone Experience",
    status: "upcoming",
    price: "$25",
    description: "Learn to fly drones, capture aerial photography, and explore career paths in aviation and technology.",
    image: "/images/programs/drone-teach.jpg",
    icon: Cpu,
    color: "from-cyan-500 to-blue-600",
    spots: 15,
    featured: false,
  },
  {
    id: "3",
    title: "HBCU Heroes Virtual Summit",
    date: "August 12, 2026",
    time: "12:00 PM - 4:00 PM",
    location: "Virtual Event",
    type: "Virtual",
    program: "HBCU Heroes",
    status: "upcoming",
    price: "Free",
    description: "An inspiring virtual event celebrating HBCU excellence with keynote speakers, alumni panels, and networking opportunities.",
    image: "/images/gallery/omega-psi-phi.jpg",
    icon: GraduationCap,
    color: "from-primary-500 to-primary-700",
    spots: 200,
    featured: false,
  },
  {
    id: "4",
    title: "TopGolf Networking Night",
    date: "July 22, 2026",
    time: "5:00 PM - 9:00 PM",
    location: "TopGolf, Los Angeles",
    type: "In Person",
    program: "TopGolf",
    status: "upcoming",
    price: "$15",
    description: "An evening of golf, networking, and mentorship with industry professionals in an exciting, relaxed setting.",
    image: "/images/gallery/leadership-group.jpg",
    icon: Target,
    color: "from-emerald-500 to-green-600",
    spots: 40,
    featured: false,
  },
  {
    id: "5",
    title: "Mentor Matching Day",
    date: "September 5, 2026",
    time: "10:00 AM - 2:00 PM",
    location: "ANDF Headquarters, LA",
    type: "In Person",
    program: "Mentorship",
    status: "upcoming",
    price: "Free",
    description: "Meet your potential mentor, set goals, and begin your mentorship journey with experienced professionals.",
    image: "/images/programs/mentorship-session.jpg",
    icon: Users,
    color: "from-amber-500 to-orange-600",
    spots: 25,
    featured: false,
  },
  {
    id: "6",
    title: "Spring Band Camp 2026",
    date: "March 10-14, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Los Angeles, CA",
    type: "In Person",
    program: "Band Camp",
    status: "past",
    price: "Free",
    description: "Our spring session of Band Camp featuring new instruments and guest performers.",
    image: "/images/gallery/opening-panel.jpg",
    icon: Music,
    color: "from-violet-500 to-purple-600",
    spots: 0,
    featured: false,
  },
  {
    id: "7",
    title: "Sisters Hangout Kickoff",
    date: "October 1, 2026",
    time: "11:00 AM - 3:00 PM",
    location: "Community Center, LA",
    type: "In Person",
    program: "Sisters Hangout",
    status: "upcoming",
    price: "Free",
    description: "A day of bonding, workshops, and empowerment for young women — launching our new sisterhood season.",
    image: "/images/gallery/dawnn-zeta-sorors.jpg",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    spots: 50,
    featured: false,
  },
  {
    id: "8",
    title: "MenTORS Real Talk Series",
    date: "August 28, 2026",
    time: "6:00 PM - 8:30 PM",
    location: "ANDF Headquarters, LA",
    type: "In Person",
    program: "MenTORS",
    status: "upcoming",
    price: "Free",
    description: "An honest, open conversation about career challenges, personal growth, and building meaningful connections.",
    image: "/images/gallery/dawnn-steve-wesson.jpg",
    icon: MessageCircle,
    color: "from-red-500 to-rose-600",
    spots: 30,
    featured: false,
  },
];

const filters = ["All", "Band Camp", "Drone Experience", "TopGolf", "Mentorship", "HBCU Heroes", "Sisters Hangout", "MenTORS"];

/* ─── Sub-Components ───────────────────────────────────────────────── */

function FeaturedEventCard({ event }: { event: typeof events[0] }) {
  const Icon = event.icon;
  return (
    <Link href={`/events/${event.id}`} className="block group">
      <motion.div
        className="relative rounded-3xl overflow-hidden bg-white border border-neutral-200 group-hover:border-primary-300 group-hover:shadow-2xl transition-all duration-500"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Image */}
          <div className="lg:w-[55%] aspect-[16/10] lg:aspect-auto relative overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Date badge */}
            <div className="absolute top-5 left-5">
              <div className="bg-white rounded-xl px-4 py-2.5 shadow-lg text-center">
                <div className="text-2xl font-extrabold text-primary-500 leading-none">15</div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Jun</div>
              </div>
            </div>

            {/* Featured badge */}
            <div className="absolute top-5 right-5">
              <div className="bg-secondary-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Sparkles className="h-3 w-3" />
                Featured Event
              </div>
            </div>

            {/* Bottom overlay info */}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div className="flex gap-2">
                {event.price === "Free" && (
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Free</span>
                )}
                <span className="bg-white/90 backdrop-blur-sm text-neutral-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {event.type}
                </span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-right">
                <span className="text-xs text-secondary-600 font-bold">{event.spots} spots left</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-[45%] flex flex-col justify-center p-8 lg:p-10 space-y-5">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-500">{event.program}</span>
            </div>

            <h3 className="text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary-500 transition-colors leading-tight">
              {event.title}
            </h3>

            <p className="text-foreground-muted leading-relaxed">
              {event.description}
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-foreground-muted">
                <Calendar className="h-4 w-4 text-primary-500 shrink-0" />
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground-muted">
                <Clock className="h-4 w-4 text-primary-500 shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground-muted">
                <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Register Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function EventCard({ event, index }: { event: typeof events[0]; index: number }) {
  const Icon = event.icon;
  const isPast = event.status === "past";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link href={`/events/${event.id}`} className="block group h-full">
        <div className={`h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-neutral-200 group-hover:border-primary-300 group-hover:shadow-xl transition-all duration-500 ${isPast ? "opacity-70 grayscale hover:opacity-100 hover:grayscale-0" : ""}`}>
          {/* Image header */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {isPast ? (
                <span className="bg-neutral-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                  Completed
                </span>
              ) : (
                <>
                  {event.price === "Free" && (
                    <span className="bg-green-500 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">Free</span>
                  )}
                  {event.price !== "Free" && (
                    <span className="bg-primary-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{event.price}</span>
                  )}
                </>
              )}
            </div>

            <div className="absolute top-3 right-3">
              <span className="bg-white/90 backdrop-blur-sm text-neutral-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                {event.type}
              </span>
            </div>

            {/* Bottom left — icon + program label */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${event.color} flex items-center justify-center shadow-sm`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-white text-xs font-bold drop-shadow-lg">{event.program}</span>
            </div>

            {/* Spots remaining */}
            {!isPast && event.spots > 0 && event.spots <= 50 && (
              <div className="absolute bottom-3 right-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  event.spots <= 15
                    ? "bg-red-500 text-white"
                    : "bg-white/90 text-neutral-700"
                }`}>
                  {event.spots} spots left
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary-500 transition-colors leading-snug">
              {event.title}
            </h3>

            <p className="mt-2 text-sm text-foreground-muted leading-relaxed line-clamp-2 flex-1">
              {event.description}
            </p>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-foreground-muted">
                <Calendar className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground-muted">
                <Clock className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground-muted">
                <MapPin className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-500 group-hover:gap-2.5 transition-all">
                {isPast ? "View Recap" : "Register Now"}
                <ArrowRight className="h-4 w-4" />
              </span>
              {!isPast && (
                <Ticket className="h-4 w-4 text-neutral-300 group-hover:text-secondary-400 transition-colors" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showPast, setShowPast] = useState(false);

  const featuredEvent = events.find((e) => e.featured);
  const filtered = events.filter((e) => {
    if (e.featured) return false; // shown separately
    if (activeFilter !== "All" && e.program !== activeFilter) return false;
    if (!showPast && e.status === "past") return false;
    return true;
  });

  return (
    <div className="pb-0">

      {/* ───── 1. HERO ───── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/fnf-group-lineup.jpg"
            alt="ANDF events"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-36 text-center space-y-6">
          <motion.span
            className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-secondary-400 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Workshops &bull; Camps &bull; Summits &bull; Networking
          </motion.span>
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Experiences That
            <br />
            <span className="text-secondary-400">Inspire</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            From week-long camps to one-night networking events — find the experience
            that fits you and take the next step in your journey.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <a href="#events">
              <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-white/90">
                Browse Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <Calendar className="h-4 w-4" />
                Host an Event With Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ───── 2. QUICK STATS ───── */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 py-8 px-6">
        <div className="mx-auto max-w-4xl grid grid-cols-3 gap-6">
          {[
            { value: "8+", label: "Upcoming Events" },
            { value: "100%", label: "Free Programs" },
            { value: "2,000+", label: "Past Attendees" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-xs text-primary-100 mt-0.5 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───── 3. FEATURED EVENT ───── */}
      {featuredEvent && (
        <section className="py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary-500">Don&apos;t Miss Out</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">Featured Event</h2>
            </div>
            <FeaturedEventCard event={featuredEvent} />
          </div>
        </section>
      )}

      {/* ───── 4. ALL EVENTS WITH FILTERS ───── */}
      <section id="events" className="py-16 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Browse</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-1">All Events</h2>
            </div>

            {/* Past events toggle */}
            <button
              onClick={() => setShowPast(!showPast)}
              className={`self-start sm:self-auto px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                showPast
                  ? "bg-primary-50 text-primary-600 border-primary-200"
                  : "bg-white text-foreground-muted border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {showPast ? "Hide" : "Show"} Past Events
            </button>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <Filter className="h-4 w-4 text-foreground-muted mr-1" />
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-primary-500 text-white shadow-sm"
                    : "bg-white border border-neutral-200 text-foreground-muted hover:border-primary-300 hover:text-primary-500"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Events grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + String(showPast)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              className="mt-16 text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Calendar className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-foreground-muted">No events match your filter</p>
              <button
                onClick={() => { setActiveFilter("All"); setShowPast(false); }}
                className="mt-3 text-primary-500 hover:text-primary-400 font-medium"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ───── 5. HOW IT WORKS ───── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            label="How It Works"
            title="From Registration to Experience"
            description="Getting started with ANDF events is easy — and most are completely free."
          />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Find Your Event", desc: "Browse our upcoming events and find the one that sparks your interest — from music to tech to mentorship.", icon: Sparkles },
              { step: "02", title: "Register for Free", desc: "Sign up in minutes. Most events are free. We'll send you everything you need to know before the big day.", icon: Ticket },
              { step: "03", title: "Show Up & Shine", desc: "Come ready to learn, connect, and grow. Our team and mentors will make sure you have an unforgettable experience.", icon: Heart },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-300 to-transparent" />
                )}

                <div className="mx-auto h-20 w-20 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-5 group-hover:bg-primary-500 transition-colors duration-300 relative">
                  <item.icon className="h-8 w-8 text-primary-500 group-hover:text-white transition-colors duration-300" />
                  <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-secondary-500 text-white text-xs font-extrabold flex items-center justify-center shadow-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 6. CTA ───── */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/community-group.jpg"
            alt="ANDF community"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-600/90 via-secondary-500/90 to-secondary-600/90" />
        </div>
        <motion.div
          className="mx-auto max-w-3xl relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-white/70 mb-4">
            Don&apos;t Miss a Thing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Your Next Experience
            <br />
            <span className="text-white/90">Is Waiting</span>
          </h2>
          <p className="text-white/80 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
            Join thousands of young people who have discovered new passions, built
            lifelong friendships, and unlocked their potential through ANDF events.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="bg-white text-secondary-600 hover:bg-white/90 shadow-xl">
                Get Involved
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <Heart className="h-4 w-4" /> Support Events
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
