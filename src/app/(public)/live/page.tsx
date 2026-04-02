"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Radio, Heart, MessageSquare, Users, Send, Play, Clock, Eye, X,
  Calendar, ChevronRight, Tv, Sparkles, Film, Star, Zap, Bell,
  Share2, Megaphone, ArrowRight, Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

/* ───── lazy-load MuxStreamPlayer (client-only) ───── */
const MuxStreamPlayer = dynamic(() => import("@/components/live/MuxStreamPlayer"), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-neutral-100 rounded-2xl flex items-center justify-center">
      <div className="h-8 w-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  ),
});

/* ───── types & data ───── */

const VOD_CATEGORIES = ["All", "Past Streams", "Programs", "Events", "Behind the Scenes"] as const;

interface Video {
  id: string;
  title: string;
  description: string;
  category: (typeof VOD_CATEGORIES)[number];
  duration: string;
  date: string;
  views: number;
  image: string;
  program?: string;
  featured?: boolean;
  muxPlaybackId?: string;
}

const VIDEOS: Video[] = [
  { id: "1", title: "Band Camp Summer Showcase 2025", description: "Watch the full performance from our annual Band Camp Summer Showcase featuring talented young musicians performing original compositions and classic arrangements.", category: "Past Streams", duration: "1:42:30", date: "Aug 15, 2025", views: 2847, image: "/images/programs/band-camp-logo.jpg", program: "Band Camp", featured: true },
  { id: "2", title: "Drone Racing Championship", description: "The finals of our youth Drone Racing Championship — watch as pilots navigate obstacle courses at high speed with commentary and interviews.", category: "Events", duration: "58:15", date: "Jul 22, 2025", views: 1563, image: "/images/programs/drone-teach.jpg", program: "Drone Experience" },
  { id: "3", title: "Behind the Scenes: TopGolf Experience", description: "Go behind the scenes of our TopGolf Experience program. See how we use golf as a vehicle for mentorship and personal development.", category: "Behind the Scenes", duration: "12:45", date: "Jul 10, 2025", views: 984, image: "/images/programs/topgolf-logo.jpg", program: "TopGolf" },
  { id: "4", title: "Mentorship Program Spotlight", description: "Hear from mentors and mentees about the impact of our one-on-one mentorship program. Real stories of growth and transformation.", category: "Programs", duration: "28:30", date: "Jun 28, 2025", views: 1205, image: "/images/programs/mentorship-session.jpg", program: "Mentorship" },
  { id: "5", title: "HBCU Heroes Panel Discussion", description: "A powerful panel discussion with HBCU alumni sharing their journeys, the importance of historically Black colleges, and advice for students.", category: "Past Streams", duration: "1:15:00", date: "Jun 15, 2025", views: 3210, image: "/images/gallery/opening-panel.jpg", program: "HBCU Heroes", featured: true },
  { id: "6", title: "Youth Music Workshop Highlights", description: "Highlights from our weekend music workshops where young people learn instruments, songwriting, and production from professionals.", category: "Programs", duration: "35:20", date: "Jun 1, 2025", views: 756, image: "/images/gallery/knowledj-teaches.jpg", program: "Band Camp" },
  { id: "7", title: "Foundation Gala 2025 Recap", description: "Relive the magic of our 2025 Annual Gala — an evening of celebration, awards, and special guest speakers.", category: "Events", duration: "45:10", date: "May 18, 2025", views: 4102, image: "/images/gallery/leadership-group.jpg" },
  { id: "8", title: "Meet Our Mentors", description: "Get to know the dedicated volunteers who make our mentorship programs possible. Learn what drives them and the impact they see.", category: "Behind the Scenes", duration: "18:45", date: "May 5, 2025", views: 892, image: "/images/gallery/volunteer-leader.jpg", program: "Mentorship" },
  { id: "9", title: "NASA STEM Day Highlights", description: "Real NASA engineers spent the day with our students, proving that rocket science isn't just for textbooks. See the full experience.", category: "Programs", duration: "42:15", date: "Apr 20, 2025", views: 2105, image: "/images/gallery/nasa-team-teaches.jpg" },
  { id: "10", title: "Sisters Hangout Launch Event", description: "The inaugural Sisters Hangout event — an empowering afternoon of connection, creativity, and community for young women.", category: "Events", duration: "33:00", date: "Apr 8, 2025", views: 1340, image: "/images/programs/sisters-logo.jpg", program: "Sisters Hangout" },
  { id: "11", title: "FNF Scholarship Night 2024", description: "The emotional scholarship awards ceremony where deserving students received life-changing educational support.", category: "Past Streams", duration: "1:05:00", date: "Mar 22, 2025", views: 3890, image: "/images/gallery/fnf-scholarship-2024.jpg" },
  { id: "12", title: "Day in the Life: ANDF Staff", description: "Follow our passionate team through a typical day of changing lives — from program planning to community outreach.", category: "Behind the Scenes", duration: "15:30", date: "Mar 10, 2025", views: 678, image: "/images/gallery/siedah-garrett-dawnn.jpg" },
];

