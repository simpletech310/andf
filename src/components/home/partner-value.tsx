"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COLLABORATORS } from "@/lib/impact";

const REASONS = [
  {
    title: "Put your people in the room",
    body: "Your team can mentor teens face to face at conferences, Topgolf outings, workshops, and career visits. Partners have included Google, PepsiCo, Northrop Grumman, and the LA Lakers.",
  },
  {
    title: "Fund skills that compound",
    body: "Focused N F.I.T. gives low- and moderate-income students and their parents financial and technology literacy, plus scholarships, before the big decisions about college.",
  },
  {
    title: "Reach beyond Los Angeles",
    body: "ANDF programs and events have reached Los Angeles, Atlanta, Chicago, Washington, D.C., and Indianapolis, with room to grow into your markets.",
  },
  {
    title: "Stand beside a name people trust",
    body: "Dawnn Lewis brings artists, civic leaders, and executives to every program, and program highlights stream on A New Day Now, so your support is seen.",
  },
];

export function PartnerValue() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-neutral-50">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-14">
        <div className="lg:col-span-4">
          <h2 className="font-display font-bold text-4xl sm:text-5xl leading-[1.08] text-foreground">
            Why partners choose ANDF
          </h2>
          <p className="mt-5 text-lg text-foreground-muted leading-relaxed">
            Sponsorships, employee mentoring, in-kind support, and program underwriting, shaped around what your
            organization wants to accomplish.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link href="/sponsor">
              <Button size="lg" className="w-full sm:w-auto">Become a partner</Button>
            </Link>
            <a href="tel:+14242413623" className="inline-flex items-center justify-center sm:justify-start h-12 text-sm font-semibold text-primary-700 hover:text-primary-500">
              Or call (424) 241-3623
            </a>
          </div>
        </div>

        <div className="lg:col-span-8">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {REASONS.map((r) => (
              <div key={r.title} className="border-t-2 border-secondary-500 pt-5">
                <dt className="text-xl font-semibold text-foreground">{r.title}</dt>
                <dd className="mt-2 text-foreground-muted leading-relaxed">{r.body}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16">
            <h3 className="text-base font-semibold text-foreground">In good company</h3>
            <p className="mt-1 text-sm text-foreground-muted">Organizations we collaborate with to serve youth</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {COLLABORATORS.map((name) => (
                <li key={name} className="rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-sm text-neutral-700">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
