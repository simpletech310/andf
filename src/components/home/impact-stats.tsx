"use client";

import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedCounter } from "@/components/shared/animated-counter";

const stats = [
  { target: 2500, suffix: "+", label: "Youth Served", description: "Young lives impacted" },
  { target: 12, suffix: "", label: "Programs", description: "Active initiatives" },
  { target: 85, suffix: "+", label: "Events Hosted", description: "Transformative experiences" },
  { target: 150, prefix: "$", suffix: "K+", label: "Funds Raised", description: "Community support" },
];

export function ImpactStats() {
  return (
    <SectionWrapper className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />

          <div className="relative grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10">
            {stats.map((stat) => (
              <div key={stat.label} className="p-8 lg:p-10 text-center space-y-2">
                <div className="font-display text-4xl lg:text-5xl font-bold text-white">
                  <AnimatedCounter
                    target={stat.target}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-sm font-semibold text-white/90">{stat.label}</div>
                <div className="text-xs text-white/60">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
