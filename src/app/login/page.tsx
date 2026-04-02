"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      resetEmail,
      { redirectTo: `${window.location.origin}/admin/settings` }
    );

    if (resetError) {
      setError(resetError.message);
      setResetLoading(false);
      return;
    }

    setResetSuccess(true);
    setResetLoading(false);
  };

  if (!mounted) return <div className="h-64" />;

  return (
    <AnimatePresence mode="wait">
      {showReset ? (
        <motion.div
          key="reset"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {resetSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Check Your Email
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                We&apos;ve sent a password reset link to{" "}
                <span className="text-gold-400 font-medium">{resetEmail}</span>.
                Follow the instructions to reset your password.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowReset(false);
                  setResetSuccess(false);
                  setError("");
                }}
                className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors mt-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="text-center space-y-2">
                <h3 className="font-display text-xl font-bold text-white">
                  Reset Password
                </h3>
                <p className="text-sm text-white/50">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/40">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    type="email"
                    placeholder="admin@anewdayfoundation.net"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-semibold shadow-lg shadow-gold-500/20"
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" /> Send Reset Link
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setShowReset(false);
                  setError("");
                }}
                className="w-full inline-flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </button>
            </form>
          )}
        </motion.div>
      ) : (
        <motion.form
          key="login"
          onSubmit={handleLogin}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/40">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="email"
                placeholder="admin@anewdayfoundation.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/40">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-semibold shadow-lg shadow-gold-500/20 transition-all"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" /> Sign In to Dashboard
              </>
            )}
          </Button>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setShowReset(true);
                setResetEmail(email);
                setError("");
              }}
              className="text-sm text-white/40 hover:text-gold-400 transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gallery/opening-panel.jpg"
          alt="ANDF Community"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/95 via-[#1a1a2e]/90 to-primary-900/85" />
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 h-64 w-64 rounded-full bg-gold-500/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-primary-500/5 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Glass card */}
        <div className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/40">
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-5 mb-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative h-16 w-16">
                <Image
                  src="/images/logo/andf-logo.png"
                  alt="A New Day Foundation"
                  fill
                  className="object-contain"
                  sizes="64px"
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Welcome Back
              </h1>
              <p className="text-sm text-white/40">
                Sign in to the ANDF admin dashboard
              </p>
            </motion.div>

            {/* Staff badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20"
            >
              <Sparkles className="h-3 w-3 text-gold-400" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-400">
                Staff Portal
              </span>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Suspense fallback={<div className="h-64" />}>
              <LoginForm />
            </Suspense>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 pt-6 border-t border-white/[0.06] text-center"
          >
            <p className="text-[11px] text-white/20 leading-relaxed">
              Protected by A New Day Foundation
              <br />
              Unauthorized access is prohibited
            </p>
          </motion.div>
        </div>

        {/* Back to site link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-6"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to A New Day Foundation
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
