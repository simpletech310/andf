"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ExternalLink, SkipForward, Heart } from "lucide-react";

interface Ad {
  id: string;
  title: string;
  muxPlaybackId?: string;
  videoUrl?: string; // local fallback
  durationSeconds: number;
  sponsorName: string;
  sponsorUrl: string;
  sponsorLogo: string;
  priority: number;
}

interface MuxStreamPlayerProps {
  playbackId?: string;
  videoUrl?: string; // local video fallback
  isLive?: boolean;
  title?: string;
  channel?: string;
  ads?: Ad[];
  adBreakAt?: number; // seconds into video to trigger first ad (default 10)
  adIntervalMinutes?: number;
  onAdImpression?: (adId: string, type: "view" | "click" | "skip") => void;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  showDonateButton?: boolean;
  onDonateClick?: () => void;
}

function selectAd(ads: Ad[]): Ad {
  if (ads.length <= 1) return ads[0];
  const totalWeight = ads.reduce((sum, ad) => sum + ad.priority, 0);
  let random = Math.random() * totalWeight;
  for (const ad of ads) {
    random -= ad.priority;
    if (random <= 0) return ad;
  }
  return ads[0];
}

export default function MuxStreamPlayer({
  playbackId,
  videoUrl,
  isLive = false,
  title,
  channel,
  ads = [],
  adBreakAt = 10,
  adIntervalMinutes = 15,
  onAdImpression,
  className = "",
  autoPlay = false,
  muted: initialMuted = false,
  showDonateButton = true,
  onDonateClick,
}: MuxStreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const adVideoRef = useRef<HTMLVideoElement>(null);
  const [showAd, setShowAd] = useState(false);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [adCountdown, setAdCountdown] = useState(0);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isPlaying, setIsPlaying] = useState(false);
  const adTriggeredRef = useRef(false);
  const lastAdTime = useRef(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const MuxPlayerRef = useRef<React.ComponentType<Record<string, unknown>> | null>(null);
  const [muxLoaded, setMuxLoaded] = useState(false);

  // Dynamically import MuxPlayer when we have a playbackId
  useEffect(() => {
    if (playbackId) {
      import("@mux/mux-player-react").then((mod) => {
        MuxPlayerRef.current = mod.default as unknown as React.ComponentType<Record<string, unknown>>;
        setMuxLoaded(true);
      });
    }
  }, [playbackId]);

  const handleAdEnd = useCallback(() => {
    setShowAd(false);
    setCurrentAd(null);
    setAdCountdown(0);

    // Resume main video
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const triggerAd = useCallback(() => {
    if (ads.length === 0 || showAd) return;

    const ad = selectAd(ads);
    if (!ad) return;

    setCurrentAd(ad);
    setShowAd(true);
    setAdCountdown(Math.ceil(ad.durationSeconds || 15));
    lastAdTime.current = Date.now();

    // Pause main video
    if (videoRef.current) {
      videoRef.current.pause();
    }

    // Track impression
    onAdImpression?.(ad.id, "view");
  }, [ads, showAd, onAdImpression]);

  // Time-based ad trigger for HTML5 video
  useEffect(() => {
    if (!videoRef.current || !ads.length) return;

    const video = videoRef.current;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const now = Date.now();

      // First ad break at specified time
      if (!adTriggeredRef.current && currentTime >= adBreakAt) {
        adTriggeredRef.current = true;
        triggerAd();
        return;
      }

      // Subsequent ad breaks at interval
      if (adTriggeredRef.current && now - lastAdTime.current > adIntervalMinutes * 60 * 1000) {
        triggerAd();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [ads, adBreakAt, adIntervalMinutes, triggerAd]);

  // Countdown timer during ad
  useEffect(() => {
    if (!showAd || adCountdown <= 0) return;

    countdownRef.current = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showAd]);

  // Auto-play ad video when ad is shown
  // Mobile browsers block unmuted autoplay — start muted, then unmute after playing
  useEffect(() => {
    if (showAd && adVideoRef.current) {
      const adVideo = adVideoRef.current;
      adVideo.currentTime = 0;
      // Always start muted to guarantee autoplay on mobile
      adVideo.muted = true;
      adVideo.play()
        .then(() => {
          // Playback started — unmute if user hasn't explicitly muted
          if (!isMuted) {
            adVideo.muted = false;
          }
        })
        .catch(() => {
          // If even muted autoplay fails, skip the ad
          handleAdEnd();
        });
    }
  }, [showAd, isMuted, handleAdEnd]);

  const handleAdClick = useCallback(() => {
    if (currentAd?.sponsorUrl) {
      onAdImpression?.(currentAd.id, "click");
      window.open(currentAd.sponsorUrl, "_blank", "noopener,noreferrer");
    }
  }, [currentAd, onAdImpression]);

  const handleSkipAd = useCallback(() => {
    if (currentAd) {
      onAdImpression?.(currentAd.id, "skip");
    }
    handleAdEnd();
  }, [currentAd, onAdImpression, handleAdEnd]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newVal = !prev;
      if (videoRef.current) videoRef.current.muted = newVal;
      if (adVideoRef.current) adVideoRef.current.muted = newVal;
      return newVal;
    });
  }, []);

  // Get the ad video source — prefer local URL for reliable playback
  const adVideoSrc = currentAd?.videoUrl || (currentAd?.muxPlaybackId ? `https://stream.mux.com/${currentAd.muxPlaybackId}.m3u8` : null);

  // Use HTML5 video when videoUrl is provided (demo mode), otherwise Mux player
  const useMux = playbackId && !videoUrl && muxLoaded && MuxPlayerRef.current;

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-neutral-900 aspect-video ${className}`}>
      {/* Main Video Player */}
      {useMux ? (
        (() => {
          const MuxComp = MuxPlayerRef.current!;
          return (
            <MuxComp
              playbackId={playbackId}
              streamType={isLive ? "live" : "on-demand"}
              autoPlay={autoPlay ? "muted" : false}
              muted={isMuted}
              metadata={{
                video_title: title || "ANDF Now!",
                player_name: `ANDF ${channel || "Player"}`,
              }}
              style={{ aspectRatio: "16/9", width: "100%", opacity: showAd ? 0 : 1 }}
              primaryColor="#F07D1A"
              secondaryColor="#2F3192"
            />
          );
        })()
      ) : videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          controls={!showAd}
          autoPlay={autoPlay}
          muted={isMuted}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          style={{ opacity: showAd ? 0 : 1, position: "absolute", inset: 0 }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-900">
          <p className="text-neutral-400 text-sm">No video source configured</p>
        </div>
      )}

      {/* Ad Overlay */}
      <AnimatePresence>
        {showAd && currentAd && adVideoSrc && (
          <motion.div
            className="absolute inset-0 z-20 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Ad Video */}
            <video
              ref={adVideoRef}
              src={adVideoSrc || undefined}
              className="w-full h-full object-contain bg-black"
              autoPlay
              muted
              playsInline
              onEnded={handleAdEnd}
              onError={handleAdEnd}
            />

            {/* Ad Attribution — Top */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400/90 bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/20">
                  Ad
                </span>
                <span className="text-xs text-white/80 font-medium">
                  {currentAd.sponsorName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 font-mono tabular-nums">
                  {adCountdown > 0 && `0:${adCountdown.toString().padStart(2, "0")}`}
                </span>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                {currentAd.sponsorUrl && (
                  <button
                    onClick={handleAdClick}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Learn More
                  </button>
                )}
              </div>

              {adCountdown <= 5 && (
                <button
                  onClick={handleSkipAd}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/30 transition-colors border border-white/10"
                >
                  Skip Ad <SkipForward className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Progress bar */}
            {currentAd.durationSeconds > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <motion.div
                  className="h-full bg-yellow-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: currentAd.durationSeconds, ease: "linear" }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live badge */}
      {isLive && !showAd && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            LIVE
          </div>
        </div>
      )}

      {/* Donate button — always visible on video */}
      {showDonateButton && !showAd && (
        <div className="absolute top-3 right-3 z-10">
          {onDonateClick ? (
            <button
              onClick={onDonateClick}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary-500 text-white text-xs font-bold shadow-lg hover:bg-secondary-600 transition-colors animate-pulse hover:animate-none"
            >
              <Heart className="h-3.5 w-3.5" fill="currentColor" /> Donate
            </button>
          ) : (
            <Link
              href="/donate"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary-500 text-white text-xs font-bold shadow-lg hover:bg-secondary-600 transition-colors animate-pulse hover:animate-none"
            >
              <Heart className="h-3.5 w-3.5" fill="currentColor" /> Donate
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
