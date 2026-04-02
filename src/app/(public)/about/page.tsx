"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Heart, Sparkles,
  Users, Award, Rocket, Globe, Target, Quote, Star, CheckCircle2
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { SectionWrapper, StaggerChildren, StaggerItem } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";

/* ─── Data ─────────────────────────────────────────────────────────── */

const timeline = [
  { year: "2018", title: "Founded", description: "A New Day Foundation was established with a vision to empower youth through innovative programs.", image: "/images/team/dawnn-lewis.jpg", color: "from-primary-500 to-primary-600", stat: "Day 1" },
  { year: "2019", title: "First Programs", description: "Launched Band Camp and the Mentorship Program, serving over 100 young people in the first year.", image: "/images/programs/engaged-students.jpg", color: "from-violet-500 to-purple-600", stat: "100+ Youth" },
  { year: "2020", title: "Digital Expansion", description: "Pivoted to virtual programming, reaching youth across the country during challenging times.", image: "/images/gallery/knowledj-teaches.jpg", color: "from-cyan-500 to-blue-600", stat: "Nationwide" },
  { year: "2021", title: "Growing Impact", description: "Introduced the Drone Experience and TopGolf programs, expanding our reach and offerings.", image: "/images/programs/drone-teach.jpg", color: "from-emerald-500 to-green-600", stat: "5 Programs" },
  { year: "2022", title: "HBCU Heroes", description: "Launched the HBCU Heroes initiative to celebrate and connect youth with HBCUs.", image: "/images/gallery/omega-psi-phi.jpg", color: "from-amber-500 to-orange-600", stat: "400+ Students" },
  { year: "2023", title: "Community Growth", description: "Reached 1,500+ youth served milestone with expanded partnerships and corporate sponsorships.", image: "/images/gallery/leadership-group.jpg", color: "from-rose-500 to-red-600", stat: "1,500+ Youth" },
  { year: "2024", title: "National Recognition", description: "Gained national recognition for our innovative approach to youth empowerment and mentorship.", image: "/images/gallery/siedah-garrett-dawnn.jpg", color: "from-yellow-500 to-amber-600", stat: "Award-Winning" },
  { year: "2025", title: "Expansion Year", description: "Expanded operations with Band Camps, Drone Experiences, TopGolf events, and mentorship programs reaching more communities than ever.", image: "/images/gallery/fnf-group-lineup.jpg", color: "from-secondary-400 to-secondary-600", stat: "2,000+ Youth" },
  { year: "2026", title: "New Horizons", description: "Entering a bold new chapter — scaling proven programs to new cities, deepening partnerships, and building the next generation of leaders.", image: "/images/hero/community-group.jpg", color: "from-primary-400 to-primary-700", stat: "New Cities" },
];

const boardMembers = [
  { name: "Dawnn Lewis", title: "Founder & Board Chair", image: "/images/team/dawnn-lewis.jpg" },
  { name: "Arnold Hackett", title: "Board Member", image: "/images/team/arnold-hackett.jpg" },
  { name: "Cheri Haft", title: "Board Member", image: "/images/team/cheri-haft.jpg" },
  { name: "Adriane Lamar Snider", title: "Board Member", image: "/images/team/adriane-lamar-snider.jpg" },
  { name: "George Gibbs", title: "Board Member", image: "/images/team/george-gibbs.jpg" },
  { name: "Scott McGregor", title: "Board Member", image: "/images/team/scott-mcgregor.jpg" },
  { name: "Claire Padmore Clarke", title: "Board Member", image: "/images/team/claire-padmore-clarke.jpg" },
];

const staffMembers = [
  { name: "Rami", title: "Operations", image: "/images/team/rami.jpg" },
  { name: "Christy Zhou", title: "Programs", image: "/images/team/christy-zhou.jpg" },
  { name: "Chuck Webb", title: "Community", image: "/images/team/chuck-webb.jpg" },
  { name: "Sheila Gilmore", title: "Outreach", image: "/images/team/sheila-gilmore.jpg" },
];

const impactStats = [
  { value: "2,000+", label: "Youth Served", icon: Users },
  { value: "7", label: "Active Programs", icon: Target },
  { value: "100+", label: "Mentors & Volunteers", icon: Heart },
  { value: "50+", label: "Corporate Partners", icon: Star },
];

const coreValues = [
  { title: "Empowerment", description: "Giving young people the tools and confidence to shape their own futures.", icon: Rocket },
  { title: "Community", description: "Building lasting bonds between mentors, families, and youth that uplift everyone.", icon: Users },
  { title: "Innovation", description: "Using music, technology, and creative programming to unlock potential in fresh ways.", icon: Sparkles },
  { title: "Excellence", description: "Setting the highest standard in everything we do, from band camp to boardroom.", icon: Award },
];

