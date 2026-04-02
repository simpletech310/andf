"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Mail, Play, Upload, FileVideo, Check, ArrowLeft,
  Sparkles, AlertCircle, ChevronRight, Film, Tag,
  AlignLeft, Package,
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
  { id: "starter", name: "Starter — $250 (2 months, up to 15s)" },
  { id: "growth", name: "Growth — $500 (4 months, up to 30s)" },
  { id: "premium", name: "Premium — $1,000 (8 months, up to 60s)" },
  { id: "annual", name: "Annual Partner — $1,750 (12 months, up to 60s)" },
];

/* ───── page ───── */

type Step = "email" | "details" | "submitted";

export default function SponsorSubmitPage() {
  const [step, setStep] = useState<Step>("email");

  // Email verification
  const [email, setEmail] = useState("");
  const [sponsorId, setSponsorId] = useState("");
  const [sponsorName, setSponsorName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // Ad details
  const [selectedPackage, setSelectedPackage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Email verification ── */
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setVerifyError("");

    try {
      const res = await fetch(`/api/sponsors/lookup?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Sponsor not found");
      }
      const data = await res.json();
      setSponsorId(data.sponsor.id);
      setSponsorName(data.sponsor.business_name);
      setStep("details");
    } catch (err) {
      setVerifyError(
        err instanceof Error
          ? err.message
          : "Could not verify email. Please make sure you have registered as a sponsor first."
      );
    } finally {
      setVerifying(false);
    }
  };

  /* ── Ad submission ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      // For now, use a placeholder URL. Staff will handle video ingestion via admin.
      const videoUrl = videoFile
        ? `pending-upload://${videoFile.name}`
        : "";

      if (!videoUrl) {
        throw new Error("Please select a video file");
      }

      const res = await fetch("/api/sponsors/submit-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsorId,
          packageId: selectedPackage,
          title,
          description,
          videoUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setStep("submitted");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="pb-0">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-600 to-primary-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl px-6 py-24 lg:py-32 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <Upload className="h-4 w-4 text-secondary-300" />
            <span className="text-xs font-semibold text-white tracking-[0.2em] uppercase">
              Submit Your Ad
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Upload Your{" "}
            <span className="text-secondary-300">Sponsor Video</span>
          </motion.h1>

          <motion.p
            className="text-lg text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Already registered? Submit your ad video for review. Our team will
            review it within 48 hours and get your campaign live.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/sponsor"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Not registered yet? Sign up as a sponsor
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Form Area ── */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="mx-auto max-w-2xl">
          {/* ── Progress Indicator ── */}
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-12">
              {[
                { key: "email", label: "Verify Email", num: 1 },
                { key: "details", label: "Ad Details", num: 2 },
                { key: "submitted", label: "Submitted", num: 3 },
              ].map((s, i) => {
                const isActive = s.key === step;
                const isDone =
                  (s.key === "email" && (step === "details" || step === "submitted")) ||
                  (s.key === "details" && step === "submitted");
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    {i > 0 && (
                      <div className={`w-8 h-px ${isDone || isActive ? "bg-primary-500" : "bg-neutral-300"}`} />
                    )}
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isDone
                            ? "bg-green-500 text-white"
                            : isActive
                            ? "bg-primary-500 text-white"
                            : "bg-neutral-200 text-foreground-muted"
                        }`}
                      >
                        {isDone ? <Check className="h-4 w-4" /> : s.num}
                      </div>
                      <span
                        className={`text-sm font-medium hidden sm:block ${
                          isActive ? "text-foreground" : "text-foreground-muted"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          {/* ── Step 1: Email Verification ── */}
          {step === "email" && (
            <FadeIn>
              <form
                onSubmit={handleVerifyEmail}
                className="rounded-3xl bg-white border border-neutral-200 p-8 sm:p-10 shadow-sm space-y-6"
              >
                <div className="text-center space-y-2 mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto">
                    <Mail className="h-7 w-7" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Verify Your Email
                  </h2>
                  <p className="text-sm text-foreground-muted">
                    Enter the email address you used when registering as a sponsor.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Sponsor Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {verifyError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-6 text-base"
                  disabled={verifying}
                >
                  {verifying ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Continue
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>

                <p className="text-xs text-foreground-subtle text-center">
                  Need to register first?{" "}
                  <Link href="/sponsor" className="text-primary-500 hover:underline">
                    Sign up as a sponsor
                  </Link>
                </p>
              </form>
            </FadeIn>
          )}

          {/* ── Step 2: Ad Details ── */}
          {step === "details" && (
            <FadeIn>
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl bg-white border border-neutral-200 p-8 sm:p-10 shadow-sm space-y-6"
              >
                <div className="text-center space-y-2 mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto">
                    <Film className="h-7 w-7" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Ad Details
                  </h2>
                  <p className="text-sm text-foreground-muted">
                    Welcome back, <strong>{sponsorName}</strong>. Fill in your ad details below.
                  </p>
                </div>

                {/* Package Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Sponsorship Package *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <select
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                      required
                    >
                      <option value="">Select a package...</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ad Title */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Ad Title *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Summer Sale — 20% Off Everything"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Description
                  </label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-foreground-subtle" />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of your ad content..."
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    />
                  </div>
                </div>

                {/* Video Upload */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Video File *
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {videoFile ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3"
                    >
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <FileVideo className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {videoFile.name}
                        </p>
                        <p className="text-xs text-foreground-muted">
                          {formatFileSize(videoFile.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </motion.div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-6 rounded-xl border-2 border-dashed border-neutral-300 hover:border-primary-400 hover:bg-primary-50/50 transition-colors text-center group"
                    >
                      <Upload className="h-8 w-8 text-neutral-400 group-hover:text-primary-500 mx-auto mb-2 transition-colors" />
                      <p className="text-sm font-medium text-foreground">
                        Click to select your video file
                      </p>
                      <p className="text-xs text-foreground-muted mt-1">
                        MP4, MOV, or WebM recommended
                      </p>
                    </button>
                  )}
                </div>

                {submitError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="px-6 py-3 rounded-xl bg-neutral-100 text-foreground font-semibold hover:bg-neutral-200 transition-colors text-sm"
                  >
                    Back
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 py-6 text-base"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Play className="h-5 w-5" />
                        Submit Ad for Review
                      </span>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-foreground-subtle text-center">
                  Your video will be reviewed by the ANDF team. Payment details
                  will be sent after approval.
                </p>
              </form>
            </FadeIn>
          )}

          {/* ── Step 3: Success ── */}
          {step === "submitted" && (
            <FadeIn>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-10 rounded-3xl bg-white border border-green-200 shadow-sm"
              >
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  Ad Submitted for Review!
                </h3>
                <p className="text-foreground-muted mb-6 max-w-md mx-auto">
                  Your ad has been submitted for review! Our team will review it
                  within 48 hours. We will contact you at{" "}
                  <strong>{email}</strong> with next steps and payment details.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/live"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    Watch ANDF Now!
                  </Link>
                  <Link
                    href="/sponsor"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-100 text-foreground font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    Back to Sponsor Page <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <FadeIn>
            <Sparkles className="h-8 w-8 text-primary-500 mx-auto" />
            <h2 className="font-display text-3xl font-bold text-foreground">
              Questions About <span className="text-secondary-500">Your Ad?</span>
            </h2>
            <p className="text-foreground-muted">
              Our team is here to help you create the perfect campaign.
              Reach out anytime and we will get you set up.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/sponsor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-100 text-foreground font-semibold hover:bg-neutral-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Sponsor Registration
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
