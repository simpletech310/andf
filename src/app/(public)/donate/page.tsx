"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Shield,
  CreditCard,
  Repeat,
  Sparkles,
  Users,
  GraduationCap,
  Music,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Quote,
  Star,
  Gift,
  Loader2,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a2e",
      "::placeholder": { color: "#9ca3af" },
      fontFamily: "system-ui, sans-serif",
    },
    invalid: { color: "#ef4444" },
  },
};

/* ───────── data ───────── */

const presetAmounts = [25, 50, 100, 250, 500, 1000];

const impactItems = [
  {
    amount: 25,
    description: "Provides supplies for one child at Band Camp",
    icon: Music,
  },
  {
    amount: 50,
    description: "Sponsors one mentoring session for a young person",
    icon: Users,
  },
  {
    amount: 100,
    description: "Funds a full day of programming for one participant",
    icon: Star,
  },
  {
    amount: 250,
    description: "Covers equipment for a Drone Experience workshop",
    icon: Rocket,
  },
  {
    amount: 500,
    description: "Supports an entire TopGolf networking event",
    icon: Gift,
  },
  {
    amount: 1000,
    description: "Sponsors a full week of Band Camp for multiple youth",
    icon: GraduationCap,
  },
];

const testimonials = [
  {
    quote:
      "ANDF changed my daughter's life. She went from being shy to performing on stage at Band Camp. This is what real investment in youth looks like.",
    name: "Parent of Band Camp Participant",
  },
  {
    quote:
      "The mentorship program connected me with people who genuinely cared about my future. I'm now a first-generation college student.",
    name: "HBCU Heroes Scholar",
  },
];

