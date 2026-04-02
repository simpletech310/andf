"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Music, Cpu, Target, Users, GraduationCap, Heart,
  MessageCircle, CheckCircle2, Sparkles, Star, Zap, Play
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { SectionWrapper, StaggerChildren, StaggerItem } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";

/* ─── Data ─────────────────────────────────────────────────────────── */

const programs = [
  {
    slug: "band-camp",
    title: "Band Camp",
    tagline: "Music that moves the soul",
    description: "An immersive musical experience where young people discover their rhythm, build confidence through performance, and connect with professional musicians. From instruments to vocals, our camp covers it all.",
    icon: Music,
    color: "from-violet-500 to-purple-600",
    bgAccent: "bg-violet-50",
    heroImage: "/images/programs/engaged-students.jpg",
    features: ["Professional instruction", "Ensemble workshops", "Live performance", "Instrument access"],
    stat: { value: "500+", label: "Students Trained" },
  },
  {
    slug: "drone-experience",
    title: "Drone Experience",
    tagline: "Sky's not the limit",
    description: "Hands-on drone piloting and aerial photography workshops that introduce youth to cutting-edge technology and career opportunities in STEM fields.",
    icon: Cpu,
    color: "from-cyan-500 to-blue-600",
    bgAccent: "bg-cyan-50",
    heroImage: "/images/programs/drone-teach.jpg",
    features: ["Flight training", "Aerial photography", "STEM career paths", "FAA certification prep"],
    stat: { value: "200+", label: "Pilots Trained" },
  },
  {
    slug: "topgolf",
    title: "TopGolf Experience",
    tagline: "Driving success forward",
    description: "A unique blend of sports, networking, and mentorship in an exciting environment that teaches teamwork, builds lasting connections, and develops leadership skills.",
    icon: Target,
    color: "from-emerald-500 to-green-600",
    bgAccent: "bg-emerald-50",
    heroImage: "/images/gallery/leadership-group.jpg",
    features: ["Golf instruction", "Networking events", "Team building", "Leadership development"],
    stat: { value: "300+", label: "Participants" },
  },
  {
    slug: "mentors",
    title: "MenTORS",
    tagline: "Men Talking Of Relevant Situations",
    description: "A mentoring initiative where men come together to discuss real-life challenges, career development, and personal growth — creating a safe space for honest conversation and meaningful guidance.",
    icon: MessageCircle,
    color: "from-red-500 to-rose-600",
    bgAccent: "bg-red-50",
    heroImage: "/images/gallery/dawnn-steve-wesson.jpg",
    features: ["Group discussions", "Real-talk sessions", "Career mentoring", "Personal development"],
    stat: { value: "100+", label: "Men Mentored" },
  },
  {
    slug: "sisters-hangout",
    title: "Sisters Hangout",
    tagline: "Empowering young women together",
    description: "A supportive space for young women to connect, share experiences, and build confidence through workshops, peer mentoring, and community activities that celebrate sisterhood and strength.",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    bgAccent: "bg-pink-50",
    heroImage: "/images/gallery/dawnn-zeta-sorors.jpg",
    features: ["Peer mentoring", "Leadership workshops", "Community building", "Wellness activities"],
    stat: { value: "120+", label: "Young Women Served" },
  },
  {
    slug: "mentorship",
    title: "Mentorship Program",
    tagline: "Guidance that transforms",
    description: "One-on-one and group mentoring with successful professionals who provide guidance, support, and real-world insight to shape future leaders in every field.",
    icon: Users,
    color: "from-amber-500 to-orange-600",
    bgAccent: "bg-amber-50",
    heroImage: "/images/programs/mentorship-session.jpg",
    features: ["1-on-1 mentoring", "Group sessions", "Professional networking", "Career guidance"],
    stat: { value: "150+", label: "Active Mentees" },
  },
  {
    slug: "hbcu-heroes",
    title: "HBCU Heroes",
    tagline: "Celebrating excellence",
    description: "Spotlighting the achievements and impact of Historically Black Colleges and Universities, inspiring the next generation of scholars, leaders, and change-makers.",
    icon: GraduationCap,
    color: "from-primary-500 to-primary-700",
    bgAccent: "bg-primary-50",
    heroImage: "/images/gallery/omega-psi-phi.jpg",
    features: ["Campus tours", "Speaker series", "Scholarship info", "Alumni connections"],
    stat: { value: "400+", label: "Students Reached" },
  },
];

