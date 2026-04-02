"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Heart,
  Music,
  Cpu,
  Target,
  GraduationCap,
  MessageCircle,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import {
  SectionWrapper,
  StaggerChildren,
  StaggerItem,
} from "@/components/shared/section-wrapper";
import { BrandDivider } from "@/components/shared/brand-divider";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────── */
/*  Program data                                   */
/* ─────────────────────────────────────────────── */

interface ProgramData {
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: React.ElementType;
  logo?: string;
  color: string;
  features: string[];
  outcomes: { stat: string; label: string }[];
  upcomingEvents: { title: string; date: string; location: string }[];
  /** YouTube video ID for the featured program video */
  videoId?: string;
  videoTitle?: string;
  /** Hero / cover image for the program */
  heroImage?: string;
  /** Photo gallery */
  gallery: { src: string; alt: string }[];
}

const programsData: Record<string, ProgramData> = {
  "band-camp": {
    title: "Band Camp",
    tagline: "Music that moves the soul",
    description:
      "An immersive musical experience where young people discover their rhythm and build confidence.",
    longDescription:
      "Our Band Camp program is more than just music lessons — it's a transformative experience that builds confidence, teaches discipline, and creates lasting bonds. Under the guidance of professional musicians and educators, participants explore various instruments, develop ensemble skills, and perform in a closing night concert that showcases their growth.\n\nFrom beginners picking up an instrument for the first time to experienced musicians looking to refine their craft, Band Camp meets every participant where they are and helps them reach the next level.",
    icon: Music,
    logo: "/images/partners/band-camp.jpg",
    color: "from-violet-500 to-purple-600",
    heroImage: "/images/programs/engaged-students.jpg",
    videoId: "",
    videoTitle: "Band Camp Highlights",
    features: [
      "Professional instrument instruction",
      "Ensemble and band workshops",
      "Music theory fundamentals",
      "Recording studio experience",
      "Closing night live concert",
      "Take-home practice resources",
    ],
    outcomes: [
      { stat: "500+", label: "Students Trained" },
      { stat: "95%", label: "Return Rate" },
      { stat: "12", label: "Concerts Performed" },
      { stat: "50+", label: "Instruments Available" },
    ],
    upcomingEvents: [
      {
        title: "Summer Band Camp 2026",
        date: "June 15-20, 2026",
        location: "Los Angeles, CA",
      },
    ],
    gallery: [
      { src: "/images/programs/engaged-students.jpg", alt: "Students performing during Band Camp" },
      { src: "/images/programs/band-camp-logo.jpg", alt: "Band Camp logo" },
      { src: "/images/gallery/knowledj-teaches.jpg", alt: "Instructor teaching music" },
      { src: "/images/gallery/noel-massie-teaches.jpg", alt: "Live music performance" },
      { src: "/images/gallery/opening-panel.jpg", alt: "Opening panel discussion" },
      { src: "/images/gallery/event-photo.jpg", alt: "Band Camp event" },
    ],
  },
  "drone-experience": {
    title: "Drone Experience",
    tagline: "Sky's not the limit",
    description:
      "Hands-on drone piloting and aerial photography workshops for aspiring tech leaders.",
    longDescription:
      "The Drone Experience program puts cutting-edge technology directly into the hands of young people. Participants learn to pilot drones, capture stunning aerial photography, and explore the rapidly growing world of unmanned aerial systems.\n\nBeyond the thrill of flight, this program introduces career pathways in aerospace, filmmaking, agriculture, surveying, and more. Participants work toward understanding FAA regulations and responsible drone operation.",
    icon: Cpu,
    color: "from-cyan-500 to-blue-600",
    heroImage: "/images/programs/drone-teach.jpg",
    videoId: "",
    videoTitle: "Drone Experience Highlights",
    features: [
      "Drone flight training",
      "Aerial photography & videography",
      "FAA regulation overview",
      "Career pathway exploration",
      "STEM fundamentals",
      "Equipment provided",
    ],
    outcomes: [
      { stat: "200+", label: "Pilots Trained" },
      { stat: "100%", label: "Hands-on Learning" },
      { stat: "8", label: "Career Paths Explored" },
      { stat: "30+", label: "Drones Available" },
    ],
    upcomingEvents: [
      {
        title: "Drone Pilot Workshop",
        date: "July 8, 2026",
        location: "Innovation Hub, LA",
      },
    ],
    gallery: [
      { src: "/images/programs/drone-teach.jpg", alt: "Drone piloting instruction" },
      { src: "/images/programs/nasa-workshop.jpg", alt: "NASA workshop session" },
      { src: "/images/gallery/nasa-team-teaches.jpg", alt: "NASA team teaches drone technology" },
      { src: "/images/gallery/nasa-workshop-2.jpg", alt: "Workshop participants with drones" },
      { src: "/images/gallery/swat-experience.jpg", alt: "SWAT drone experience" },
      { src: "/images/gallery/leadership-group.jpg", alt: "Leadership group photo" },
    ],
  },
  topgolf: {
    title: "TopGolf Experience",
    tagline: "Driving success forward",
    description:
      "Sports, networking, and mentorship in an exciting environment.",
    longDescription:
      "Our TopGolf Experience combines the excitement of golf with meaningful mentorship and networking opportunities. In a relaxed, fun setting, young people connect with professionals, learn about leadership, and develop social skills that will serve them throughout their lives.\n\nThis program breaks down barriers between youth and successful professionals, creating organic connections in a welcoming environment where everyone can have fun while learning.",
    icon: Target,
    logo: "/images/partners/top-golf.jpg",
    color: "from-emerald-500 to-green-600",
    heroImage: "/images/gallery/leadership-group.jpg",
    videoId: "",
    videoTitle: "TopGolf Experience Highlights",
    features: [
      "Golf instruction",
      "Professional networking",
      "Leadership workshops",
      "Team building activities",
      "Career conversations",
      "Refreshments included",
    ],
    outcomes: [
      { stat: "300+", label: "Participants" },
      { stat: "50+", label: "Mentors Engaged" },
      { stat: "15", label: "Events Hosted" },
      { stat: "90%", label: "Satisfaction Rate" },
    ],
    upcomingEvents: [
      {
        title: "TopGolf Networking Night",
        date: "July 22, 2026",
        location: "TopGolf, Los Angeles",
      },
    ],
    gallery: [
      { src: "/images/gallery/leadership-group.jpg", alt: "Leadership group at TopGolf" },
      { src: "/images/gallery/raffle-winner.jpg", alt: "Raffle winner celebration" },
      { src: "/images/gallery/opening-panel.jpg", alt: "Opening panel discussion" },
      { src: "/images/gallery/event-photo.jpg", alt: "TopGolf event photo" },
    ],
  },
  mentorship: {
    title: "Mentorship Program",
    tagline: "Guidance that transforms",
    description:
      "One-on-one and group mentoring with successful professionals.",
    longDescription:
      "The Mentorship Program is the heart of A New Day Foundation. We carefully match young people with experienced professionals who share their interests and career aspirations. Through regular meetings, goal-setting sessions, and real-world exposure, mentees develop the skills and confidence they need to succeed.\n\nOur mentors come from diverse backgrounds — entertainment, technology, business, education, and more — ensuring every participant can find guidance tailored to their dreams.",
    icon: Users,
    color: "from-amber-500 to-orange-600",
    heroImage: "/images/programs/mentorship-session.jpg",
    videoId: "",
    videoTitle: "Mentorship Program Highlights",
    features: [
      "1-on-1 mentor matching",
      "Monthly group sessions",
      "Goal setting & tracking",
      "Professional shadowing",
      "Resume & interview prep",
      "Ongoing support network",
    ],
    outcomes: [
      { stat: "150+", label: "Active Mentees" },
      { stat: "80+", label: "Volunteer Mentors" },
      { stat: "3yr", label: "Avg. Relationship" },
      { stat: "85%", label: "Goal Achievement" },
    ],
    upcomingEvents: [
      {
        title: "Mentor Matching Day",
        date: "September 5, 2026",
        location: "ANDF Headquarters, LA",
      },
    ],
    gallery: [
      { src: "/images/programs/mentorship-session.jpg", alt: "Mentorship session in action" },
      { src: "/images/gallery/dawnn-on-the-move.jpg", alt: "On the move mentorship" },
      { src: "/images/gallery/volunteer-leader.jpg", alt: "Volunteer mentorship leader" },
      { src: "/images/gallery/scholarship-recipient.jpg", alt: "Scholarship recipient celebration" },
    ],
  },
  "hbcu-heroes": {
    title: "HBCU Heroes",
    tagline: "Celebrating excellence",
    description:
      "Spotlighting the achievements of Historically Black Colleges and Universities.",
    longDescription:
      "HBCU Heroes shines a spotlight on the incredible impact and legacy of Historically Black Colleges and Universities. Through speaker series, campus connections, and scholarship information sessions, we inspire young people to consider the unique opportunities HBCUs offer.\n\nThis program features alumni who have gone on to remarkable careers, providing living proof of the HBCU impact. From virtual summits to in-person campus visits, HBCU Heroes opens doors to higher education excellence.",
    icon: GraduationCap,
    logo: "/images/partners/hbcu-heroes.jpg",
    color: "from-primary-500 to-primary-700",
    heroImage: "/images/gallery/omega-psi-phi.jpg",
    videoId: "",
    videoTitle: "HBCU Heroes Highlights",
    features: [
      "Alumni speaker series",
      "Virtual campus tours",
      "Scholarship guidance",
      "Application workshops",
      "Alumni networking",
      "Cultural celebrations",
    ],
    outcomes: [
      { stat: "20+", label: "HBCUs Featured" },
      { stat: "400+", label: "Students Reached" },
      { stat: "$50K+", label: "Scholarships Connected" },
      { stat: "10", label: "Campus Visits" },
    ],
    upcomingEvents: [
      {
        title: "HBCU Heroes Virtual Summit",
        date: "August 12, 2026",
        location: "Virtual Event",
      },
    ],
    gallery: [
      { src: "/images/gallery/omega-psi-phi.jpg", alt: "Omega Psi Phi fraternity members" },
      { src: "/images/gallery/zeta-phi-beta.jpg", alt: "Zeta Phi Beta sorority members" },
      { src: "/images/gallery/dawnn-zeta-sorors.jpg", alt: "Dawnn with Zeta sorors" },
      { src: "/images/gallery/fnf-scholarship-2024.jpg", alt: "FNF Scholarship recipients 2024" },
      { src: "/images/gallery/scholarship-recipient.jpg", alt: "Scholarship recipient" },
      { src: "/images/gallery/fnf-group-lineup.jpg", alt: "Group lineup photo" },
    ],
  },
  mentors: {
    title: "MenTORS",
    tagline: "Men Talking Of Relevant Situations",
    description:
      "Real conversations, real growth, real mentorship for men.",
    longDescription:
      "MenTORS — Men Talking Of Relevant Situations — is a mentoring initiative that creates a safe, honest space for men to discuss the challenges they face in life, career, and community. Through guided group discussions and one-on-one pairings, participants build the tools they need to navigate real-world situations with confidence and integrity.\n\nFrom financial literacy and career development to emotional wellness and fatherhood, MenTORS covers the topics that matter most. Our facilitators and mentors bring lived experience and professional expertise to every session.",
    icon: MessageCircle,
    logo: "/images/partners/mentors.jpg",
    color: "from-red-500 to-rose-600",
    heroImage: "/images/gallery/dawnn-steve-wesson.jpg",
    videoId: "",
    videoTitle: "MenTORS Highlights",
    features: [
      "Facilitated group discussions",
      "One-on-one mentor pairing",
      "Financial literacy workshops",
      "Career development sessions",
      "Emotional wellness support",
      "Community networking",
    ],
    outcomes: [
      { stat: "100+", label: "Men Mentored" },
      { stat: "24", label: "Sessions Per Year" },
      { stat: "90%", label: "Return Rate" },
      { stat: "40+", label: "Active Mentors" },
    ],
    upcomingEvents: [
      {
        title: "MenTORS Monthly Meetup",
        date: "May 10, 2026",
        location: "ANDF Community Center, LA",
      },
    ],
    gallery: [
      { src: "/images/gallery/dawnn-steve-wesson.jpg", alt: "Dawnn with Steve Wesson" },
      { src: "/images/gallery/volunteer-leader.jpg", alt: "Volunteer leader" },
      { src: "/images/gallery/opening-panel.jpg", alt: "Panel discussion" },
      { src: "/images/gallery/leadership-group.jpg", alt: "Leadership group" },
    ],
  },
  "sisters-hangout": {
    title: "Sisters Hangout",
    tagline: "Empowering young women together",
    description:
      "A supportive space for young women to connect, grow, and lead.",
    longDescription:
      "Sisters Hangout is a program designed to uplift, empower, and connect young women through meaningful experiences and honest conversations. In a supportive and judgment-free environment, participants explore topics like self-confidence, leadership, wellness, and career exploration.\n\nThrough peer mentoring, creative workshops, and community service projects, Sisters Hangout builds a sisterhood that extends far beyond program hours. Our goal is for every young woman to leave knowing her voice matters and her potential is limitless.",
    icon: Heart,
    logo: "/images/partners/sisters.jpg",
    color: "from-rose-700 to-red-900",
    heroImage: "/images/gallery/dawnn-zeta-sorors.jpg",
    videoId: "",
    videoTitle: "Sisters Hangout Highlights",
    features: [
      "Peer mentoring circles",
      "Leadership development",
      "Creative expression workshops",
      "Wellness and self-care",
      "Community service projects",
      "College & career prep",
    ],
    outcomes: [
      { stat: "120+", label: "Young Women Served" },
      { stat: "18", label: "Workshops Per Year" },
      { stat: "95%", label: "Confidence Growth" },
      { stat: "30+", label: "Volunteer Mentors" },
    ],
    upcomingEvents: [
      {
        title: "Sisters Hangout Summer Kickoff",
        date: "June 8, 2026",
        location: "ANDF Center, LA",
      },
    ],
    gallery: [
      { src: "/images/gallery/dawnn-zeta-sorors.jpg", alt: "Dawnn with Zeta sorors" },
      { src: "/images/gallery/siedah-garrett-dawnn.jpg", alt: "Siedah Garrett with Dawnn" },
      { src: "/images/gallery/zeta-phi-beta.jpg", alt: "Zeta Phi Beta gathering" },
      { src: "/images/gallery/scholarship-recipient.jpg", alt: "Scholarship recipient" },
      { src: "/images/gallery/raffle-winner.jpg", alt: "Event raffle winner" },
    ],
  },
};

