"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Check,
  Loader2,
  Clock,
  Heart,
  Users,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* ───────── data ───────── */

const subjects = [
  "General Inquiry",
  "Program Information",
  "Volunteer Opportunities",
  "Sponsorship / Partnership",
  "Donation Question",
  "Media / Press",
  "Other",
];

const contactMethods = [
  {
    icon: Mail,
    label: "Email Us",
    value: "info@anewdayfoundation.net",
    href: "mailto:info@anewdayfoundation.net",
    desc: "We typically reply within 24 hours",
    color: "bg-primary-500/10 text-primary-500",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "Contact for inquiries",
    href: undefined,
    desc: "Mon-Fri, 9AM - 5PM PST",
    color: "bg-secondary-500/10 text-secondary-500",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Los Angeles, California",
    href: undefined,
    desc: "By appointment only",
    color: "bg-accent-500/10 text-accent-500",
  },
];

const faqs = [
  {
    q: "How can I enroll my child in a program?",
    a: "Visit our Programs page to see all current offerings. Each program has its own registration process — select the program you're interested in and follow the enrollment link.",
  },
  {
    q: "How do I become a volunteer or mentor?",
    a: "We'd love to have you! Fill out the contact form above with 'Volunteer Opportunities' as the subject, and our team will reach out with next steps.",
  },
  {
    q: "Can my organization partner with ANDF?",
    a: "Absolutely! We partner with businesses, schools, and organizations across Los Angeles and beyond. Select 'Sponsorship / Partnership' in the form above.",
  },
  {
    q: "Is my donation tax-deductible?",
    a: "Yes! A New Day Foundation is a registered 501(c)(3) nonprofit. All donations are tax-deductible to the fullest extent of the law.",
  },
];

