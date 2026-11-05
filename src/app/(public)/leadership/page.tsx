"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { BOARD, ADVISORY_BOARD, TEAM, type TeamMember } from "@/lib/team";
import { TeamMemberCard, BioModal } from "@/components/shared/team";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  { id: "board", label: "Board of Directors", count: BOARD.length },
  { id: "advisory", label: "Advisory Board", count: ADVISORY_BOARD.length },
  { id: "team", label: "Our Team", count: TEAM.length },
];

function Section({
  id,
  title,
  intro,
  members,
  onOpen,
  featureFirst = false,
  tone = "white",
}: {
  id: string;
  title: string;
  intro: string;
  members: TeamMember[];
  onOpen: (m: TeamMember) => void;
  featureFirst?: boolean;
  tone?: "white" | "neutral";
}) {
  return (
    <section id={id} className={`scroll-mt-40 py-20 lg:py-24 px-6 ${tone === "neutral" ? "bg-neutral-50" : "bg-white"}`}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">{title}</h2>
          <p className="mt-3 text-foreground-muted leading-relaxed">{intro}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {members.map((m, i) => (
            <TeamMemberCard key={m.name} {...m} featured={featureFirst && i === 0} onOpen={m.bio?.length ? () => onOpen(m) : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LeadershipPage() {
  const [active, setActive] = useState<TeamMember | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <div>
      <BioModal member={active} onClose={close} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-900 text-white">
        <div
          aria-hidden
          className="absolute right-[-12rem] bottom-[-34rem] h-[56rem] w-[56rem] rounded-full bg-[radial-gradient(circle,rgba(240,125,26,0.35)_0%,rgba(26,115,212,0.12)_45%,transparent_68%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-16 lg:pt-44 lg:pb-20">
          <h1 className="font-display font-bold text-4xl sm:text-6xl tracking-tight">Board &amp; Team</h1>
          <p className="mt-5 max-w-2xl text-lg sm:text-xl text-white/80 leading-relaxed">
            The leaders behind A New Day Foundation: entertainers, executives, educators, and advocates who give
            their time so young people ages 13–19 can thrive. Select anyone to read their story.
          </p>
        </div>
      </section>

      {/* Section tabs */}
      <nav aria-label="Leadership sections" className="sticky top-20 z-30 bg-white/95 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 flex gap-2 overflow-x-auto py-3">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-primary-500 hover:text-primary-700 transition-colors"
            >
              {s.label} <span className="text-neutral-400">({s.count})</span>
            </a>
          ))}
        </div>
      </nav>

      <Section
        id="board"
        title="Board of Directors"
        intro="Our governing board sets the foundation's direction and stewards every gift, led by founder and president Dawnn Lewis."
        members={BOARD}
        onOpen={setActive}
        featureFirst
      />
      <Section
        id="advisory"
        title="Advisory Board"
        intro="Senior leaders from transportation, community affairs, and advocacy who guide our strategy and open doors for our students."
        members={ADVISORY_BOARD}
        onOpen={setActive}
        tone="neutral"
      />
      <Section
        id="team"
        title="Our Team"
        intro="The people who plan the outings, run the programs, and make sure every young person feels welcome."
        members={TEAM}
        onOpen={setActive}
      />

      {/* CTA */}
      <section className="py-16 px-6 bg-primary-900 text-white">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl">Want to work with our leadership?</h2>
            <p className="mt-2 text-white/75">Partnerships, board inquiries, and volunteer leadership start with a conversation.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/sponsor">
              <Button size="lg" variant="donate" className="w-full sm:w-auto">Partner with us</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">Contact us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