/* ─────────────────────────────────────────────── */
/*  Lightbox component                             */
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
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-10"
        aria-label="Close"
      >
        <X className="h-8 w-8" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-8 text-white/70 hover:text-white p-2 z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="h-10 w-10" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-8 text-white/70 hover:text-white p-2 z-10"
        aria-label="Next"
      >
        <ChevronRight className="h-10 w-10" />
      </button>

      <motion.div
        key={currentIndex}
        className="relative w-[90vw] h-[70vh] max-w-5xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </motion.div>

      <div className="absolute bottom-6 text-white/60 text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────── */
/*  Video Player Section                           */
/* ─────────────────────────────────────────────── */

function VideoSection({
  videoId,
  videoTitle,
  heroImage,
  color,
}: {
  videoId?: string;
  videoTitle?: string;
  heroImage?: string;
  color: string;
}) {
  const [playing, setPlaying] = useState(false);

  // If there's a YouTube video ID, show the embed player
  if (videoId && playing) {
    return (
      <SectionWrapper className="py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">
            {videoTitle || "Watch the Highlights"}
          </h2>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-neutral-900">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={videoTitle || "Program Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Show thumbnail with play button
  return (
    <SectionWrapper className="py-16 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl font-bold text-foreground mb-6">
          {videoTitle || "Watch the Highlights"}
        </h2>
        <div
          className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
          onClick={() => videoId && setPlaying(true)}
        >
          {heroImage ? (
            <Image
              src={heroImage}
              alt={videoTitle || "Program video thumbnail"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 1024px"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-secondary-500 flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="h-8 w-8 md:h-10 md:w-10 text-white ml-1" fill="white" />
            </motion.div>
          </div>

          {/* Video label */}
          {!videoId && (
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <span className="text-white/90 text-sm bg-black/50 px-4 py-2 rounded-full">
                Video coming soon
              </span>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────── */
/*  Photo Gallery Section                          */
/* ─────────────────────────────────────────────── */

function GallerySection({
  gallery,
  programTitle,
}: {
  gallery: { src: string; alt: string }[];
  programTitle: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (gallery.length === 0) return null;

  return (
    <>
      <SectionWrapper className="py-16 px-6 bg-primary-50/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
              Moments that matter
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground mt-2">
              {programTitle} in Pictures
            </h2>
          </div>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {gallery.map((photo, i) => {
              // Make the first and fourth images span 2 rows for visual interest
              const isLarge = i === 0 || i === 3;
              return (
                <motion.div
                  key={photo.src}
                  className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                    isLarge ? "row-span-2 aspect-[3/4]" : "aspect-[4/3]"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
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
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs bg-black/50 px-3 py-1.5 rounded-full line-clamp-1">
                      {photo.alt}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={gallery}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() =>
              setLightboxIndex((prev) =>
                prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0
              )
            }
            onNext={() =>
              setLightboxIndex((prev) =>
                prev !== null ? (prev + 1) % gallery.length : 0
              )
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────────── */
/*  Main Page                                      */
/* ─────────────────────────────────────────────── */

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const program = programsData[slug];

  if (!program) {
    return (
      <div className="pt-32 pb-24 px-6 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Program Not Found
        </h1>
        <Link
          href="/programs"
          className="text-primary-500 mt-4 inline-block"
        >
          Back to Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-0">
      {/* ── Hero with full-bleed image ── */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        {program.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={program.heroImage}
              alt={program.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>
        )}
        {!program.heroImage && (
          <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-90`} />
        )}

        <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-36">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> All Programs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-4">
              {program.logo ? (
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm shrink-0 border border-white/10">
                  <Image
                    src={program.logo}
                    alt={`${program.title} logo`}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <program.icon className="h-7 w-7 text-white" />
                </div>
              )}
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-400">
                {program.tagline}
              </span>
            </div>
            <h1 className="font-display text-5xl lg:text-7xl font-bold text-white">
              {program.title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              {program.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href={`/programs/${slug}/apply`}>
                <Button variant="primary" size="lg">
                  <ArrowRight className="h-4 w-4" /> Apply Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Heart className="h-4 w-4" /> Get Involved
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Impact Stats Bar ── */}
      <section className="bg-primary-600 py-8 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {program.outcomes.map((outcome) => (
              <motion.div
                key={outcome.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-white">
                  {outcome.stat}
                </div>
                <div className="text-sm text-primary-100 mt-1">
                  {outcome.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Video ── */}
      <VideoSection
        videoId={program.videoId}
        videoTitle={program.videoTitle}
        heroImage={program.heroImage}
        color={program.color}
      />

      {/* ── About + Features ── */}
      <SectionWrapper className="py-20 px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
              About the program
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground">
              What Makes {program.title} Special
            </h2>
            {program.longDescription.split("\n\n").map((p, i) => (
              <p
                key={i}
                className="text-foreground-muted leading-relaxed text-lg"
              >
                {p}
              </p>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-background-card border border-border p-6 space-y-5 sticky top-28">
              <h3 className="font-display font-semibold text-foreground text-lg">
                What&apos;s Included
              </h3>
              <ul className="space-y-3">
                {program.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-foreground-muted"
                  >
                    <CheckCircle2 className="h-5 w-5 text-accent-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <BrandDivider className="!my-4" />
              <Link href={`/programs/${slug}/apply`} className="block">
                <Button variant="primary" className="w-full">
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Photo Gallery ── */}
      <GallerySection gallery={program.gallery} programTitle={program.title} />

      {/* ── Upcoming Events ── */}
      {program.upcomingEvents.length > 0 && (
        <SectionWrapper className="py-16 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
                Mark your calendar
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground mt-2">
                Upcoming Events
              </h2>
            </div>
            <div className="space-y-4">
              {program.upcomingEvents.map((event) => (
                <motion.div
                  key={event.title}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-background-card border border-border hover:border-primary-200 hover:shadow-md transition-all"
                  whileHover={{ y: -2 }}
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-lg">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-foreground-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary-500" />{" "}
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary-500" />{" "}
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <Link href="/events" className="mt-3 sm:mt-0">
                    <Button variant="outline" size="sm">
                      Register <ArrowRight className="h-4 w-4" />
                    </Button>
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
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
            Ready to Make a Difference?
          </h2>
          <p className="text-white/90 text-lg">
            Join {program.title} and be part of something transformative.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/contact">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-secondary-600 hover:bg-white/90"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/donate">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Heart className="h-4 w-4" /> Donate
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