const photoHighlights = [
  { src: "/images/gallery/leadership-group.jpg", alt: "Leadership group at ANDF event" },
  { src: "/images/gallery/fnf-group-lineup.jpg", alt: "Focused N FIT group lineup" },
  { src: "/images/gallery/scholarship-recipient.jpg", alt: "Scholarship recipient celebration" },
  { src: "/images/gallery/nasa-team-teaches.jpg", alt: "NASA team teaching session" },
  { src: "/images/programs/engaged-students.jpg", alt: "Engaged students at band camp" },
  { src: "/images/gallery/siedah-garrett-dawnn.jpg", alt: "Siedah Garrett and Dawnn Lewis" },
  { src: "/images/gallery/dawnn-steve-wesson.jpg", alt: "Dawnn Lewis with Steve Wesson" },
  { src: "/images/gallery/opening-panel.jpg", alt: "Opening panel discussion" },
  { src: "/images/gallery/volunteer-leader.jpg", alt: "Volunteer leader in action" },
  { src: "/images/gallery/dawnn-zeta-sorors.jpg", alt: "Dawnn with Zeta Phi Beta sorors" },
  { src: "/images/gallery/swat-experience.jpg", alt: "SWAT experience program" },
  { src: "/images/gallery/raffle-winner.jpg", alt: "Raffle winner celebration" },
];

/* ─── Sub-Components ───────────────────────────────────────────────── */

