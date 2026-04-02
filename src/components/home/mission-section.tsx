"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Users, GraduationCap, Heart } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SectionHeading } from "@/components/shared/section-heading";

const values = [
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Creating cutting-edge experiences that inspire and engage young minds through technology and creativity.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building strong bonds between youth, mentors, and families to create lasting support networks.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Providing hands-on learning opportunities that go beyond the classroom and into real-world application.",
  },
  {
    icon: Heart,
    title: "Empowerment",
    description: "Giving young people the tools, confidence, and vision to become leaders in their communities.",
  },
];

export function MissionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <SectionWrapper className="py-24 lg:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="Our Mission"
          title="A Foundation Built on Purpose"
          description="We believe every young person deserves the chance to discover their potential. Through innovative programs and dedicated mentorship, we're creating pathways to success."
        />

        <div ref={ref} className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              className="group relative p-6 rounded-2xl bg-background-card/50 border border-border hover:border-gold-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                <value.icon className="h-6 w-6 text-gold-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{value.description}</p>

              {/* Gold accent line */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold-500/0 to-transparent group-hover:via-gold-500/40 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
