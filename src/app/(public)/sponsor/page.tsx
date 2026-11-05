"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmailForm } from "@/components/shared/email-form";
import { PartnersSection } from "@/components/home/partners-section";
import { ORG, mailtoHref } from "@/lib/contact";
import { COLLABORATORS } from "@/lib/impact";

const WAYS = [
  {
    title: "Sponsor a program or event",
    body: "Underwrite a Topgolf Experience, Band Camp, or Focused N F.I.T., our annual signature conference for students and parents.",
    image: "/images/experiences/topgolf-celebrity-classic-2026.jpg",
  },
  {
    title: "Fund scholarships",
    body: "Give to the Lucille F. Clarke Hudson Scholarship Fund, which helps low- to moderate-income students take the next step toward college.",
    image: "/images/experiences/fnf-2025.jpg",
  },
  {
    title: "Send your team to mentor",
    body: "Your people can speak, lead a workshop, or spend a day with teens at an outing. Small groups of 8 to 20 mean real conversations.",
    image: "/images/experiences/sheriff-crime-lab-2025.jpg",
  },
  {
    title: "Open your doors",
    body: "Host an experience at your workplace, venue, or studio. Teens have explored a forensic lab, a harbor patrol boat, a recording studio, and more.",
    image: "/images/experiences/harbor-patrol-2025.jpg",
  },
  {
    title: "Give in kind",
    body: "Tickets, equipment, instruments, transportation, meals, or media time all stretch every dollar further.",
    image: "/images/experiences/band-camp-2025.jpg",
  },
];

const INTERESTS = [
  "Sponsor a program or event",
  "Fund scholarships",
  "Employee mentoring or volunteering",
  "Host an experience",
  "In-kind gift",
  "Something else",
];

export default function PartnerPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/experiences/fnf-2024.jpg"
            alt="Students and mentors at Focused N F.I.T. 2024"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/80 to-primary-900/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-20 lg:pb-24">
          <h1 className="font-display font-bold text-4xl sm:text-6xl tracking-tight max-w-3xl">
            Partner with A New Day Foundation
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/85 leading-relaxed">
            Founded by Dawnn Lewis in 2017, ANDF puts teens ages 13–19 in rooms they might never enter on their own.
            Partners make every one of those days possible.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href="#inquire">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary-800 hover:bg-primary-50">
                Start a conversation
              </Button>
            </a>
            <a href={ORG.phoneHref}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                Call {ORG.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Ways to partner */}
      <section className="py-24 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-foreground">Ways to partner</h2>
            <p className="mt-4 text-lg text-foreground-muted leading-relaxed">
              Every partnership is shaped around what your organization wants to accomplish. Pick a starting point
              and we&apos;ll build the rest together.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {WAYS.map((w) => (
              <article key={w.title}>
                <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-neutral-200">
                  <Image src={w.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">{w.title}</h3>
                <p className="mt-2 text-foreground-muted leading-relaxed">{w.body}</p>
                <a
                  href={mailtoHref(`Partnership: ${w.title}`)}
                  className="mt-3 inline-block text-sm font-semibold text-primary-600 underline underline-offset-4 decoration-primary-200 hover:decoration-primary-500"
                >
                  Email us about this
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What partners receive */}
      <section className="py-24 px-6 bg-primary-900 text-white">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12">
          <h2 className="lg:col-span-4 font-display font-bold text-3xl sm:text-4xl">What you get back</h2>
          <dl className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            {[
              ["Time with the teens you support", "Meet the students at the programs you fund, not just in a report."],
              ["Recognition, your way", "Credit on our website, at events, and in our videos, shaped with your team."],
              ["Stories you can share", "Photos and video from A New Day Now that show your support at work."],
              ["A tax-deductible gift", `ANDF is a 501(c)(3) nonprofit, Federal ID ${ORG.ein}.`],
            ].map(([t, d]) => (
              <div key={t} className="border-t border-white/20 pt-4">
                <dt className="font-semibold text-lg">{t}</dt>
                <dd className="mt-1 text-white/70 leading-relaxed">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <PartnersSection />

      {/* Collaborators */}
      <section className="py-16 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-lg font-semibold text-foreground">Organizations we collaborate with</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {COLLABORATORS.map((name) => (
              <li key={name} className="rounded-full border border-neutral-300 px-3.5 py-1.5 text-sm text-neutral-700">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Inquiry */}
      <section id="inquire" className="scroll-mt-24 py-24 px-6 bg-neutral-50">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">Start a conversation</h2>
            <p className="mt-4 text-foreground-muted leading-relaxed">
              Tell us a little about your organization and what interests you. We&apos;ll follow up to talk it through.
            </p>
            <div className="mt-8 space-y-2 text-sm">
              <p>
                <a href={`mailto:${ORG.email}`} className="font-semibold text-primary-700 hover:underline">{ORG.email}</a>
              </p>
              <p>
                <a href={ORG.phoneHref} className="font-semibold text-primary-700 hover:underline">{ORG.phone}</a>
              </p>
              <p className="text-foreground-muted">
                Prefer to give directly? <Link href="/donate" className="text-primary-700 underline underline-offset-2">Donate here</Link>.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 rounded-2xl bg-white border border-neutral-200 p-6 sm:p-8">
            <EmailForm
              fields={[
                { name: "organization", label: "Organization", required: true, half: true },
                { name: "name", label: "Your name", required: true, half: true },
                { name: "title", label: "Your title", half: true },
                { name: "email", label: "Your email", type: "email", required: true, half: true },
                { name: "phone", label: "Phone", type: "tel", half: true },
                { name: "interest", label: "I'm interested in", type: "select", options: INTERESTS, required: true, half: true },
                { name: "message", label: "Anything else we should know?", type: "textarea" },
              ]}
              subject={(v) => `Partnership inquiry: ${v.organization}`}
              intro="Hello ANDF team, we're interested in partnering with A New Day Foundation."
              submitLabel="Send inquiry"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
