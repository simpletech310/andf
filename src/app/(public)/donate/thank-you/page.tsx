"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const name = searchParams.get("name");

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          className="mx-auto h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <Heart className="h-12 w-12 text-primary-500" />
        </motion.div>

        <motion.h1
          className="font-display text-4xl lg:text-5xl font-bold text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Thank You{name ? `, ${name}` : ""}!
        </motion.h1>

        <motion.p
          className="mt-4 text-xl text-foreground-muted max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {amount ? (
            <>
              Your generous <span className="font-semibold text-foreground">${Number(amount).toLocaleString()}</span> donation is making a real difference in the lives of young people.
            </>
          ) : (
            <>Your generous donation is making a real difference in the lives of young people.</>
          )}{" "}
          You&apos;re helping create A New Day for tomorrow&apos;s leaders.
        </motion.p>

        <motion.div
          className="mt-8 p-6 rounded-2xl bg-background-card border border-border inline-block"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-foreground-muted">A receipt has been sent to your email address.</p>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button variant="secondary" size="lg">
            <Share2 className="h-4 w-4" /> Share Your Support
          </Button>
          <Link href="/programs">
            <Button variant="primary" size="lg">
              Explore Our Programs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="pt-32 pb-24 px-6 text-center">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
