"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Tv, Check, Star, Zap, TrendingUp, Users, BarChart3,
  Building2, Mail, Phone, Globe, User, ArrowRight,
  Play, Eye, Shield, Clock, Sparkles, Heart,
  ChevronRight, Award, Target, Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ───── helpers ───── */

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

/* ───── data ───── */

const packages = [
  {
    name: "Starter",
    price: 250,
    duration: "2 months",
    popular: false,
    features: [
      "Up to 15-second ad",
      "2 months of airtime",
      "Basic analytics dashboard",
      "Community recognition",
    ],
  },
  {
    name: "Growth",
    price: 500,
    duration: "4 months",
    popular: true,
    features: [
      "Up to 30-second ad",
      "4 months of airtime",
      "Priority placement",
      "Detailed analytics",
      "Social media mention",
      "Website logo placement",
    ],
  },
  {
    name: "Premium",
    price: 1000,
    duration: "8 months",
    popular: false,
    features: [
      "Up to 60-second ad",
      "8 months of airtime",
      "Highest priority placement",
      "Real-time analytics",
      "Featured sponsor spotlight",
      "Event partnership opportunities",
      "Custom campaign support",
    ],
  },
  {
    name: "Annual Partner",
    price: 1750,
    duration: "12 months",
    popular: false,
    features: [
      "Up to 60-second ad",
      "12 months of airtime",
      "Top-tier priority",
      "Comprehensive analytics",
      "Co-branded content opportunities",
      "VIP event access",
      "Quarterly strategy sessions",
      "Dedicated account manager",
    ],
  },
];

const stats = [
  { num: "15K+", label: "Monthly Views", icon: Eye },
  { num: "50+", label: "Hours of Content", icon: Play },
  { num: "2K+", label: "Community Members", icon: Users },
  { num: "95%", label: "Completion Rate", icon: TrendingUp },
];

const steps = [
  { step: 1, title: "Register", desc: "Fill out the sponsor registration form with your business details.", icon: Building2 },
  { step: 2, title: "Choose a Package", desc: "Select the sponsorship tier that fits your goals and budget.", icon: Target },
  { step: 3, title: "Submit Your Ad", desc: "Upload your video ad for ANDF review and approval.", icon: Play },
  { step: 4, title: "Go Live", desc: "Once approved and paid, your ad runs across ANDF Now! streams.", icon: Megaphone },
];

/* ───── page ───── */

