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
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { BrandDivider } from "@/components/shared/brand-divider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ─────────────────────────────────────────────── */
/*  Event data                                     */
/* ─────────────────────────────────────────────── */

interface EventData {
  title: string;
  date: string;
  /** ISO date for countdown (start date) */
  isoDate: string;
  time: string;
  location: string;
  type: string;
  program: string;
  programSlug: string;
  status: string;
  price: string;
  capacity: string;
  registered: number;
  description: string;
  details: string;
  /** Event flyer / hero image */
  heroImage: string;
  /** Schedule items */
  schedule: { time: string; title: string; description?: string }[];
  /** Highlights / what to expect */
  highlights: string[];
  /** Gallery images */
  gallery: { src: string; alt: string }[];
  /** Related event IDs */
  relatedEvents: string[];
}

const eventsData: Record<string, EventData> = {
  "1": {
    title: "Summer Band Camp 2026",
    date: "June 15-20, 2026",
    isoDate: "2026-06-15T09:00:00",
    time: "9:00 AM - 5:00 PM",
    location: "Los Angeles, CA",
    type: "In Person",
    program: "Band Camp",
    programSlug: "band-camp",
    status: "upcoming",
    price: "Free",
    capacity: "100",
    registered: 67,
    description:
      "A week-long immersive music experience featuring professional musicians, ensemble workshops, and a closing night concert.",
    details:
      "Join us for an unforgettable week of music, learning, and community. Our Summer Band Camp brings together young musicians of all skill levels for an intensive program that includes daily instrument instruction, ensemble rehearsals, music theory workshops, recording studio sessions, guest artist masterclasses, and a closing night concert for family and friends.\n\nAll instruments and materials are provided. Lunch is included each day. Participants will receive a certificate of completion and access to practice resources to continue their musical journey.",
    heroImage: "/images/events/andf-event-1.png",
    schedule: [
      { time: "9:00 AM", title: "Check-In & Warm-Up", description: "Registration, instrument assignments, and group warm-up exercises" },
      { time: "10:00 AM", title: "Instrument Instruction", description: "Break into sections for focused instruction with professional musicians" },
      { time: "12:00 PM", title: "Lunch & Social Time", description: "Catered lunch with time for socializing and jamming" },
      { time: "1:00 PM", title: "Music Theory Workshop", description: "Interactive sessions on reading music, rhythm, and composition" },
      { time: "2:30 PM", title: "Ensemble Rehearsal", description: "Full band rehearsal preparing for the closing concert" },
      { time: "4:00 PM", title: "Recording Studio Session", description: "Small group recording sessions in a professional studio" },
    ],
    highlights: [
      "Professional instrument instruction for all skill levels",
      "Access to 50+ instruments — no need to bring your own",
      "Record in a professional studio",
      "Closing night concert for family and friends",
      "Certificate of completion",
      "All meals and materials included",
    ],
    gallery: [
      { src: "/images/programs/engaged-students.jpg", alt: "Students engaged in music session" },
      { src: "/images/gallery/knowledj-teaches.jpg", alt: "Instructor teaching music" },
      { src: "/images/gallery/noel-massie-teaches.jpg", alt: "Live music performance" },
      { src: "/images/gallery/opening-panel.jpg", alt: "Opening panel at Band Camp" },
    ],
    relatedEvents: ["2", "4"],
  },
  "2": {
    title: "Drone Pilot Workshop",
    date: "July 8, 2026",
    isoDate: "2026-07-08T10:00:00",
    time: "10:00 AM - 3:00 PM",
    location: "Innovation Hub, LA",
    type: "In Person",
    program: "Drone Experience",
    programSlug: "drone-experience",
    status: "upcoming",
    price: "$25",
    capacity: "30",
    registered: 18,
    description:
      "Learn to fly drones, capture aerial photography, and explore career paths in aviation and technology.",
    details:
      "This hands-on workshop is designed for beginners and intermediate drone enthusiasts. You'll learn basic drone operation and safety, aerial photography techniques, video capture and editing basics, FAA regulations overview, and career paths in drone technology.\n\nAll equipment is provided. Light refreshments included.",
    heroImage: "/images/programs/drone-teach.jpg",
    schedule: [
      { time: "10:00 AM", title: "Welcome & Safety Briefing", description: "Overview of drone safety, FAA rules, and equipment orientation" },
      { time: "10:45 AM", title: "Flight Training", description: "Hands-on drone piloting with expert instructors" },
      { time: "12:00 PM", title: "Lunch Break", description: "Light refreshments provided" },
      { time: "12:30 PM", title: "Aerial Photography", description: "Learn to capture stunning photos and video from above" },
      { time: "2:00 PM", title: "Career Pathways", description: "Explore careers in drone technology, aerospace, and filmmaking" },
    ],
    highlights: [
      "Hands-on flight training with professional-grade drones",
      "All equipment provided — no experience needed",
      "FAA regulations overview",
      "Aerial photography and videography techniques",
      "Career pathway exploration in STEM fields",
      "Light refreshments included",
    ],
    gallery: [
      { src: "/images/programs/drone-teach.jpg", alt: "Drone instruction session" },
      { src: "/images/programs/nasa-workshop.jpg", alt: "NASA workshop" },
      { src: "/images/gallery/nasa-team-teaches.jpg", alt: "NASA team teaches drone tech" },
      { src: "/images/gallery/nasa-workshop-2.jpg", alt: "Workshop participants" },
    ],
    relatedEvents: ["1", "3"],
  },
  "3": {
    title: "HBCU Heroes Virtual Summit",
    date: "August 12, 2026",
    isoDate: "2026-08-12T12:00:00",
    time: "12:00 PM - 4:00 PM",
    location: "Virtual Event",
    type: "Virtual",
    program: "HBCU Heroes",
    programSlug: "hbcu-heroes",
    status: "upcoming",
    price: "Free",
    capacity: "500",
    registered: 234,
    description:
      "An inspiring virtual event celebrating HBCU excellence with keynote speakers and networking.",
    details:
      "Connect with HBCU alumni, current students, and admissions representatives in this virtual celebration of excellence. Featuring a keynote address by renowned HBCU alumni, panel discussions on student life and success, virtual campus tours, scholarship information sessions, and networking breakout rooms.\n\nOpen to all high school and college-age students.",
    heroImage: "/images/events/hbcu-classic.png",
    schedule: [
      { time: "12:00 PM", title: "Opening & Welcome", description: "Welcome address and overview of the day" },
      { time: "12:30 PM", title: "Keynote Speaker", description: "Inspiring address by a renowned HBCU alumnus" },
      { time: "1:15 PM", title: "Panel: Student Life", description: "Current students share their HBCU experiences" },
      { time: "2:15 PM", title: "Virtual Campus Tours", description: "Live guided tours of featured HBCU campuses" },
      { time: "3:15 PM", title: "Scholarship Workshop", description: "Financial aid tips and scholarship application guidance" },
    ],
    highlights: [
      "Keynote address by renowned HBCU alumni",
      "Live virtual campus tours",
      "Scholarship guidance and financial aid info",
      "Networking breakout rooms",
      "Panel discussions with current students",
      "Open to all high school and college-age students",
    ],
    gallery: [
      { src: "/images/gallery/omega-psi-phi.jpg", alt: "Omega Psi Phi fraternity members" },
      { src: "/images/gallery/zeta-phi-beta.jpg", alt: "Zeta Phi Beta gathering" },
      { src: "/images/gallery/dawnn-zeta-sorors.jpg", alt: "Dawnn with Zeta sorors" },
      { src: "/images/gallery/fnf-scholarship-2024.jpg", alt: "Scholarship recipients" },
    ],
    relatedEvents: ["5", "1"],
  },
  "4": {
    title: "TopGolf Networking Night",
    date: "July 22, 2026",
    isoDate: "2026-07-22T17:00:00",
    time: "5:00 PM - 9:00 PM",
    location: "TopGolf, Los Angeles",
    type: "In Person",
    program: "TopGolf",
    programSlug: "topgolf",
    status: "upcoming",
    price: "$15",
    capacity: "60",
    registered: 42,
    description:
      "An evening of golf, networking, and mentorship with industry professionals.",
    details:
      "Swing into success at our TopGolf Networking Night! Connect with mentors and industry leaders in a fun, relaxed environment. Enjoy golf instruction for all levels, meet professionals from entertainment, tech, and business, team competitions with prizes, dinner and refreshments, and mentorship matching opportunities.",
    heroImage: "/images/events/topgolf-atlanta.png",
    schedule: [
      { time: "5:00 PM", title: "Check-In & Welcome", description: "Arrival, bay assignments, and welcome drinks" },
      { time: "5:30 PM", title: "Golf Instruction", description: "Pro tips and basics for all skill levels" },
      { time: "6:30 PM", title: "Networking Hour", description: "Connect with mentors and industry professionals" },
      { time: "7:30 PM", title: "Team Competition", description: "Fun team golf challenges with prizes" },
      { time: "8:30 PM", title: "Dinner & Awards", description: "Dinner, awards ceremony, and closing remarks" },
    ],
    highlights: [
      "Golf instruction for all experience levels",
      "Meet professionals from entertainment, tech, and business",
      "Team competitions with prizes",
      "Dinner and refreshments included",
      "Mentorship matching opportunities",
      "Fun, relaxed networking environment",
    ],
    gallery: [
      { src: "/images/events/topgolf-atlanta.png", alt: "TopGolf event" },
      { src: "/images/events/topgolf-atlanta-uncf.png", alt: "TopGolf UNCF event" },
      { src: "/images/gallery/leadership-group.jpg", alt: "Leadership group photo" },
      { src: "/images/gallery/raffle-winner.jpg", alt: "Raffle winner celebration" },
    ],
    relatedEvents: ["2", "5"],
  },
  "5": {
    title: "Mentor Matching Day",
    date: "September 5, 2026",
    isoDate: "2026-09-05T10:00:00",
    time: "10:00 AM - 2:00 PM",
    location: "ANDF Headquarters, LA",
    type: "In Person",
    program: "Mentorship",
    programSlug: "mentorship",
    status: "upcoming",
    price: "Free",
    capacity: "40",
    registered: 28,
    description:
      "Meet your potential mentor, set goals, and begin your mentorship journey.",
    details:
      "This is where your mentorship journey begins! Mentor Matching Day is a carefully curated event where mentees meet potential mentors. The day features ice-breaker activities, speed mentoring sessions, goal-setting workshops, a mentor-mentee matching ceremony, and a welcome packet with resources.\n\nLunch provided. Parents/guardians welcome to attend.",
    heroImage: "/images/programs/mentorship-session.jpg",
    schedule: [
      { time: "10:00 AM", title: "Arrival & Ice Breakers", description: "Fun activities to get everyone comfortable" },
      { time: "10:45 AM", title: "Speed Mentoring", description: "Brief one-on-one sessions with multiple mentors" },
      { time: "12:00 PM", title: "Lunch", description: "Catered lunch and open conversation" },
      { time: "12:45 PM", title: "Goal-Setting Workshop", description: "Define your goals and what you want from mentorship" },
      { time: "1:30 PM", title: "Matching Ceremony", description: "Mentor-mentee pairs announced and celebrated" },
    ],
    highlights: [
      "Meet experienced professionals across multiple industries",
      "Speed mentoring to find your perfect match",
      "Goal-setting and vision-boarding workshop",
      "Welcome packet with resources and tools",
      "Lunch provided for all attendees",
      "Parents and guardians welcome",
    ],
    gallery: [
      { src: "/images/programs/mentorship-session.jpg", alt: "Mentorship session" },
      { src: "/images/gallery/dawnn-on-the-move.jpg", alt: "Mentorship in action" },
      { src: "/images/gallery/volunteer-leader.jpg", alt: "Volunteer leader" },
      { src: "/images/gallery/scholarship-recipient.jpg", alt: "Scholarship recipient" },
    ],
    relatedEvents: ["1", "3"],
  },
};