function TeamMemberCard({ name, title, image, featured }: { name: string; title: string; image: string; featured?: boolean }) {
  return (
    <motion.div
      className="group text-center"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative mx-auto rounded-2xl overflow-hidden border-2 transition-all duration-500 mb-4 shadow-sm group-hover:shadow-xl ${
        featured
          ? "w-40 h-40 sm:w-48 sm:h-48 border-secondary-400 group-hover:border-secondary-500"
          : "w-36 h-36 sm:w-44 sm:h-44 border-neutral-200 group-hover:border-primary-400"
      }`}>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="192px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {featured && (
          <div className="absolute top-2 right-2 bg-secondary-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Founder
          </div>
        )}
      </div>
      <h3 className={`font-semibold group-hover:text-primary-500 transition-colors ${featured ? "text-lg text-foreground" : "text-foreground"}`}>{name}</h3>
      <p className="text-sm text-foreground-muted">{title}</p>
    </motion.div>
  );
}

function AnimatedCounter({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="text-center group">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/15 mb-3 group-hover:bg-white/25 transition-colors">
        <Icon className="h-5 w-5 text-white/90" />
      </div>
      <div className="text-3xl md:text-4xl font-extrabold text-white">{value}</div>
      <div className="text-sm text-primary-100 mt-1 font-medium">{label}</div>
    </div>
  );
}

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative">
      {/* Central line */}
      <motion.div
        className="absolute left-6 sm:left-8 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-primary-500 via-secondary-400 to-primary-500"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ transformOrigin: "top" }}
      />

      <div className="space-y-6 lg:space-y-10">
        {timeline.map((item, i) => {
          const isLeft = i % 2 === 0;

          return (
            <motion.div
              key={item.year}
              className={`relative flex items-start ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: "easeOut" }}
            >
              {/* Desktop: Content card */}
              <div className={`hidden lg:flex w-[44%] ${isLeft ? "justify-end pr-12" : "justify-start pl-12"}`}>
                <div className="group relative max-w-md w-full">
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-lg hover:border-primary-300 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${item.color} text-white text-xs font-bold`}>
                        {item.year}
                      </div>
                      <span className="text-xs font-semibold text-secondary-500">{item.stat}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary-500 transition-colors">{item.title}</h3>
                    <p className="text-sm text-foreground-muted mt-2 leading-relaxed">{item.description}</p>
                  </div>
                  <div className={`absolute top-8 ${isLeft ? "-right-[7px]" : "-left-[7px]"} w-3 h-3 bg-white border-r border-b border-neutral-200`}
                    style={{ transform: isLeft ? "rotate(-45deg)" : "rotate(135deg)" }}
                  />
                </div>
              </div>

              {/* Center photo circle */}
              <div className="absolute left-6 sm:left-8 lg:left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  className="h-12 w-12 lg:h-16 lg:w-16 rounded-full overflow-hidden shadow-lg ring-[3px] ring-white"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.4, type: "spring", stiffness: 200 }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20`} />
                  </div>
                </motion.div>
              </div>

              {/* Desktop: empty space (no year numbers) */}
              <div className={`hidden lg:block w-[44%]`} />

              {/* Mobile: Content */}
              <div className="lg:hidden pl-18 sm:pl-20 pr-4 pb-2">
                <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${item.color} text-white text-[11px] font-bold`}>
                      {item.year}
                    </div>
                    <span className="text-[11px] font-semibold text-secondary-500">{item.stat}</span>
                  </div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-foreground-muted mt-1.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* End cap */}
      <motion.div
        className="absolute left-6 sm:left-8 lg:left-1/2 -translate-x-1/2 -bottom-4 z-10"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: 1.8, duration: 0.4, type: "spring" }}
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-lg ring-4 ring-white">
          <Heart className="h-3.5 w-3.5 text-white fill-white" />
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div className="pb-0">

      {/* ───── 1. HERO — Cinematic full-bleed ───── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/community-group.jpg"
            alt="A New Day Foundation community"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-32 lg:py-44 text-center space-y-6">
          <motion.span
            className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-secondary-400 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Est. 2018 &bull; Los Angeles, CA
          </motion.span>
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Empowering Youth.
            <br />
            <span className="text-brand-gradient">Transforming Lives.</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            A New Day Foundation creates transformative experiences for young people through
            music, technology, mentorship, and community — shaping the future, one life at a time.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Link href="/programs">
              <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-white/90">
                Explore Our Programs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="donate" size="lg">
                <Heart className="h-4 w-4" />
                Support Our Mission
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <AnimatedCounter {...stat} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───── 3. MISSION, VISION & VALUES ───── */}
      <SectionWrapper className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Why We Exist"
            title="Our Mission & Vision"
          />

          {/* Mission & Vision cards */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="relative p-8 rounded-2xl bg-white border border-neutral-200 space-y-4 hover:shadow-xl transition-all duration-500 overflow-hidden group"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400" />
              <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary-500" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Our Mission</span>
              <h3 className="text-2xl font-bold text-foreground">Empowering Tomorrow&apos;s Leaders</h3>
              <p className="text-foreground-muted leading-relaxed">
                To create transformative experiences that empower young people with the skills,
                confidence, and connections they need to become leaders in their communities and beyond.
              </p>
            </motion.div>
            <motion.div
              className="relative p-8 rounded-2xl bg-white border border-neutral-200 space-y-4 hover:shadow-xl transition-all duration-500 overflow-hidden group"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-400 to-secondary-500" />
              <div className="h-12 w-12 rounded-xl bg-secondary-50 flex items-center justify-center">
                <Globe className="h-6 w-6 text-secondary-500" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-500">Our Vision</span>
              <h3 className="text-2xl font-bold text-foreground">A World of Possibility</h3>
              <p className="text-foreground-muted leading-relaxed">
                A world where every young person has access to mentorship, education, and experiences
                that unlock their potential and inspire them to create positive change.
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <div className="mt-16">
            <h3 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-foreground-muted mb-10">What Drives Us</h3>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value) => (
                <StaggerItem key={value.title}>
                  <motion.div
                    className="p-6 rounded-xl bg-neutral-50 border border-neutral-100 hover:bg-white hover:shadow-md hover:border-primary-200 transition-all duration-300 text-center group"
                    whileHover={{ y: -3 }}
                  >
                    <div className="mx-auto h-11 w-11 rounded-lg bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors duration-300">
                      <value.icon className="h-5 w-5 text-primary-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h4 className="font-bold text-foreground mb-2">{value.title}</h4>
                    <p className="text-sm text-foreground-muted leading-relaxed">{value.description}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </SectionWrapper>

      {/* ───── 4. FOUNDER SPOTLIGHT — Dawnn Lewis ───── */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/30 overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Founder & Visionary"
            title="Meet Dawnn Lewis"
          />
          <motion.div
            className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Portrait with decorative elements */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary-200 via-secondary-200 to-primary-200 opacity-60 blur-sm" />
                <div className="relative w-64 h-80 sm:w-72 sm:h-[420px] rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                  <Image
                    src="/images/team/dawnn-lewis.jpg"
                    alt="Dawnn Lewis"
                    fill
                    className="object-cover"
                    sizes="288px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-secondary-500 text-white rounded-xl px-4 py-2 shadow-lg">
                  <span className="text-xs font-bold uppercase tracking-wider">Since 2018</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground">Dawnn Lewis</h3>
                <p className="text-primary-500 font-semibold text-lg mt-1">Founder &amp; Board Chair</p>
              </div>
              <div className="space-y-4 text-foreground-muted leading-relaxed">
                <p>
                  Dawnn Lewis is an acclaimed actress, singer, songwriter, and voice artist best known for her
                  role as Jaleesa Vinson on the groundbreaking NBC sitcom <em className="text-foreground">A Different World</em> and as the
                  voice of Furiosa in <em className="text-foreground">Mad Max: Fury Road</em>. With a career spanning decades in
                  Hollywood, Dawnn has used her platform to champion education, mentorship, and the
                  arts for young people.
                </p>
                <p>
                  Driven by a deep belief that every child deserves access to transformative experiences,
                  Dawnn founded A New Day Foundation to bridge the gap between opportunity and potential.
                  Her vision: use music, technology, mentorship, and community to ignite the spark in
                  young people — giving them the confidence and skills to lead.
                </p>
                <p>
                  Under Dawnn&apos;s leadership, the Foundation has grown from a grassroots initiative into a
                  nationally recognized organization impacting thousands of youth through programs like
                  Band Camp, Drone Experience, TopGolf mentorship outings, and the HBCU Heroes initiative.
                </p>
              </div>

              {/* Quote */}
              <div className="relative bg-primary-50 rounded-xl p-5 border border-primary-100">
                <Quote className="absolute top-3 left-3 h-8 w-8 text-primary-200" />
                <p className="text-foreground font-medium italic pl-8 text-lg">
                  &ldquo;Every child has a gift. Our job is to help them find it.&rdquo;
                </p>
                <p className="text-sm text-primary-500 font-semibold mt-2 pl-8">— Dawnn Lewis</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── 5. PHOTO MOSAIC — "Impact in Action" ───── */}
      <SectionWrapper className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Impact in Action"
            title="Moments That Matter"
            description="From the classroom to the stage, from the field to the boardroom — our programs create memories and milestones that last a lifetime."
          />
          {/* 4-column mosaic grid — no gaps, all cells filled */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {photoHighlights.map((photo, i) => (
              <motion.div
                key={photo.src}
                className={`relative overflow-hidden rounded-xl group ${
                  i === 0 ? "md:col-span-2 md:row-span-2 aspect-square" :
                  i === 3 ? "md:col-span-2 aspect-[2/1]" :
                  "aspect-[4/3]"
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm font-medium drop-shadow-lg">{photo.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ───── 6. LEADERSHIP — Board & Staff ───── */}
      <section className="py-24 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Leadership"
            title="The People Behind the Mission"
            description="Our board and team bring together leaders from diverse industries united by a passion for empowering the next generation."
          />

          {/* Board */}
          <div className="mt-16">
            <h3 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-10">Board of Directors</h3>
            <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10">
              {boardMembers.map((member, i) => (
                <StaggerItem key={member.name}>
                  <TeamMemberCard {...member} featured={i === 0} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          {/* Divider */}
          <div className="my-16 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
            <div className="h-2 w-2 rounded-full bg-primary-400" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
          </div>

          {/* Staff */}
          <div>
            <h3 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-10">Our Team</h3>
            <StaggerChildren className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-10 max-w-3xl mx-auto">
              {staffMembers.map((member) => (
                <StaggerItem key={member.name}>
                  <TeamMemberCard {...member} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* ───── 7. TIMELINE — Our Journey ───── */}
      <SectionWrapper className="py-24 px-6 bg-gradient-to-b from-white via-primary-50/30 to-white">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            label="Our Journey"
            title="Building Impact, Year by Year"
            description="From humble beginnings to national recognition, our journey has been defined by passion, purpose, and the power of community."
          />
          <div className="mt-20 pb-8">
            <Timeline />
          </div>
        </div>
      </SectionWrapper>

      {/* ───── 8. WHAT MAKES US DIFFERENT ───── */}
      <section className="py-24 px-6 bg-primary-600 relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />

        <div className="mx-auto max-w-5xl relative">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary-200 mb-4">
              What Sets Us Apart
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              More Than a Foundation
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Real-World Experiences", desc: "From drone piloting to studio recording, our programs go beyond the classroom to deliver hands-on, career-shaping experiences." },
              { title: "Celebrity-Led Mentorship", desc: "Founded by Dawnn Lewis, our programs connect youth with professionals from entertainment, tech, sports, and business." },
              { title: "Holistic Approach", desc: "We develop the whole person — building confidence, creativity, technical skills, and community bonds simultaneously." },
              { title: "Proven Track Record", desc: "2,000+ youth served, 7 active programs, and partnerships with Google, PepsiCo, the LA Lakers, and more." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="flex items-start gap-4 p-6 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm hover:bg-white/15 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="shrink-0 mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-secondary-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 9. CTA — Join the Movement ───── */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        {/* Background with overlay */}
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
            Be Part of the Story
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Every Day Is a New Day
            <br />
            <span className="text-white/90">to Make a Difference</span>
          </h2>
          <p className="text-white/80 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
            Whether as a volunteer, mentor, partner, or donor — there&apos;s a place for you
            in the ANDF family. Together, we&apos;re building a brighter future.
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
                <Heart className="h-4 w-4" /> Donate Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