const upcomingStreams = [
  { title: "Band Camp Fall Showcase", date: "Oct 15, 2025", time: "6:00 PM PST" },
  { title: "HBCU Heroes: College Fair", date: "Nov 2, 2025", time: "10:00 AM PST" },
  { title: "Giving Tuesday Live", date: "Dec 3, 2025", time: "12:00 PM PST" },
];

interface ActiveAd {
  id: string;
  title: string;
  muxPlaybackId?: string;
  videoUrl?: string;
  durationSeconds: number;
  sponsorName: string;
  sponsorUrl: string;
  sponsorLogo: string;
  priority: number;
}

// Mux playback IDs for demo content
const MUX_CONTENT_PLAYBACK_ID = "DvUNmWbAG0100yvsdMvVzTod00dPKsJrL00xu1lG5MmsKIA";
const MUX_AD_PLAYBACK_ID = "3w9WlvYAhCZSPnUgrfnwK1mlP0087Kgp802tmOQowAaDU";

// Demo ad — served from Mux
const DEMO_AD: ActiveAd = {
  id: "demo_ad_1",
  title: "ANDF Sponsor Demo",
  muxPlaybackId: MUX_AD_PLAYBACK_ID,
  videoUrl: "/videos/ad1.mp4", // local fallback
  durationSeconds: 40,
  sponsorName: "Your Brand Here",
  sponsorUrl: "/sponsor",
  sponsorLogo: "",
  priority: 5,
};

// Demo content — served from Mux with local fallback
const DEMO_CONTENT_URL = "/videos/andf-content.mp4";
const DEMO_CONTENT_MUX = MUX_CONTENT_PLAYBACK_ID;

/* ───── helpers ───── */

/* ───── Live Donation Form (inside Stripe Elements) ───── */

function LiveDonationForm({ amount, onSuccess, onCancel }: { amount: number; onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/donations/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          donorName: name || "Live Stream Donor",
          donorEmail: email || "",
          isAnonymous: !name,
          message: "Donated during live stream",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || "Payment failed");

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement, billing_details: { name: name || "Anonymous", email: email || undefined } },
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        setProcessing(false);
        return;
      }

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <div className="text-3xl font-bold text-secondary-500">${amount}</div>
        <p className="text-sm text-foreground-muted">Live Stream Donation</p>
      </div>
      <Input placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Email (for receipt)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="p-3 rounded-lg bg-background-elevated border border-border">
        <CardElement options={{ style: { base: { fontSize: "16px", color: "#1C1917", "::placeholder": { color: "#78716C" } } } }} />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button type="submit" variant="primary" className="w-full" disabled={processing || !stripe}>
        {processing ? (
          <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
        ) : (
          <><Heart className="h-4 w-4" /> Donate ${amount}</>
        )}
      </Button>
      <button type="button" onClick={onCancel} className="w-full text-sm text-foreground-muted hover:text-foreground transition-colors">
        Cancel
      </button>
    </form>
  );
}

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