const partners = [
  { name: "Google", logo: "/images/partners/google.png" },
  { name: "PepsiCo", logo: "/images/partners/pepsico.png" },
  { name: "LA Lakers", logo: "/images/partners/la-lakers.png" },
  { name: "LA Dodgers", logo: "/images/partners/la-dodgers.png" },
  { name: "New Balance", logo: "/images/partners/new-balance.png" },
  { name: "UPS", logo: "/images/partners/ups.png" },
  { name: "Xerox", logo: "/images/partners/xerox.png" },
  { name: "MSNBC", logo: "/images/partners/msnbc.png" },
  { name: "Thrivent", logo: "/images/partners/thrivent.png" },
  { name: "LMU", logo: "/images/partners/lmu.png" },
  { name: "Coca-Cola", logo: "/images/partners/coca-cola.jpg" },
  { name: "Herbalife", logo: "/images/partners/herbalife.jpg" },
  { name: "USC", logo: "/images/partners/usc.jpg" },
  { name: "Activision", logo: "/images/partners/activision.jpg" },
  { name: "US Bank", logo: "/images/partners/us-bank.jpg" },
  { name: "Junior Achievement", logo: "/images/partners/junior-achievement.jpg" },
  { name: "National Geographic", logo: "/images/partners/national-geographic.jpg" },
  { name: "Focused N FIT", logo: "/images/partners/fnf-partner.jpg" },
  { name: "TopGolf", logo: "/images/partners/top-golf.jpg" },
  { name: "Frost Equity Initiative", logo: "/images/partners/frost-equity.jpg" },
  { name: "CSL", logo: "/images/partners/csl.png" },
  { name: "FMS", logo: "/images/partners/fms.png" },
  { name: "Donald Driver", logo: "/images/partners/donald-driver.jpg" },
  { name: "Hello Beautiful", logo: "/images/partners/hello-beautiful.jpg" },
];

const impactStats = [
  { value: "2,000+", label: "Youth Served", icon: Users },
  { value: "7", label: "Active Programs", icon: Zap },
  { value: "50+", label: "Corporate Partners", icon: Star },
  { value: "100%", label: "Free to Attend", icon: Heart },
];

const testimonials = [
  {
    quote: "Band Camp changed my daughter's life. She went from shy to performing on stage in front of hundreds of people.",
    name: "Parent of Band Camp participant",
    program: "Band Camp",
  },
  {
    quote: "I never thought I'd be flying drones or thinking about a career in tech. ANDF opened doors I didn't know existed.",
    name: "Drone Experience participant",
    program: "Drone Experience",
  },
  {
    quote: "The mentors here don't just talk — they listen. That's what makes MenTORS different from anything else out there.",
    name: "MenTORS participant",
    program: "MenTORS",
  },
];

/* ─── Sub-Components ───────────────────────────────────────────────── */