const trustSignals = [
  { label: "501(c)(3) Nonprofit", icon: Shield },
  { label: "100% Tax Deductible", icon: CheckCircle2 },
  { label: "Secure via Stripe", icon: CreditCard },
  { label: "2,000+ Youth Served", icon: Users },
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

/* ───────── payment form ───────── */

interface PaymentFormProps {
  amount: number;
  frequency: "one-time" | "monthly";
  donorInfo: { name: string; email: string; message: string };
  isAnonymous: boolean;
}

function PaymentForm({
  amount,
  frequency,
  donorInfo,
  isAnonymous,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    if (amount < 1) {
      setError("Please select a donation amount.");
      return;
    }

    if (frequency === "monthly" && !donorInfo.email) {
      setError("Email is required for monthly donations.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const card = elements.getElement(CardElement);
      if (!card) {
        setError("Card element not found. Please refresh and try again.");
        setProcessing(false);
        return;
      }

      let clientSecret: string;

      if (frequency === "one-time") {
        const res = await fetch("/api/donations/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            donorEmail: donorInfo.email,
            donorName: isAnonymous ? "Anonymous" : donorInfo.name,
            message: donorInfo.message,
            isAnonymous,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create payment");
        clientSecret = data.clientSecret;
      } else {
        const res = await fetch("/api/donations/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            donorEmail: donorInfo.email,
            donorName: isAnonymous ? "Anonymous" : donorInfo.name,
            frequency: "monthly",
          }),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Failed to create subscription");
        clientSecret = data.clientSecret;
      }

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              name: isAnonymous ? "Anonymous" : donorInfo.name || undefined,
              email: donorInfo.email || undefined,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed. Please try again.");
        setProcessing(false);
        return;
      }

      const params = new URLSearchParams();
      params.set("amount", String(amount));
      if (donorInfo.name && !isAnonymous) params.set("name", donorInfo.name);
      router.push(`/donate/thank-you?${params.toString()}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setProcessing(false);
    }
  };

  return (
    <>
      {/* Card element */}
      <div className="rounded-xl bg-white border border-neutral-200 p-4">
        <label className="text-sm font-medium text-foreground-muted mb-3 block">
          Card Details
        </label>
        <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4">
          <CardElement options={cardStyle} />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* Donate button */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={processing || !stripe}
        className="w-full py-4 rounded-xl bg-secondary-500 hover:bg-secondary-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-secondary-500/20 transition-colors"
        whileTap={processing ? {} : { scale: 0.98 }}
      >
        {processing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Heart className="h-5 w-5" />
            Donate{" "}
            {amount > 0 ? `$${amount.toLocaleString()}` : ""}{" "}
            {frequency === "monthly" ? "Monthly" : ""}
          </>
        )}
      </motion.button>
    </>
  );
}

/* ───────── page ───────── */

export default function DonatePage() {
  const [amount, setAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"one-time" | "monthly">(
    "one-time"
  );
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isAnonymous, setIsAnonymous] = useState(false);

  const displayAmount = amount || (customAmount ? parseInt(customAmount) : 0);

  return (
    <div className="pb-0">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/fnf-scholarship-2024.jpg"
            alt="ANDF scholarship recipients"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-32 lg:py-44 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <Heart className="h-4 w-4 text-secondary-400" />
            <span className="text-xs font-semibold text-white tracking-[0.2em] uppercase">
              Change a Life Today
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your Gift.{" "}
            <span className="text-secondary-400">Their Future.</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-neutral-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Every dollar you give goes directly to programs that transform young
            lives through music, mentorship, technology, and community.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <a
              href="#donate-form"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-colors shadow-lg shadow-secondary-500/30"
            >
              <Heart className="h-5 w-5" />
              Donate Now
            </a>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors"
            >
              See Our Impact
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="bg-primary-600 py-5">
        <div className="mx-auto max-w-5xl px-6 flex flex-wrap justify-center gap-6 sm:gap-12">
          {trustSignals.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-white"
            >
              <item.icon className="h-4 w-4 text-secondary-300" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Donate ── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
                Why Give
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Every Dollar{" "}
                <span className="text-secondary-500">Creates Opportunity</span>
              </h2>
              <p className="text-foreground-muted max-w-2xl mx-auto">
                A New Day Foundation is 100% committed to youth empowerment. Your
                donation funds programs that are always free to participants —
                because talent shouldn&apos;t depend on a price tag.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Music,
                num: "7",
                label: "Free Programs",
                desc: "From Band Camp to Drone Experience, every program is free for participants.",
                color: "bg-violet-100 text-violet-600",
              },
              {
                icon: Users,
                num: "2,000+",
                label: "Youth Served",
                desc: "Young people across Los Angeles have been empowered through ANDF programs.",
                color: "bg-secondary-100 text-secondary-600",
              },
              {
                icon: GraduationCap,
                num: "$50K+",
                label: "Scholarships Given",
                desc: "Scholarship funds awarded to students pursuing higher education.",
                color: "bg-primary-100 text-primary-600",
              },
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.1}>
                <div className="text-center p-8 rounded-2xl bg-white border border-neutral-200 hover:shadow-lg hover:border-primary-300 transition-all">
                  <div
                    className={`h-16 w-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <item.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {item.num}
                  </div>
                  <div className="text-sm font-semibold text-foreground mb-2">
                    {item.label}
                  </div>
                  <p className="text-sm text-foreground-muted">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="py-16 px-6 bg-primary-50">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="relative p-8 rounded-2xl bg-white border border-primary-200 shadow-sm"
                >
                  <Quote className="h-8 w-8 text-primary-200 mb-4" />
                  <p className="text-foreground leading-relaxed italic mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-primary-500">
                    — {t.name}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Donation Form ── */}
      <section id="donate-form" className="py-20 px-6 scroll-mt-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
                Make Your Gift
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Choose Your{" "}
                <span className="text-secondary-500">Impact</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <FadeIn className="lg:col-span-3">
              <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm p-8 space-y-8">
                {/* Frequency toggle */}
                <div>
                  <label className="text-sm font-medium text-foreground-muted mb-3 block">
                    Donation Type
                  </label>
                  <div className="flex rounded-xl bg-neutral-100 p-1">
                    <button
                      onClick={() => setFrequency("one-time")}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        frequency === "one-time"
                          ? "bg-primary-500 text-white shadow-sm"
                          : "text-foreground-muted hover:text-foreground"
                      }`}
                    >
                      <CreditCard className="h-4 w-4" /> One-Time
                    </button>
                    <button
                      onClick={() => setFrequency("monthly")}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        frequency === "monthly"
                          ? "bg-primary-500 text-white shadow-sm"
                          : "text-foreground-muted hover:text-foreground"
                      }`}
                    >
                      <Repeat className="h-4 w-4" /> Monthly
                    </button>
                  </div>
                  {frequency === "monthly" && (
                    <motion.p
                      className="mt-2 text-xs text-secondary-600 bg-secondary-50 rounded-lg px-3 py-2 flex items-center gap-1.5"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Monthly donors create sustained impact. Cancel anytime.
                    </motion.p>
                  )}
                </div>

                {/* Amount selection */}
                <div>
                  <label className="text-sm font-medium text-foreground-muted mb-3 block">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {presetAmounts.map((preset) => (
                      <motion.button
                        key={preset}
                        onClick={() => {
                          setAmount(preset);
                          setCustomAmount("");
                        }}
                        className={`py-4 rounded-xl text-lg font-bold transition-all border ${
                          amount === preset
                            ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20"
                            : "bg-neutral-50 text-foreground border-neutral-200 hover:border-primary-300"
                        }`}
                        whileTap={{ scale: 0.97 }}
                      >
                        ${preset.toLocaleString()}
                      </motion.button>
                    ))}
                  </div>
                  <div className="mt-3 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted font-semibold">
                      $
                    </span>
                    <Input
                      placeholder="Other amount"
                      type="number"
                      min={1}
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setAmount(null);
                      }}
                      className="text-center text-lg pl-8"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

                {/* Donor info */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground-muted block">
                    Your Information
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="donorName"
                      placeholder="Full Name"
                      value={donorInfo.name}
                      onChange={(e) =>
                        setDonorInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      disabled={isAnonymous}
                    />
                    <Input
                      id="donorEmail"
                      placeholder="Email Address"
                      type="email"
                      value={donorInfo.email}
                      onChange={(e) =>
                        setDonorInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Input
                    id="donorMessage"
                    placeholder="Add a message (optional)"
                    value={donorInfo.message}
                    onChange={(e) =>
                      setDonorInfo((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="accent-primary-500 h-4 w-4"
                    />
                    <label
                      htmlFor="anonymous"
                      className="text-sm text-foreground-muted"
                    >
                      Make this donation anonymous
                    </label>
                  </div>
                </div>

                {/* Payment form with Stripe Elements */}
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    amount={displayAmount}
                    frequency={frequency}
                    donorInfo={donorInfo}
                    isAnonymous={isAnonymous}
                  />
                </Elements>

                <div className="flex items-center justify-center gap-4 text-xs text-foreground-subtle">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" />
                    256-bit encryption
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Tax-deductible
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    Powered by Stripe
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Impact sidebar */}
            <FadeIn className="lg:col-span-2 space-y-6" delay={0.15}>
              <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm p-8 space-y-5">
                <h3 className="font-display text-2xl font-bold text-foreground">
                  Your Impact
                </h3>
                <p className="text-sm text-foreground-muted">
                  See exactly where your money goes:
                </p>

                <div className="space-y-3">
                  {impactItems.map((item) => {
                    const active = displayAmount >= item.amount;
                    return (
                      <motion.div
                        key={item.amount}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                          active
                            ? "bg-primary-50 border border-primary-200"
                            : "bg-neutral-50 border border-transparent"
                        }`}
                        animate={{ scale: active ? 1.02 : 1 }}
                      >
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                            active
                              ? "bg-primary-500 text-white"
                              : "bg-neutral-200 text-neutral-500"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`text-sm font-bold ${
                              active
                                ? "text-primary-600"
                                : "text-foreground-subtle"
                            }`}
                          >
                            ${item.amount}
                          </span>
                          <p
                            className={`text-sm ${
                              active
                                ? "text-foreground"
                                : "text-foreground-muted"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                        {active && (
                          <CheckCircle2 className="h-5 w-5 text-primary-500 shrink-0 ml-auto" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Recent donors */}
              <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm p-8 space-y-4">
                <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <Heart className="h-5 w-5 text-secondary-500" />
                  Recent Supporters
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Sarah M.", amount: "$100", time: "2 hours ago" },
                    {
                      name: "James & Lisa K.",
                      amount: "$250",
                      time: "5 hours ago",
                    },
                    { name: "Anonymous", amount: "$50", time: "Yesterday" },
                    {
                      name: "The Williams Family",
                      amount: "$500",
                      time: "2 days ago",
                    },
                    { name: "Robert C.", amount: "$25", time: "3 days ago" },
                  ].map((donor) => (
                    <div
                      key={donor.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center">
                          <Heart className="h-4 w-4 text-primary-500" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {donor.name}
                          </span>
                          <p className="text-xs text-foreground-subtle">
                            {donor.time}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-secondary-500">
                        {donor.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax info */}
              <div className="rounded-2xl bg-green-50 border border-green-200 p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">
                    Tax Deductible
                  </h4>
                </div>
                <p className="text-sm text-green-700">
                  A New Day Foundation is a registered 501(c)(3) nonprofit.
                  You&apos;ll receive a receipt for your tax records.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Other Ways to Give ── */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                More Ways to{" "}
                <span className="text-secondary-500">Make a Difference</span>
              </h2>
              <p className="text-foreground-muted max-w-xl mx-auto">
                Financial donations are just one way to support our mission.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Volunteer",
                desc: "Give your time as a mentor, event volunteer, or program facilitator.",
                href: "/contact",
                color: "bg-violet-100 text-violet-600",
              },
              {
                icon: Sparkles,
                title: "Corporate Sponsorship",
                desc: "Partner with us and bring your organization's values to life.",
                href: "/contact",
                color: "bg-secondary-100 text-secondary-600",
              },
              {
                icon: Gift,
                title: "In-Kind Donations",
                desc: "Donate instruments, equipment, technology, or supplies.",
                href: "/contact",
                color: "bg-primary-100 text-primary-600",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <Link
                  href={item.href}
                  className="group block p-8 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all text-center"
                >
                  <div
                    className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground-muted mb-4">
                    {item.desc}
                  </p>
                  <span className="text-sm text-primary-500 font-medium flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo + CTA ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/community-group.jpg"
            alt="ANDF community"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center space-y-6">
          <FadeIn>
            <Heart className="h-10 w-10 text-secondary-300 mx-auto mb-2" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
              Be Part of{" "}
              <span className="text-secondary-300">Something Bigger</span>
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              When you give to ANDF, you&apos;re not just donating — you&apos;re
              investing in the next generation of leaders, artists, and dreamers.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="#donate-form"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-colors shadow-lg"
              >
                <Heart className="h-5 w-5" />
                Donate Now
              </a>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