/* ───── page ───── */

export default function LivePage() {
  const [activeChannel, setActiveChannel] = useState<"channel_1" | "channel_2">("channel_1");
  const [isLive] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeAds, setActiveAds] = useState<ActiveAd[]>([DEMO_AD]);

  // Fetch active ads on mount (merge with demo ad)
  useEffect(() => {
    fetch("/api/ads/active")
      .then((r) => r.json())
      .then((data) => {
        const serverAds = data.ads || [];
        // Keep demo ad as fallback, add any server-side ads
        setActiveAds(serverAds.length > 0 ? serverAds : [DEMO_AD]);
      })
      .catch(() => {});
  }, []);

  const handleAdImpression = useCallback((adId: string, type: "view" | "click" | "skip") => {
    fetch("/api/ads/impression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId: adId, type, channel: activeChannel }),
    }).catch(() => {});
  }, [activeChannel]);

  const filteredVideos = activeCategory === "All" ? VIDEOS : VIDEOS.filter((v) => v.category === activeCategory);
  const featuredVideo = VIDEOS.find((v) => v.featured) || VIDEOS[0];

  return (
    <div className="pb-0">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/gallery/opening-panel.jpg" alt="ANDF Live" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-32 lg:py-44 text-center space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Tv className="h-4 w-4 text-secondary-400" />
            <span className="text-xs font-semibold text-white tracking-[0.2em] uppercase">A New Day Now!</span>
          </motion.div>

          <motion.h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Stream. <span className="text-secondary-400">Watch.</span>{" "}
            <span className="italic text-primary-300">Be Inspired.</span>
          </motion.h1>

          <motion.p className="text-lg sm:text-xl text-neutral-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Tune in live to ANDF events or explore our library of inspiring content — from program highlights to behind-the-scenes moments.
          </motion.p>

          <motion.div className="flex flex-wrap justify-center gap-4 pt-2"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link href="#channels" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-primary-600 font-semibold hover:bg-neutral-100 transition-colors">
              <Play className="h-4 w-4" />
              Watch Now
            </Link>
            <Link href="/sponsor" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-colors">
              <Megaphone className="h-4 w-4" />
              Advertise With Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-primary-600 py-6">
        <div className="mx-auto max-w-5xl px-6 flex flex-wrap justify-center gap-8 sm:gap-16">
          {[
            { icon: Film, num: "12+", label: "Videos" },
            { icon: Eye, num: "15K+", label: "Total Views" },
            { icon: Clock, num: "50+", label: "Hours of Content" },
            { icon: Monitor, num: "2", label: "Live Channels" },
          ].map((s) => (
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

      {/* ── Live Stream Channels ── */}
      <section id="channels" className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                  isLive ? "bg-red-50 border-red-200" : "bg-neutral-100 border-neutral-200"
                }`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-neutral-400"}`} />
                  <span className={`text-sm font-bold uppercase tracking-wider ${isLive ? "text-red-600" : "text-neutral-500"}`}>
                    {isLive ? "Live Now" : "Offline"}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">Live Channels</h2>
              </div>

              {/* Channel tabs */}
              <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
                {(["channel_1", "channel_2"] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setActiveChannel(ch)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeChannel === ch
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    <Radio className="h-3.5 w-3.5" />
                    {ch === "channel_1" ? "Channel 1" : "Channel 2"}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video player area */}
            <FadeIn className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden border border-border bg-neutral-900">
                {/* Mux player — demo content with ad insertion at 10s */}
                <MuxStreamPlayer
                  playbackId={isLive ? (activeChannel === "channel_1" ? "LIVE_PLAYBACK_ID_1" : "LIVE_PLAYBACK_ID_2") : DEMO_CONTENT_MUX}
                  videoUrl={!isLive ? DEMO_CONTENT_URL : undefined}
                  isLive={isLive}
                  title={`ANDF Now! ${activeChannel === "channel_1" ? "Channel 1" : "Channel 2"}`}
                  channel={activeChannel}
                  ads={activeAds}
                  adBreakAt={10}
                  adIntervalMinutes={15}
                  onAdImpression={handleAdImpression}
                />

                {isLive && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 z-30">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-sm font-bold">
                      <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      LIVE
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                      <Users className="h-3.5 w-3.5" /> 142 watching
                    </div>
                  </div>
                )}
              </div>

              {/* Stream info */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    A New Day Now! — {activeChannel === "channel_1" ? "Channel 1" : "Channel 2"}
                  </h3>
                  <p className="text-sm text-foreground-muted mt-1">
                    Watch live events, programs, and special ANDF broadcasts
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background-card border border-border text-foreground-muted text-sm hover:border-primary-300 transition-colors">
                    <Bell className="h-4 w-4" /> Notify Me
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background-card border border-border text-foreground-muted text-sm hover:border-primary-300 transition-colors">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Sidebar */}
            <FadeIn className="lg:col-span-1 space-y-4" delay={0.1}>
              {/* Donation panel */}
              <div className="rounded-2xl bg-background-card border border-border p-5 space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Heart className="h-5 w-5 text-secondary-500" /> Support Live
                </h3>
                <p className="text-sm text-foreground-muted">
                  Donate during streams and see your support appear live!
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 25, 50].map((amt) => (
                    <button key={amt} onClick={() => setDonationAmount(String(amt))}
                      className={`py-2.5 rounded-lg text-sm font-bold border transition-all ${
                        donationAmount === String(amt)
                          ? "bg-secondary-500 text-white border-secondary-500"
                          : "bg-background-elevated text-foreground-muted border-border hover:border-secondary-400"
                      }`}>
                      ${amt}
                    </button>
                  ))}
                </div>
                <Input placeholder="Custom amount" type="number" min={1} value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={!donationAmount || Number(donationAmount) < 1}
                  onClick={() => {
                    setDonationSuccess(false);
                    setShowDonationModal(true);
                  }}
                >
                  <Heart className="h-4 w-4" />
                  Donate {donationAmount ? `$${donationAmount}` : ""}
                </Button>
              </div>

              {/* Sponsor CTA */}
              <Link href="/sponsor" className="block rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-5 text-white hover:from-primary-600 hover:to-primary-700 transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <Megaphone className="h-5 w-5" />
                  <h3 className="font-semibold">Advertise Here</h3>
                </div>
                <p className="text-sm text-white/80 mb-3">
                  Put your brand in front of our engaged community. Packages start at $250.
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 group-hover:text-white">
                  Learn More <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Upcoming streams */}
              <div className="rounded-2xl bg-background-card border border-border p-5 space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-500" /> Upcoming Streams
                </h3>
                <div className="space-y-3">
                  {upcomingStreams.map((stream, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-background-elevated border border-border hover:border-primary-300 transition-colors">
                      <div className="h-10 w-10 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                        <Play className="h-4 w-4 text-primary-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{stream.title}</p>
                        <p className="text-xs text-foreground-muted mt-0.5">{stream.date} · {stream.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div className="rounded-2xl bg-background-card border border-border overflow-hidden flex flex-col h-[280px]">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary-500" /> Live Chat
                  </h3>
                  <span className={`text-xs uppercase tracking-wider ${isLive ? "text-green-500" : "text-foreground-subtle"}`}>
                    {isLive ? "Active" : "Offline"}
                  </span>
                </div>
                <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center">
                  <p className="text-sm text-foreground-subtle text-center">
                    {isLive ? "No messages yet. Say hello!" : "Chat activates during live streams"}
                  </p>
                </div>
                <div className="p-3 border-t border-border">
                  <div className="flex gap-2">
                    <Input placeholder="Type a message..." className="flex-1" disabled={!isLive} />
                    <Button variant="primary" size="icon" disabled={!isLive}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Featured Content ── */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden bg-white border border-border shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-video lg:aspect-auto lg:min-h-[400px]">
                  <Image src={featuredVideo.image} alt={featuredVideo.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent lg:hidden" />
                  <button onClick={() => setSelectedVideo(featuredVideo)} className="absolute inset-0 flex items-center justify-center group/play">
                    <motion.div className="h-20 w-20 rounded-full bg-secondary-500/90 flex items-center justify-center shadow-2xl shadow-secondary-500/30 group-hover/play:bg-secondary-500 transition-colors" whileHover={{ scale: 1.1 }}>
                      <Play className="h-8 w-8 text-white ml-1" />
                    </motion.div>
                  </button>
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-500 text-white text-xs font-bold uppercase tracking-wider">
                    <Star className="h-3.5 w-3.5" /> Featured
                  </div>
                </div>

                <div className="p-8 lg:p-10 flex flex-col justify-center space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-500">{featuredVideo.category}</span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-xs text-foreground-muted">{featuredVideo.duration}</span>
                  </div>
                  <h3 className="font-display text-3xl lg:text-4xl font-bold text-foreground">{featuredVideo.title}</h3>
                  <p className="text-foreground-muted leading-relaxed">{featuredVideo.description}</p>
                  <div className="flex items-center gap-6 text-sm text-foreground-subtle">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{featuredVideo.date}</span>
                    <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />{featuredVideo.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={() => setSelectedVideo(featuredVideo)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors">
                      <Play className="h-4 w-4" /> Watch Now
                    </button>
                    {featuredVideo.program && (
                      <Link href={`/programs/${featuredVideo.program.toLowerCase().replace(/\s+/g, "-")}`} className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 transition-colors">
                        View Program <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Video Library ── */}
      <section id="library" className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">On Demand Library</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
                Watch <span className="text-secondary-500">Anytime</span>
              </h2>
              <p className="text-foreground-muted max-w-xl mx-auto">
                Past streams, program highlights, event recaps, and exclusive behind-the-scenes content.
              </p>
            </div>
          </FadeIn>

          {/* Category filters */}
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {VOD_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setSelectedVideo(null); }}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary-500 text-white"
                      : "bg-background-card text-foreground-muted border border-border hover:border-primary-300 hover:text-foreground"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Selected video player */}
          <AnimatePresence mode="wait">
            {selectedVideo && (
              <motion.div key={selectedVideo.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="overflow-hidden mb-10">
                <div className="rounded-2xl bg-background-card border border-border overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-2 relative">
                      <MuxStreamPlayer
                        playbackId={selectedVideo.muxPlaybackId || DEMO_CONTENT_MUX}
                        videoUrl={DEMO_CONTENT_URL}
                        title={selectedVideo.title}
                        ads={activeAds}
                        adBreakAt={10}
                        adIntervalMinutes={10}
                        onAdImpression={handleAdImpression}
                      />
                    </div>

                    <div className="p-6 space-y-4 relative">
                      <button onClick={() => setSelectedVideo(null)} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background-elevated flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                      <span className="inline-block text-xs font-semibold uppercase tracking-wider text-secondary-500">{selectedVideo.category}</span>
                      <h3 className="font-display text-xl font-bold text-foreground pr-8">{selectedVideo.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-foreground-subtle">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{selectedVideo.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{selectedVideo.duration}</span>
                        <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{selectedVideo.views.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-foreground-muted leading-relaxed">{selectedVideo.description}</p>
                      {selectedVideo.program && (
                        <div className="pt-2">
                          <Link href={`/programs/${selectedVideo.program.toLowerCase().replace(/\s+/g, "-")}`} className="inline-flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 transition-colors">
                            View {selectedVideo.program} Program <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="wait">
              {filteredVideos.map((video, i) => (
                <motion.button key={video.id} onClick={() => setSelectedVideo(video)}
                  className={`group w-full text-left rounded-2xl overflow-hidden bg-background-card border transition-all duration-300 ${
                    selectedVideo?.id === video.id
                      ? "border-primary-500 shadow-[0_0_20px_rgba(47,49,146,0.15)]"
                      : "border-border hover:border-primary-300 hover:shadow-md"
                  }`}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }} whileHover={{ y: -4 }}>
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={video.image} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-12 w-12 rounded-full bg-secondary-500/90 flex items-center justify-center shadow-lg">
                        <Play className="h-5 w-5 text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded px-2 py-0.5 text-xs font-medium text-white">{video.duration}</div>
                    {video.featured && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-500 text-white text-[10px] font-bold uppercase">
                        <Star className="h-3 w-3" /> Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary-500 transition-colors">{video.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-foreground-subtle">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{video.date}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{video.views.toLocaleString()}</span>
                    </div>
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded">{video.category}</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-foreground-muted">No videos in this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Watch Section ── */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-14">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Why Watch <span className="text-secondary-500">A New Day Now?</span>
              </h2>
              <p className="text-foreground-muted max-w-xl mx-auto">Every stream brings you closer to the mission and the community.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "Exclusive Content", desc: "Behind-the-scenes access and stories you won't find anywhere else.", color: "text-secondary-500 bg-secondary-500/10" },
              { icon: Zap, title: "Live Interaction", desc: "Chat in real-time, ask questions, and be part of the conversation.", color: "text-primary-500 bg-primary-500/10" },
              { icon: Heart, title: "Support Live", desc: "Donate during streams and see your impact happen in real time.", color: "text-rose-500 bg-rose-500/10" },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="text-center p-8 rounded-2xl bg-white border border-border hover:border-primary-300 hover:shadow-md transition-all">
                  <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sponsor CTA ── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 p-10 sm:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                    <Megaphone className="h-3.5 w-3.5" /> Ad Sponsorships
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                    Get Your Business in Front of Our Community
                  </h2>
                  <p className="text-white/80 leading-relaxed">
                    Advertise on ANDF Now! and reach thousands of engaged viewers. Your ads play
                    seamlessly within our content — no ad blockers, high completion rates, and
                    your sponsorship directly funds youth programs.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/sponsor" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-colors">
                      <Star className="h-4 w-4" /> View Packages
                    </Link>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors">
                      Contact Us <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { num: "15K+", label: "Monthly Views" },
                    { num: "95%", label: "Completion Rate" },
                    { num: "$250", label: "Starting At" },
                    { num: "0%", label: "Ad Block Rate" },
                  ].map((s) => (
                    <div key={s.label} className="p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
                      <p className="text-2xl font-bold text-white">{s.num}</p>
                      <p className="text-xs text-white/60 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/gallery/fnf-group-lineup.jpg" alt="ANDF Community" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-700/90" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center space-y-6">
          <FadeIn>
            <Sparkles className="h-10 w-10 text-white/80 mx-auto mb-2" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">Never Miss a Moment</h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              Follow us on social media and turn on notifications so you&apos;re always first to know when we go live.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/events" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-600 font-semibold hover:bg-neutral-100 transition-colors">
                <Calendar className="h-5 w-5" /> See Upcoming Events
              </Link>
              <Link href="/donate" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors">
                <Heart className="h-5 w-5" /> Support ANDF
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Donation Modal ── */}
      <AnimatePresence>
        {showDonationModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDonationModal(false)}
            />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-md rounded-2xl bg-background-card border border-border p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <button
                onClick={() => setShowDonationModal(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background-elevated flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {donationSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">Thank You!</h3>
                  <p className="text-foreground-muted">
                    Your ${donationAmount} donation helps us continue changing lives. You&apos;re making a real difference!
                  </p>
                  <Button
                    variant="primary"
                    className="mt-4"
                    onClick={() => {
                      setShowDonationModal(false);
                      setDonationSuccess(false);
                      setDonationAmount("");
                    }}
                  >
                    Continue Watching
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-display text-xl font-bold text-foreground">Support ANDF Live</h3>
                    <p className="text-sm text-foreground-muted mt-1">Your donation directly funds youth programs</p>
                  </div>
                  <Elements stripe={stripePromise}>
                    <LiveDonationForm
                      amount={Number(donationAmount)}
                      onSuccess={() => setDonationSuccess(true)}
                      onCancel={() => setShowDonationModal(false)}
                    />
                  </Elements>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