function ProgramCard({ program, index }: { program: typeof programs[0]; index: number }) {
  const isEven = index % 2 === 0;
  const Icon = program.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Link href={`/programs/${program.slug}`} className="block group">
        <div className={`relative flex flex-col lg:flex-row rounded-3xl overflow-hidden bg-white border border-neutral-200 group-hover:border-primary-300 group-hover:shadow-2xl transition-all duration-500 ${!isEven ? "lg:flex-row-reverse" : ""}`}>
          {/* Image side */}
          <div className="lg:w-[45%] aspect-[16/10] lg:aspect-auto relative overflow-hidden">
            <Image
              src={program.heroImage}
              alt={program.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Floating stat badge */}
            <div className={`absolute bottom-5 ${isEven ? "left-5" : "right-5"}`}>
              <div className="bg-white/95 backdrop-blur-md rounded-xl px-5 py-3 shadow-lg">
                <div className="text-3xl font-extrabold text-primary-500 leading-none">{program.stat.value}</div>
                <div className="text-[11px] text-neutral-500 font-semibold mt-0.5">{program.stat.label}</div>
              </div>
            </div>

            {/* Play hint overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="h-16 w-16 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <ArrowRight className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          {/* Content side */}
          <div className="lg:w-[55%] flex flex-col justify-center p-8 lg:p-12 space-y-5">
            {/* Icon + tagline */}
            <div className="flex items-center gap-3">
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center shrink-0 shadow-sm`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground-muted">
                {program.tagline}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary-500 transition-colors leading-tight">
              {program.title}
            </h3>

            {/* Description */}
            <p className="text-foreground-muted leading-relaxed text-[15px]">
              {program.description}
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-1">
              {program.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 text-sm text-foreground-muted">
                  <CheckCircle2 className="h-4 w-4 text-secondary-500 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-primary-500 font-bold text-sm group-hover:gap-3 transition-all duration-300">
                Explore Program
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="absolute -top-3 left-6 h-6 w-6 rounded-full bg-secondary-500 flex items-center justify-center">
        <span className="text-white text-xs font-bold">&ldquo;</span>
      </div>
      <p className="text-foreground leading-relaxed italic mt-2">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-4 pt-4 border-t border-neutral-100">
        <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
        <p className="text-xs text-primary-500 font-medium">{testimonial.program}</p>
      </div>
    </motion.div>
  );
}

function ScrollingPartners() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="mt-14 overflow-hidden">
      {/* Row 1 — scroll right */}
      <motion.div
        className="flex gap-4 mb-4"
        animate={isInView ? { x: [0, -1200] } : {}}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...partners, ...partners].map((partner, i) => (
          <div
            key={`r1-${i}`}
            className="shrink-0 w-[140px] h-[80px] rounded-xl bg-white border border-neutral-200 overflow-hidden group hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="relative w-full h-full">
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain p-3 grayscale group-hover:grayscale-0 transition-all duration-300"
                sizes="140px"
              />
            </div>
          </div>
        ))}
      </motion.div>
      {/* Row 2 — scroll left */}
      <motion.div
        className="flex gap-4"
        animate={isInView ? { x: [-1200, 0] } : {}}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        {[...partners.slice(12), ...partners.slice(0, 12), ...partners].map((partner, i) => (
          <div
            key={`r2-${i}`}
            className="shrink-0 w-[140px] h-[80px] rounded-xl bg-white border border-neutral-200 overflow-hidden group hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="relative w-full h-full">
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain p-3 grayscale group-hover:grayscale-0 transition-all duration-300"
                sizes="140px"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function ProgramsPage() {
  return (
    <div className="pb-0">

      {/* ───── 1. HERO — Full-bleed cinematic ───── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/community-group.jpg"
            alt="ANDF programs community"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-32 lg:py-40 text-center space-y-6">
          <motion.span
            className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-secondary-400 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            7 Programs &bull; 100% Free &bull; All Ages Welcome
          </motion.span>
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Programs That
            <br />
            <span className="text-secondary-400">Change Lives</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            From music studios to drone fields, mentorship circles to college tours —
            every program is designed to unlock potential and build the leaders of tomorrow.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <a href="#programs">
              <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-white/90">
                Explore Programs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <Sparkles className="h-4 w-4" />
                Get Involved
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ───── 2. IMPACT STATS BAR ───── */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 py-10 px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/15 mb-3">
                <stat.icon className="h-5 w-5 text-white/90" />
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-white">{stat.value}</div>
              <div className="text-sm text-primary-100 mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───── 3. WHY OUR PROGRAMS ───── */}
      <SectionWrapper className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Why Choose ANDF"
            title="More Than Just Programs"
            description="Every experience we create is built on a foundation of mentorship, community, and real-world impact."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "Hands-On Learning",
                desc: "No textbooks, no lectures. Our programs put young people in the driver's seat — flying drones, playing instruments, and building real skills.",
                color: "from-violet-500 to-purple-600",
              },
              {
                icon: Users,
                title: "Mentorship at the Core",
                desc: "Every program pairs youth with experienced professionals who invest personally in their growth, confidence, and career development.",
                color: "from-secondary-400 to-secondary-600",
              },
              {
                icon: Heart,
                title: "Always Free",
                desc: "Cost should never be a barrier. All ANDF programs are completely free — including materials, meals, and resources.",
                color: "from-primary-500 to-primary-700",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="group p-8 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-xl transition-all duration-500 text-center"
                whileHover={{ y: -6 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className={`mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-foreground-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ───── 4. PROGRAM CARDS ───── */}
      <section id="programs" className="py-8 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary-500 mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Our Programs
            </motion.span>
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Find Your Path
            </motion.h2>
          </div>
          <div className="space-y-10">
            {programs.map((program, i) => (
              <ProgramCard key={program.slug} program={program} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── 5. TESTIMONIALS ───── */}
      <SectionWrapper className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Real Stories"
            title="Hear From Our Community"
            description="The impact of our programs is best told by the people who experience them."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ───── 6. INLINE CTA ───── */}
      <section className="py-20 px-6 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
        <motion.div
          className="mx-auto max-w-3xl text-center relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to Start
            <br />
            <span className="text-secondary-400">Your Journey?</span>
          </h2>
          <p className="text-white/80 text-lg mt-6 max-w-xl mx-auto">
            Every program is free and open to all young people. No experience needed —
            just bring your curiosity and we&apos;ll bring the rest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-white/90 shadow-xl">
                Sign Up Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                View Upcoming Events
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ───── 7. PARTNERS — Scrolling marquee ───── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Our Partners"
            title="Powered by Partnership"
            description="We collaborate with world-class organizations that share our vision of empowering youth and building stronger communities."
          />
          <ScrollingPartners />
          <p className="text-center text-sm text-foreground-muted mt-10">
            And many more organizations supporting our mission to empower youth.
          </p>
        </div>
      </section>

      {/* ───── 8. BOTTOM CTA ───── */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/fnf-group-lineup.jpg"
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
            Become a Partner
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Invest in the
            <br />
            Next Generation
          </h2>
          <p className="text-white/80 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
            Join Google, PepsiCo, the LA Lakers, and 50+ other organizations in creating
            transformative experiences for young people across the country.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="bg-white text-secondary-600 hover:bg-white/90 shadow-xl">
                Partner With Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <Heart className="h-4 w-4" /> Support Our Programs
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
