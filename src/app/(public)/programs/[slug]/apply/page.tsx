"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
  Music,
  Cpu,
  Target,
  Users,
  GraduationCap,
  MessageCircle,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* ─────────────────────────────────────────────── */
/*  Program metadata for display                   */
/* ─────────────────────────────────────────────── */

const programMeta: Record<
  string,
  { title: string; description: string; color: string; icon: React.ElementType }
> = {
  "band-camp": {
    title: "Band Camp",
    description:
      "An immersive musical experience where young people discover their rhythm and build confidence.",
    color: "from-violet-500 to-purple-600",
    icon: Music,
  },
  "drone-experience": {
    title: "Drone Experience",
    description:
      "Hands-on drone piloting and aerial photography workshops for aspiring tech leaders.",
    color: "from-cyan-500 to-blue-600",
    icon: Cpu,
  },
  topgolf: {
    title: "TopGolf Experience",
    description: "Sports, networking, and mentorship in an exciting environment.",
    color: "from-emerald-500 to-green-600",
    icon: Target,
  },
  mentorship: {
    title: "Mentorship Program",
    description: "One-on-one and group mentoring with successful professionals.",
    color: "from-amber-500 to-orange-600",
    icon: Users,
  },
  "hbcu-heroes": {
    title: "HBCU Heroes",
    description:
      "Spotlighting the achievements of Historically Black Colleges and Universities.",
    color: "from-primary-500 to-primary-700",
    icon: GraduationCap,
  },
  mentors: {
    title: "MenTORS",
    description: "Real conversations, real growth, real mentorship for men.",
    color: "from-red-500 to-rose-600",
    icon: MessageCircle,
  },
  "sisters-hangout": {
    title: "Sisters Hangout",
    description: "A supportive space for young women to connect, grow, and lead.",
    color: "from-rose-700 to-red-900",
    icon: Heart,
  },
};

/* ─────────────────────────────────────────────── */
/*  Confetti particles                             */
/* ─────────────────────────────────────────────── */