/* ───────── helpers ───────── */

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── page ───────── */

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700">
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-secondary-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-36 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20"
              >
                <MessageSquare className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">
                  We&apos;d Love to Hear From You
                </span>
              </motion.div>

              <motion.h1
                className="font-display text-5xl lg:text-6xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Let&apos;s{" "}
                <span className="text-secondary-300">Connect</span>
              </motion.h1>

              <motion.p
                className="text-lg text-white/80 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Whether you have a question about our programs, want to
                volunteer, or explore a partnership — our team is ready to help.
              </motion.p>

              {/* Quick contact cards */}
              <motion.div
                className="flex flex-wrap gap-4 pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {contactMethods.map((method) => (
                  <div
                    key={method.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15"
                  >
                    <method.icon className="h-5 w-5 text-secondary-300 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {method.label}
                      </p>
                      <p className="text-xs text-white/60">{method.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero image */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative h-[400px] rounded-3xl overflow-hidden">
                <Image
                  src="/images/gallery/siedah-garrett-dawnn.jpg"
                  alt="ANDF team at work"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/60 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-white shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-800">
                      Quick Response
                    </p>
                    <p className="text-xs text-neutral-500">
                      Within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
              className="fill-[var(--background)]"
            />
          </svg>
        </div>
      </section>

      {/* ── Contact Form & Info ── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left column — Contact info */}
            <div className="lg:col-span-2 space-y-8">
              <FadeIn>
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
                    Get in Touch
                  </span>
                  <h2 className="font-display text-3xl font-bold text-foreground">
                    Contact Information
                  </h2>
                  <p className="text-foreground-muted">
                    Reach out through any of the channels below — we&apos;re
                    here to help.
                  </p>
                </div>
              </FadeIn>

              {/* Contact cards */}
              <div className="space-y-4">
                {contactMethods.map((item, i) => (
                  <FadeIn key={item.label} delay={i * 0.1}>
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all">
                      <div
                        className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center shrink-0`}
                      >
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {item.label}
                        </h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm text-foreground-muted hover:text-primary-500 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm text-foreground-muted">
                            {item.value}
                          </p>
                        )}
                        <p className="text-xs text-foreground-subtle mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              {/* Office hours */}
              <FadeIn delay={0.3}>
                <div className="p-6 rounded-2xl bg-primary-50 border border-primary-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-primary-500" />
                    <h3 className="font-semibold text-primary-700">
                      Office Hours
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      { day: "Monday - Friday", hours: "9:00 AM - 5:00 PM PST" },
                      { day: "Saturday", hours: "By appointment" },
                      { day: "Sunday", hours: "Closed" },
                    ].map((row) => (
                      <div
                        key={row.day}
                        className="flex items-center justify-between"
                      >
                        <span className="text-foreground-muted">{row.day}</span>
                        <span className="font-medium text-foreground">
                          {row.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Social links */}
              <FadeIn delay={0.4}>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {[
                      {
                        letter: "f",
                        href: "https://facebook.com",
                        label: "Facebook",
                      },
                      {
                        letter: "Y",
                        href: "https://youtube.com",
                        label: "YouTube",
                      },
                      {
                        letter: "I",
                        href: "https://instagram.com",
                        label: "Instagram",
                      },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-11 w-11 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-primary-500 hover:border-primary-300 hover:shadow-md transition-all"
                        aria-label={social.label}
                      >
                        <span className="text-sm font-bold">{social.letter}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right column — Form */}
            <FadeIn className="lg:col-span-3" delay={0.1}>
              <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm p-8 sm:p-10">
                {submitted ? (
                  <motion.div
                    className="text-center py-16 space-y-5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <motion.div
                      className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.2,
                      }}
                    >
                      <Check className="h-10 w-10 text-green-600" />
                    </motion.div>
                    <h3 className="text-3xl font-display font-bold text-foreground">
                      Message Sent!
                    </h3>
                    <p className="text-foreground-muted max-w-md mx-auto">
                      Thank you for reaching out. Our team will review your
                      message and get back to you within 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                      <Button
                        variant="primary"
                        onClick={() => setSubmitted(false)}
                      >
                        <Send className="h-4 w-4" />
                        Send Another Message
                      </Button>
                      <Link href="/">
                        <Button variant="secondary">Back to Home</Button>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        Send Us a Message
                      </h2>
                      <p className="text-sm text-foreground-muted">
                        Fill out the form below and we&apos;ll get back to you
                        as soon as possible.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        id="contactName"
                        label="Full Name"
                        placeholder="Your name"
                        required
                      />
                      <Input
                        id="contactEmail"
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        id="contactPhone"
                        label="Phone (Optional)"
                        type="tel"
                        placeholder="(555) 555-5555"
                      />
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground-muted">
                          Subject
                        </label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500"
                          required
                        >
                          <option value="">Select a subject</option>
                          {subjects.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <Textarea
                      id="contactMessage"
                      label="Message"
                      placeholder="Tell us how we can help..."
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />{" "}
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" /> Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-foreground-subtle">
                      By submitting this form, you agree to our privacy policy.
                      We&apos;ll never share your information.
                    </p>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
                Common Questions
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Frequently Asked{" "}
                <span className="text-secondary-500">Questions</span>
              </h2>
              <p className="text-foreground-muted max-w-lg mx-auto">
                Quick answers to the things we get asked most.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all h-full">
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Links ── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Looking for Something Specific?
              </h2>
              <p className="text-foreground-muted">
                Jump directly to the information you need.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Users,
                title: "Our Programs",
                desc: "Explore all youth programs",
                href: "/programs",
                color:
                  "bg-violet-100 text-violet-600 group-hover:bg-violet-200",
              },
              {
                icon: Heart,
                title: "Donate",
                desc: "Support our mission",
                href: "/donate",
                color:
                  "bg-rose-100 text-rose-600 group-hover:bg-rose-200",
              },
              {
                icon: Sparkles,
                title: "Events",
                desc: "See what's coming up",
                href: "/events",
                color:
                  "bg-amber-100 text-amber-600 group-hover:bg-amber-200",
              },
              {
                icon: MessageSquare,
                title: "About Us",
                desc: "Learn our story",
                href: "/about",
                color:
                  "bg-primary-100 text-primary-600 group-hover:bg-primary-200",
              },
            ].map((link, i) => (
              <FadeIn key={link.title} delay={i * 0.08}>
                <Link
                  href={link.href}
                  className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all"
                >
                  <div
                    className={`h-14 w-14 rounded-2xl ${link.color} flex items-center justify-center mb-4 transition-colors`}
                  >
                    <link.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {link.title}
                  </h3>
                  <p className="text-sm text-foreground-muted mb-3">
                    {link.desc}
                  </p>
                  <span className="text-sm text-primary-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Visit <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/fnf-group-lineup.jpg"
            alt="ANDF Community"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center space-y-6">
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Join the{" "}
              <span className="text-secondary-300">ANDF Family</span>
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              There are so many ways to get involved — from volunteering to
              donating to simply spreading the word.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-600 font-semibold hover:bg-neutral-100 transition-colors"
              >
                Explore Programs
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-colors"
              >
                <Heart className="h-5 w-5" />
                Donate Now
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
