"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Music, Cpu, Target, Users, GraduationCap, Heart, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const programs = [
  {
    slug: "band-camp",
    title: "Band Camp",
    tagline: "Music that moves the soul",
    description: "An immersive musical experience where young people discover their rhythm, build confidence through performance, and connect with professional musicians.",
    icon: Music,
    logo: "/images/partners/band-camp.jpg",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    slug: "drone-experience",
    title: "Drone Experience",
    tagline: "Sky's not the limit",
    description: "Hands-on drone piloting and aerial photography workshops that introduce youth to cutting-edge technology and career opportunities in STEM.",
    icon: Cpu,
    logo: null as string | null,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    slug: "topgolf",
    title: "TopGolf Experience",
    tagline: "Driving success forward",
    description: "A unique blend of sports, networking, and mentorship in an exciting environment that teaches teamwork and builds lasting connections.",
    icon: Target,
    logo: "/images/partners/top-golf.jpg",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    slug: "mentors",
    title: "MenTORS",
    tagline: "Men Talking Of Relevant Situations",
    description: "A mentoring initiative where men come together to discuss real-life challenges, career development, and personal growth.",
    icon: MessageCircle,
    logo: "/images/partners/mentors.jpg",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    slug: "sisters-hangout",
    title: "Sisters Hangout",
    tagline: "Empowering young women together",
    description: "A supportive space for young women to connect, share experiences, and build confidence through workshops and peer mentoring.",
    icon: Heart,
    logo: "/images/partners/sisters.jpg",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    slug: "mentorship",
    title: "Mentorship Program",
    tagline: "Guidance that transforms",
    description: "One-on-one and group mentoring with successful professionals who provide guidance, support, and real-world insight to shape future leaders.",
    icon: Users,
    logo: null as string | null,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    slug: "hbcu-heroes",
    title: "HBCU Heroes",
    tagline: "Celebrating excellence",
    description: "Spotlighting the achievements and impact of Historically Black Colleges and Universities, inspiring the next generation of scholars and leaders.",
    icon: GraduationCap,
    logo: "/images/partners/hbcu-heroes.jpg",
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
  },
];

export function ProgramsPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionWrapper className="py-24 lg:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="What We Do"
          title="Programs That Transform Lives"
          description="From music to technology, mentorship to community engagement — our programs create lasting impact."
        />

        <div ref={ref} className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => (
            <motion.div
              key={program.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={`/programs/${program.slug}`} className="block group">
                <div className="relative h-full p-6 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 transition-all duration-500 hover:shadow-lg">
                  <div className="space-y-4">
                    {program.logo ? (
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-neutral-100">
                        <Image src={program.logo} alt={`${program.title} logo`} fill className="object-contain p-1" sizes="56px" />
                      </div>
                    ) : (
                      <div className={`h-12 w-12 rounded-xl ${program.iconBg} flex items-center justify-center`}>
                        <program.icon className={`h-6 w-6 ${program.iconColor}`} />
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-sm text-secondary-500 mt-1">{program.tagline}</p>
                    </div>

                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {program.description}
                    </p>

                    <div className="flex items-center text-sm font-medium text-primary-500 group-hover:text-primary-600">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/programs">
            <Button variant="outline" size="lg">
              View All Programs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