/* Icon mapping for programs */
const programIcons: Record<string, React.ElementType> = {
  "Band Camp": Music,
  "Drone Experience": Cpu,
  TopGolf: Target,
  "HBCU Heroes": GraduationCap,
  Mentorship: Users,
  MenTORS: MessageCircle,
  "Sisters Hangout": Heart,
};

/* ─────────────────────────────────────────────── */
/*  Countdown Timer                                */
/* ─────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────── */
/*  Lightbox                                       */
/* ─────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────── */
/*  Main Page                                      */
/* ─────────────────────────────────────────────── */

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = eventsData[id];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!event) {
    return (
      <div className="pt-32 pb-24 px-6 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground">Event Not Found</h1>
        <Link href="/events" className="text-primary-500 mt-4 inline-block">Back to Events</Link>
      </div>
    );
  }

  const spotsLeft = parseInt(event.capacity) - event.registered;
  const percentFull = (event.registered / parseInt(event.capacity)) * 100;
  const ProgramIcon = programIcons[event.program] || Calendar;

  return (
    <div className="pb-0">
      {/* ── Hero with full-bleed event image ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={event.heroImage}
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
                <ProgramIcon className="h-3 w-3" /> {event.program}
              </Badge>
              <Badge variant="info" className="bg-white/20 text-white border-white/30">
                {event.type}
              </Badge>
              {event.price === "Free" ? (
                <Badge variant="success" className="bg-green-500/80 text-white border-none">Free</Badge>
              ) : (
                <Badge variant="info" className="bg-white/20 text-white border-white/30">
                  <Ticket className="h-3 w-3" /> {event.price}
                </Badge>
              )}
            </div>

            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white">
              {event.title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">{event.description}</p>

            {/* Quick info pills */}
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-secondary-400" /> {event.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-secondary-400" /> {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-secondary-400" /> {event.location}
              </span>
            </div>

            {/* Countdown */}
            <div className="pt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3">Event starts in</p>
              <CountdownTimer targetDate={event.isoDate} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main content + sidebar ── */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left – main content */}
          <div className="lg:col-span-2 space-y-16">
            {/* About the event */}
            <SectionWrapper>
              <div className="space-y-5">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
                  About the event
                </span>
                <h2 className="text-3xl font-display font-bold text-foreground">
                  What to Expect
                </h2>
                {event.details.split("\n\n").map((p, i) => (
                  <p key={i} className="text-foreground-muted leading-relaxed text-lg">{p}</p>
                ))}
              </div>
            </SectionWrapper>

            {/* Highlights */}
            <SectionWrapper>
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Event Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl bg-primary-50/50 border border-primary-100"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-accent-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground-muted">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </SectionWrapper>

            {/* Schedule */}
            <SectionWrapper>
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
                    Plan your day
                  </span>
                  <h2 className="text-2xl font-display font-bold text-foreground mt-1">
                    Event Schedule
                  </h2>
                </div>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[27px] top-3 bottom-3 w-px bg-primary-200" />

                  <div className="space-y-0">
                    {event.schedule.map((item, i) => (
                      <motion.div
                        key={i}
                        className="relative flex gap-5 py-4"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                      >
                        {/* Timeline dot */}
                        <div className="relative z-10 h-[14px] w-[14px] rounded-full bg-primary-500 border-[3px] border-white shrink-0 mt-1.5 shadow-sm" />

                        <div className="flex-1 pb-4 border-b border-border last:border-b-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                            <span className="text-sm font-semibold text-primary-600 whitespace-nowrap">
                              {item.time}
                            </span>
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                          </div>
                          {item.description && (
                            <p className="text-sm text-foreground-muted">{item.description}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionWrapper>

            {/* Gallery */}
            {event.gallery.length > 0 && (
              <SectionWrapper>
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Event Gallery
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {event.gallery.map((photo, i) => (
                      <motion.div
                        key={photo.src}
                        className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                          i === 0 ? "col-span-2 aspect-[2/1]" : "aspect-[4/3]"
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

          {/* Right – sticky sidebar */}
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
                      <div className="text-sm font-medium text-foreground">{event.date}</div>
                      <div className="text-xs text-foreground-subtle">{event.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-foreground-muted">
                    <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{event.location}</div>
                      <div className="text-xs text-foreground-subtle">{event.type}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-foreground-muted">
                    <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <DollarSign className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {event.price === "Free" ? "Free Admission" : event.price}
                      </div>
                      <div className="text-xs text-foreground-subtle">All materials included</div>
                    </div>
                  </div>
                </div>

                <BrandDivider className="!my-4" />

                {/* Capacity bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      <Users className="h-4 w-4 inline mr-1 text-primary-500" />
                      {spotsLeft} spots left
                    </span>
                    <span className="text-xs text-foreground-subtle">
                      {event.registered}/{event.capacity}
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

                <Link href={`/events/${id}/register`} className="block">
                  <Button variant="primary" className="w-full" size="lg">
                    <Ticket className="h-4 w-4" />
                    Register Now
                  </Button>
                </Link>

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
              <Link href={`/programs/${event.programSlug}`}>
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
                        {event.program} Program
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── More Events ── */}
      {event.relatedEvents.length > 0 && (
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
              {event.relatedEvents.map((relId) => {
                const rel = eventsData[relId];
                if (!rel) return null;
                const RelIcon = programIcons[rel.program] || Calendar;
                return (
                  <Link key={relId} href={`/events/${relId}`}>
                    <motion.div
                      className="group relative overflow-hidden rounded-2xl bg-white border border-border hover:border-primary-200 hover:shadow-lg transition-all"
                      whileHover={{ y: -4 }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={rel.heroImage}
                          alt={rel.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="500px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex gap-2">
                          <Badge variant="gold" className="bg-secondary-500/90 text-white border-none text-[10px]">
                            <RelIcon className="h-3 w-3" /> {rel.program}
                          </Badge>
                          {rel.price === "Free" && (
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
                            <Calendar className="h-3.5 w-3.5 text-primary-500" /> {rel.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-primary-500" /> {rel.location}
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

      {/* ── CTA ── */}
      <section className="bg-secondary-500 py-16 px-6 text-center">
        <div className="mx-auto max-w-2xl space-y-5">
          <h2 className="font-display text-3xl font-bold text-white">
            Ready to Join Us?
          </h2>
          <p className="text-white/90 text-lg">
            Secure your spot at {event.title} and be part of something special.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href={`/events/${id}/register`}>
              <Button variant="primary" size="lg" className="bg-white text-secondary-600 hover:bg-white/90">
                <Ticket className="h-4 w-4" /> Register Now
              </Button>
            </Link>
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
        {lightboxIndex !== null && (
          <Lightbox
            images={event.gallery}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((p) => (p !== null ? (p - 1 + event.gallery.length) % event.gallery.length : 0))}
            onNext={() => setLightboxIndex((p) => (p !== null ? (p + 1) % event.gallery.length : 0))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