export default function SponsorPage() {
  const [formState, setFormState] = useState({
    businessName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/sponsors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-0">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/fnf-group-lineup.jpg"
            alt="ANDF Community"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-32 lg:py-44 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <Megaphone className="h-4 w-4 text-secondary-400" />
            <span className="text-xs font-semibold text-white tracking-[0.2em] uppercase">
              Advertise with ANDF
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Put Your Brand{" "}
            <span className="text-secondary-400">in the Spotlight</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-neutral-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Advertise on A New Day Now! — our streaming platform reaching thousands
            of engaged community members. Support youth empowerment while growing your brand.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="#packages"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-colors"
            >
              <Star className="h-4 w-4" />
              View Packages
            </Link>
            <Link
              href="#register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-primary-600 py-6">
        <div className="mx-auto max-w-5xl px-6 flex flex-wrap justify-center gap-8 sm:gap-16">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 text-white">
              <s.icon className="h-5 w-5 text-secondary-300" />
              <div>
                <span className="text-xl font-bold">{s.num}</span>
                <span className="text-xs text-white/70 ml-1.5 uppercase tracking-wider">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Advertise ── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Why ANDF Now!</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
                Reach an <span className="text-secondary-500">Engaged Audience</span>
              </h2>
              <p className="text-foreground-muted max-w-xl mx-auto">
                Your ads play seamlessly within premium ANDF content — not intrusive pop-ups,
                but integrated, respected placements that viewers actually watch.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Eye, title: "High Viewership", desc: "15,000+ monthly viewers across live streams and on-demand content.", color: "text-primary-500 bg-primary-500/10" },
              { icon: Shield, title: "Brand-Safe Content", desc: "Family-friendly, mission-driven content that reflects well on sponsors.", color: "text-green-600 bg-green-500/10" },
              { icon: Heart, title: "Social Impact", desc: "Your sponsorship directly funds youth programs — tell your customers you care.", color: "text-rose-500 bg-rose-500/10" },
              { icon: BarChart3, title: "Real Analytics", desc: "Track impressions, completion rates, and clicks with our analytics dashboard.", color: "text-violet-500 bg-violet-500/10" },
              { icon: Zap, title: "No Ad Blockers", desc: "Ads play through the same video player — no ad blockers can interfere.", color: "text-amber-500 bg-amber-500/10" },
              { icon: Clock, title: "Flexible Terms", desc: "Choose from 2 to 12 months. Extend or upgrade anytime.", color: "text-teal-500 bg-teal-500/10" },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.05}>
                <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all h-full">
                  <div className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">How It Works</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
                Four Simple <span className="text-secondary-500">Steps</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <div className="relative text-center p-6 rounded-2xl bg-white border border-neutral-200 hover:shadow-md transition-all">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto mb-4 mt-2">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-foreground-muted">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section id="packages" className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Sponsorship Packages</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
                Choose Your <span className="text-secondary-500">Package</span>
              </h2>
              <p className="text-foreground-muted max-w-xl mx-auto">
                Every package includes ad placement across all ANDF Now! content — live streams, replays, and on-demand videos.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, i) => (
              <FadeIn key={pkg.name} delay={i * 0.08}>
                <div className={`relative rounded-2xl border p-6 flex flex-col h-full transition-all hover:shadow-lg ${
                  pkg.popular
                    ? "border-primary-500 bg-primary-500/5 shadow-[0_0_30px_rgba(47,49,146,0.1)]"
                    : "border-neutral-200 bg-white hover:border-primary-300"
                }`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary-500 text-white text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-display text-xl font-bold text-foreground">{pkg.name}</h3>
                    <p className="text-sm text-foreground-muted mt-1">{pkg.duration}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">${pkg.price.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-foreground-muted mt-1">One-time payment</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground-muted">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="#register"
                    className={`w-full py-3 rounded-xl text-center font-semibold text-sm transition-colors block ${
                      pkg.popular
                        ? "bg-primary-500 text-white hover:bg-primary-600"
                        : "bg-neutral-100 text-foreground hover:bg-primary-500 hover:text-white"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration Form ── */}
      <section id="register" className="py-20 px-6 bg-neutral-50">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Get Started</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
                Register as a <span className="text-secondary-500">Sponsor</span>
              </h2>
              <p className="text-foreground-muted max-w-xl mx-auto">
                Fill out the form below and our team will reach out to get your ad campaign started.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-10 rounded-3xl bg-white border border-green-200 shadow-sm"
              >
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Registration Received!</h3>
                <p className="text-foreground-muted mb-6">
                  Thank you for your interest in sponsoring ANDF Now! Our team will contact you within
                  24-48 hours to discuss next steps and help you select the right package.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/live"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
                  >
                    <Tv className="h-4 w-4" />
                    Explore ANDF Now!
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-100 text-foreground font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    Learn About ANDF <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-neutral-200 p-8 sm:p-10 shadow-sm space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Business Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                      <Input
                        value={formState.businessName}
                        onChange={(e) => setFormState({ ...formState, businessName: e.target.value })}
                        placeholder="Your Company Name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Contact Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                      <Input
                        value={formState.contactName}
                        onChange={(e) => setFormState({ ...formState, contactName: e.target.value })}
                        placeholder="Full Name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                      <Input
                        type="email"
                        value={formState.contactEmail}
                        onChange={(e) => setFormState({ ...formState, contactEmail: e.target.value })}
                        placeholder="you@company.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                      <Input
                        type="tel"
                        value={formState.contactPhone}
                        onChange={(e) => setFormState({ ...formState, contactPhone: e.target.value })}
                        placeholder="(555) 555-5555"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                      <Input
                        type="url"
                        value={formState.websiteUrl}
                        onChange={(e) => setFormState({ ...formState, websiteUrl: e.target.value })}
                        placeholder="https://yourcompany.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-6 text-base"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Register as Sponsor
                    </span>
                  )}
                </Button>

                <p className="text-xs text-foreground-subtle text-center">
                  By registering, you agree to our sponsorship terms. Our team will
                  review your application and follow up within 24-48 hours.
                </p>
              </form>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/leadership-group.jpg"
            alt="ANDF Community"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-700/90" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center space-y-6">
          <FadeIn>
            <Sparkles className="h-10 w-10 text-white/80 mx-auto mb-2" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
              Ready to <span className="text-secondary-300">Make an Impact?</span>
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              Join our growing community of sponsors who believe in empowering the next
              generation while reaching an engaged, mission-aligned audience.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="#register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-colors"
              >
                <Megaphone className="h-5 w-5" />
                Become a Sponsor
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