function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = [
    "bg-primary-500",
    "bg-secondary-500",
    "bg-emerald-400",
    "bg-amber-400",
    "bg-violet-400",
    "bg-rose-400",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = 6 + Math.random() * 8;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      className={`absolute rounded-sm ${color}`}
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: -10,
        rotate: rotation,
      }}
      initial={{ y: -20, opacity: 1 }}
      animate={{
        y: [0, 400 + Math.random() * 200],
        x: [0, (Math.random() - 0.5) * 200],
        rotate: rotation + Math.random() * 720,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 2 + Math.random() * 1.5,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

/* ─────────────────────────────────────────────── */
/*  Main Page                                      */
/* ─────────────────────────────────────────────── */

export default function ProgramApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const program = programMeta[slug];

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [age, setAge] = useState<number | undefined>(undefined);

  if (!program) {
    return (
      <div className="pt-32 pb-24 px-6 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Program Not Found
        </h1>
        <Link href="/programs" className="text-primary-500 mt-4 inline-block">
          Back to Programs
        </Link>
      </div>
    );
  }

  const Icon = program.icon;
  const isMinor = age !== undefined && age < 18;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      programSlug: slug,
      applicantName: (fd.get("name") as string) || "",
      applicantEmail: (fd.get("email") as string) || "",
      applicantPhone: (fd.get("phone") as string) || "",
      applicantAge: fd.get("age") ? Number(fd.get("age")) : undefined,
      guardianName: (fd.get("guardianName") as string) || "",
      guardianEmail: (fd.get("guardianEmail") as string) || "",
      guardianPhone: (fd.get("guardianPhone") as string) || "",
      formData: {
        interest: (fd.get("interest") as string) || "",
        goals: (fd.get("goals") as string) || "",
        experience: (fd.get("experience") as string) || "",
        referralSource: (fd.get("referralSource") as string) || "",
      },
    };

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Application failed. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Success State ── */
  if (submitted) {
    const confettiParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.8,
      x: Math.random() * 100,
    }));

    return (
      <div className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiParticles.map((p) => (
            <ConfettiParticle key={p.id} delay={p.delay} x={p.x} />
          ))}
        </div>

        <div className="mx-auto max-w-lg text-center space-y-6 relative z-10">
          <motion.div
            className="mx-auto h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Sparkles className="h-10 w-10 text-primary-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="font-display text-3xl font-bold text-foreground">
              Application Submitted!
            </h1>
            <p className="text-foreground-muted text-lg">
              Thank you for applying to{" "}
              <span className="font-semibold text-foreground">
                {program.title}
              </span>
              . We&apos;ve received your application and will be in touch soon.
            </p>
            <p className="text-foreground-muted">
              You&apos;ll receive a confirmation email with next steps shortly.
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center gap-4 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href={`/programs/${slug}`}>
              <Button variant="secondary">Back to Program</Button>
            </Link>
            <Link href="/programs">
              <Button variant="primary">View All Programs</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Form State ── */
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/programs/${slug}`}
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary-500 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {program.title}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Program Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`h-14 w-14 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center`}
            >
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Apply to {program.title}
              </h1>
              <p className="text-foreground-muted mt-1">{program.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Personal Info */}
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                Personal Information
              </h2>
              <p className="text-sm text-foreground-muted">
                Tell us about yourself.
              </p>
            </div>

            <Input
              id="name"
              name="name"
              label="Full Name"
              placeholder="Your full name"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                required
              />
              <Input
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="(555) 555-5555"
              />
            </div>

            <Input
              id="age"
              name="age"
              label="Age"
              type="number"
              placeholder="16"
              min={5}
              max={99}
              onChange={(e) =>
                setAge(e.target.value ? Number(e.target.value) : undefined)
              }
            />

            {/* Guardian Info — conditional */}
            <AnimatePresence>
              {isMinor && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                    Since you are under 18, a parent or guardian must be listed.
                  </div>
                  <Input
                    id="guardianName"
                    name="guardianName"
                    label="Guardian Name"
                    placeholder="Parent or guardian full name"
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="guardianEmail"
                      name="guardianEmail"
                      label="Guardian Email"
                      type="email"
                      placeholder="guardian@example.com"
                      required
                    />
                    <Input
                      id="guardianPhone"
                      name="guardianPhone"
                      label="Guardian Phone"
                      type="tel"
                      placeholder="(555) 555-5555"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Program Questions */}
            <div className="space-y-1 pt-4">
              <h2 className="text-lg font-semibold text-foreground">
                Tell Us More
              </h2>
              <p className="text-sm text-foreground-muted">
                Help us understand your interest in {program.title}.
              </p>
            </div>

            <Textarea
              id="interest"
              name="interest"
              label="Why are you interested in this program?"
              placeholder="Share what excites you about this program..."
              required
            />

            <Textarea
              id="goals"
              name="goals"
              label="What do you hope to gain?"
              placeholder="What skills, experiences, or connections are you looking for..."
              required
            />

            <Textarea
              id="experience"
              name="experience"
              label="Any relevant experience?"
              placeholder="Tell us about any related experience, skills, or activities..."
            />

            <div className="space-y-1.5">
              <label
                htmlFor="referralSource"
                className="text-sm font-medium text-foreground-muted"
              >
                How did you hear about us?
              </label>
              <select
                id="referralSource"
                name="referralSource"
                className="flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground placeholder:text-foreground-subtle transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500"
                required
              >
                <option value="">Select an option</option>
                <option value="website">Website</option>
                <option value="social_media">Social Media</option>
                <option value="friend">Friend or Family</option>
                <option value="school">School</option>
                <option value="community_event">Community Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 accent-primary-500"
                required
              />
              <label
                htmlFor="terms"
                className="text-sm text-foreground-muted"
              >
                I agree to the terms and conditions and confirm that the
                information provided is accurate. I understand that submitting
                this application does not guarantee acceptance into the program.
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting
                  Application...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Submit Application
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
