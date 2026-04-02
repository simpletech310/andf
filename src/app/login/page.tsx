"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

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
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/admin/settings`,
    });

    if (resetError) {
      setError(resetError.message);
      setResetLoading(false);
      return;
    }

    setResetSuccess(true);
    setResetLoading(false);
  };

  if (showReset) {
    return (
      <div className="space-y-4">
        {resetSuccess ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-green-400 bg-green-500/10 rounded-lg px-4 py-3">
              Check your email for a reset link.
            </p>
            <button
              type="button"
              onClick={() => { setShowReset(false); setResetSuccess(false); setError(""); }}
              className="text-sm text-gold-500 hover:text-gold-400 transition-colors"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-foreground-muted text-center">
              Enter your email and we'll send you a reset link.
            </p>
            <Input
              id="reset-email"
              label="Email"
              type="email"
              placeholder="admin@anewdayfoundation.net"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2">{error}</p>
            )}

            <Button type="submit" variant="primary" className="w-full" size="lg" disabled={resetLoading}>
              {resetLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
              ) : (
                "Send Reset Link"
              )}
            </Button>
            <button
              type="button"
              onClick={() => { setShowReset(false); setError(""); }}
              className="w-full text-sm text-foreground-muted hover:text-foreground transition-colors"
            >
              Back to sign in
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="admin@anewdayfoundation.net"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2">{error}</p>
      )}

      <Button type="submit" variant="primary" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
        ) : (
          <><Lock className="h-4 w-4" /> Sign In</>
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => { setShowReset(true); setResetEmail(email); setError(""); }}
          className="text-sm text-foreground-muted hover:text-gold-500 transition-colors"
        >
          Forgot password?
        </button>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-gold-500 flex items-center justify-center text-background font-display font-bold text-2xl">
            A
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Login</h1>
          <p className="text-foreground-muted">Sign in to manage A New Day Foundation</p>
        </div>

        <Suspense fallback={<div className="h-40" />}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
