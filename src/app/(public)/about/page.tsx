"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Heart, Sparkles,
  Users, Award, Rocket, Globe, Target, Star, CheckCircle2
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { SectionWrapper, StaggerChildren, StaggerItem } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { BOARD, ADVISORY_BOARD, TEAM } from "@/lib/team";
import { CareerRail, CommunityWall } from "@/components/shared/dawnn-career";
import { PRESS_PHOTOS } from "@/lib/dawnn";
import { DAWNN_CREDITS } from "@/lib/impact";

/* ─── Data ─────────────────────────────────────────────────────────── */

const timeline = [
  { year: "2017", title: "Founded", description: "Dawnn Lewis founds A New Day Foundation to empower underserved youth ages 13–19, building on decades of service and advocacy.", image: "/images/team/dawnn-lewis.jpg", color: "from-primary-500 to-primary-600", stat: "Day 1" },
  { year: "2023", title: "Focused N F.I.T.", description: "The signature conference brings high school and college students and their parents together for financial and technology literacy, mentorship, and scholarships.", image: "/images/gallery/fnf-group-lineup.jpg", color: "from-violet-500 to-purple-600", stat: "Signature event" },
  { year: "2024", title: "HBCU Heroes & Topgolf", description: "The HBCU Heroes webinar series on money, technology, and careers launches, and Topgolf Family Experiences bring parents and teens together to learn the game and each other.", image: "/images/experiences/topgolf-2024.jpg", color: "from-emerald-500 to-green-600", stat: "New programs" },
  { year: "2025", title: "Doors Wide Open", description: "Band Camp, iFLY, The Color Purple, the Lakers, the Sheriff's Crime Lab and Harbor Patrol, and a trip to the Smithsonian's NMAAHC in Washington, D.C.", image: "/images/experiences/nmaahc-2025.jpg", color: "from-amber-500 to-orange-600", stat: "10+ experiences" },
  { year: "2026", title: "Coast to Coast", description: "A Celebrity Golf Classic with Topgolf, The First Tee, and Callaway; Drone Experiences in Indianapolis and Los Angeles; Topgolf Family Experiences in Atlanta and Chicago.", image: "/images/experiences/topgolf-celebrity-classic-2026.jpg", color: "from-primary-400 to-primary-700", stat: "5 cities" },
];


