"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditCard, Mail as MailIcon, Landmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailForm } from "@/components/shared/email-form";
import { ORG, DONATION_LINKS } from "@/lib/contact";

const WAYS = [
  {
    icon: CreditCard,
    title: "Donate online",
    body: "Give securely by credit or debit card through our payment partner, Converge.",
    cta: "Donate by card",
    href: DONATION_LINKS.card,
    primary: true,
  },
  {
    icon: Landmark,
    title: "Donate with PayPal",
    body: "Use your PayPal balance, bank account, or card.",
    cta: "Donate with PayPal",
    href: DONATION_LINKS.paypal,
    primary: false,
  },
];

const GIFT_TYPES = [
  "Corporate or foundation gift",
  "Matching gift from my employer",
  "Scholarships for students",
  "Sponsor a specific program or event",
  "Stock or planned gift",
  "In-kind donation",
  "Something else",
];

export default function DonatePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-900 text-white">
        <div className="absolute inset-0">
          <Image src="/images/experiences/nmaahc-2025.jpg" alt="ANDF students at the Smithsonian NMAAHC in Washington, D.C." fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/80 to-primary-900/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-20 lg:pb-24">
          <h1 className="font-display font-bold text-4xl sm:text-6xl tracking-tight max-w-3xl">Give a teen a new day</h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/85 leading-relaxed">
            Your gift sends young people ages 13–19 to museums, labs, studios, and conferences, with mentors who
            believe in them. A New Day Foundation is a 501(c)(3) nonprofit, so your donation is tax-deductible.
          </p>
        </div>
      </section>

      {/* Ways to give */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          {WAYS.map((w) => (
            <div key={w.title} className="rounded-2xl border border-neutral-200 p-7 flex flex-col">
              <w.icon className="h-7 w-7 text-primary-600" />
              <h2 className="mt-4 text-2xl font-bold text-foreground">{w.title}</h2>
              <p className="mt-2 text-foreground-muted leading-relaxed flex-1">{w.body}</p>
              <a href={w.href} target="_blank" rel="noopener noreferrer" className="mt-6">
                <Button size="lg" variant={w.primary ? "donate" : "outline"} className="w-full">
                  {w.cta}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          ))}
          <div className="rounded-2xl border border-neutral-200 p-7 bg-neutral-50">
            <MailIcon className="h-7 w-7 text-primary-600" />
            <h2 className="mt-4 text-2xl font-bold text-foreground">Donate by mail</h2>
            <p className="mt-2 text-foreground-muted leading-relaxed">Make checks payable to A New Day Foundation and mail to:</p>
            <address className="mt-4 not-italic font-medium text-foreground leading-relaxed">
              {ORG.name}
              <br />
              {ORG.address.street}
              <br />
              {ORG.address.city}, {ORG.address.region} {ORG.address.postalCode}
            </address>
            <p className="mt-4 text-sm text-foreground-muted">501(c)(3) Federal ID {ORG.ein}</p>
          </div>
        </div>
        <p className="mx-auto max-w-6xl mt-8 text-sm text-foreground-muted">
          Want your gift to <strong className="text-foreground">support our scholarship efforts</strong>? Donate by card
          or mail, then email <a href={`mailto:${ORG.email}?subject=${encodeURIComponent("Scholarship gift")}`} className="text-primary-700 underline underline-offset-2">{ORG.email}</a> so
          we can direct your gift to scholarships.
        </p>
      </section>

      {/* Where it goes */}
      <section className="py-20 px-6 bg-primary-900 text-white">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <h2 className="font-display font-bold text-3xl sm:text-4xl">Where your gift goes</h2>
            <p className="mt-4 text-white/75 leading-relaxed">
              Donations fund our programs, from the Focused N F.I.T. conference and its scholarships to Band
              Camp, Topgolf Family Experiences, and small-group outings for boys and girls.
            </p>
            <Link href="/programs" className="mt-6 inline-block font-semibold text-secondary-300 underline underline-offset-4 hover:text-white">
              See our programs
            </Link>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-3">
            {["/images/experiences/band-camp-2025.jpg", "/images/experiences/ifly-2025.jpg", "/images/experiences/frost-stem-2025.jpg", "/images/experiences/topgolf-2024.jpg"].map((src) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-md">
                <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 30vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other gifts */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">Planning a larger gift?</h2>
            <p className="mt-4 text-foreground-muted leading-relaxed">
              Corporate gifts, matching gifts, scholarships, stock, or in-kind support: tell us what you have in mind
              and we&apos;ll reach out personally.
            </p>
            <p className="mt-6 text-sm">
              <a href={ORG.phoneHref} className="font-semibold text-primary-700 hover:underline">{ORG.phone}</a>
            </p>
          </div>
          <div className="lg:col-span-7 rounded-2xl bg-white border border-neutral-200 p-6 sm:p-8">
            <EmailForm
              fields={[
                { name: "name", label: "Your name", required: true, half: true },
                { name: "email", label: "Your email", type: "email", required: true, half: true },
                { name: "phone", label: "Phone", type: "tel", half: true },
                { name: "organization", label: "Company or foundation", half: true },
                { name: "giftType", label: "Type of gift", type: "select", options: GIFT_TYPES, required: true, half: true },
                { name: "amount", label: "Approximate amount (optional)", half: true },
                { name: "message", label: "Message", type: "textarea" },
              ]}
              subject={(v) => `Gift inquiry: ${v.giftType} from ${v.name}`}
              submitLabel="Send gift inquiry"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