const impactStats = [
  { value: "9,000+", label: "Youth Served", icon: Users },
  { value: "7+", label: "Active Programs", icon: Target },
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
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/95 via-primary-900/75 to-primary-900/50" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-32 lg:py-44 text-center space-y-6">
          <motion.span
            className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-secondary-400 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Est. 2017 &bull; Los Angeles, CA
          </motion.span>
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Empowering Youth.
            <br />
            <span className="text-secondary-400">Transforming Lives.</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Founded in 2017 by Dawnn Lewis, A New Day Foundation gives underserved teens, ages 13 to 19,
            the tools, guidance, and support they need to succeed.
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
                To empower underserved youth, ages 13 to 19, with the tools, guidance, and support they need
                to succeed, through real-world experiences, caring mentors, and financial and technology literacy.
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

      {/* ───── 4. FOUNDER — Dawnn Lewis ───── */}
      <section id="founder" className="scroll-mt-24 relative overflow-hidden bg-primary-900 text-white">
        <div
          aria-hidden
          className="absolute left-[20%] -translate-x-1/2 bottom-[-36rem] h-[60rem] w-[60rem] rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.5)_0%,rgba(240,125,26,0.25)_28%,rgba(26,115,212,0.1)_52%,transparent_68%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <figure className="lg:col-span-5 mx-auto w-full max-w-sm lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12rem] rounded-b-md ring-1 ring-white/15 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <Image src="/images/team/dawnn-lewis.jpg" alt="Dawnn Lewis" fill className="object-cover object-[50%_20%]" sizes="384px" />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between text-sm">
              <span className="font-display font-semibold text-lg">Dawnn Lewis</span>
              <span className="text-white/60">Founder &amp; President</span>
            </figcaption>
          </figure>

          <div className="lg:col-span-7">
            <h2 className="font-display font-bold text-4xl sm:text-5xl leading-[1.08] tracking-[-0.01em]">
              An entertainer who never stopped showing up for her community.
            </h2>
            <div className="mt-8 space-y-5 text-lg text-white/80 leading-relaxed max-w-[40rem]">
              <p>
                Dawnn Lewis is a Grammy Award-winning singer, a multiple ASCAP and BMI Award-winning songwriter,
                a film, television, and stage actor, a composer, and a series TV creator and producer. She was
                inducted into the Women Songwriters Hall of Fame with its first class in 2021, and she is a
                Trumpet Award honoree.
              </p>
              <p>
                Born in Brooklyn to a family with roots in Guyana, she started the musical theatre program at the
                University of Miami at 16 and graduated magna cum laude. Her career began in Broadway musicals and
                has now spanned five decades, across the stage, television, film, recording studios, and the
                voice booth.
              </p>
              <p>
                She has served on the SAG and SAG-AFTRA National Board of Directors, helping lead the merger as
                National and Los Angeles Chair of the Singers Committee, and on the National Advisory Board of the
                National Center for Civil and Human Rights. She has been a spokesperson for UNCF, the American
                Heart Association, the American Cancer Society, the K.I.S. Foundation for Sickle Cell Disease, and
                the EMPOWHER Institute.
              </p>
              <p>
                With the Los Angeles Urban League she co-produced <em>A New Day: Concert for a Cause</em>, which
                brought together more than 40 artists and performers who donated their talent to community
                nonprofits. In 2017 she founded A New Day Foundation to put that same energy directly behind
                underserved teens, ages 13 to 19.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 border-t border-white/15">
              {DAWNN_CREDITS.map((c) => (
                <div key={c.role} className="py-4 border-b border-white/15">
                  <dt className="font-medium text-white">{c.role}</dt>
                  <dd className="text-sm text-white/55 mt-0.5">{c.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ───── 4b. ON SCREEN & STAGE ───── */}
      <section className="py-20 lg:py-24 px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7 lg:col-span-8">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">On screen and on stage</h2>
              <p className="mt-3 text-foreground-muted leading-relaxed max-w-2xl">
                Five decades, and still going. Dawnn&apos;s career began in Broadway musicals and grew into a body of
                work few performers can match: landmark network sitcoms, feature films, prime-time drama, and some of
                animation&apos;s best-loved voices, from <em>The Simpsons</em> and <em>Futurama</em> to{" "}
                <em>Star Trek</em>. Her newest roles include Netflix&apos;s <em>Nemesis</em> and ABC&apos;s{" "}
                <em>R.J. Decker</em>, and she still meets fans at conventions like Comic-Con.
              </p>
            </div>
            <figure className="md:col-span-5 lg:col-span-4">
              <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-neutral-200">
                <Image src={PRESS_PHOTOS.awards.src} alt={PRESS_PHOTOS.awards.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 380px" />
              </div>
              <figcaption className="mt-2 text-xs text-foreground-muted">{PRESS_PHOTOS.awards.caption}</figcaption>
            </figure>
          </div>
          <div className="mt-10">
            <CareerRail />
          </div>
        </div>
      </section>

      {/* ───── 4c. IN THE COMMUNITY ───── */}
      <section className="py-20 lg:py-24 px-6 bg-neutral-50">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">Using the spotlight for good</h2>
            <p className="mt-3 text-foreground-muted leading-relaxed">
              Long before ANDF, Dawnn was lending her voice and her network to causes she believes in: civil rights,
              health, education, and housing.
            </p>
          </div>
          <div className="mt-10">
            <CommunityWall />
          </div>
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

      {/* ───── 6. LEADERSHIP — teaser, full page at /leadership ───── */}
      <section className="py-20 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">The people behind the mission</h2>
            <p className="mt-4 text-foreground-muted leading-relaxed">
              {BOARD.length} board directors, {ADVISORY_BOARD.length} advisors, and a dedicated team bring experience from
              entertainment, technology, transportation, finance, and advocacy.
            </p>
            <Link href="/leadership" className="mt-6 inline-block">
              <Button size="lg">Meet the board &amp; team</Button>
            </Link>
          </div>
          <Link href="/leadership" className="lg:col-span-7 group" aria-label="Meet the board and team">
            <ul className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {[...BOARD, ...ADVISORY_BOARD, ...TEAM].map((m) => (
                <li key={m.name} className="relative aspect-square overflow-hidden rounded-xl bg-neutral-200 ring-1 ring-neutral-200">
                  <Image src={m.image} alt={m.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="120px" />
                </li>
              ))}
            </ul>
          </Link>
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
              { title: "Real-World Experiences", desc: "From forensic labs to recording studios, our programs go beyond the classroom to deliver hands-on, career-shaping experiences." },
              { title: "A Founder People Show Up For", desc: "Dawnn Lewis brings artists, civic leaders, and executives into the room, so teens meet the people they want to become." },
              { title: "Holistic Approach", desc: "We develop the whole person — building confidence, creativity, technical skills, and community bonds simultaneously." },
              { title: "Proven Track Record", desc: "9,000+ youth served since 2017 across Los Angeles, New York, Atlanta, Chicago, Washington, D.C., and Indianapolis, with partners like Google, PepsiCo, and the LA Lakers." },
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
