"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YouTubeCard } from "@/components/shared/youtube-card";
import { VIDEOS, YOUTUBE_CHANNEL, type ChannelVideo } from "@/lib/videos";

export default function LivePage() {
  const [videos, setVideos] = useState<ChannelVideo[]>(VIDEOS);

  useEffect(() => {
    fetch("/api/youtube/latest")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.videos?.length) setVideos(d.videos);
      })
      .catch(() => {});
  }, []);

  const [latest, ...rest] = videos;

  return (
    <div>
      {/* Latest video */}
      <section className="relative overflow-hidden bg-primary-900 text-white">
        <div
          aria-hidden
          className="absolute right-[-10rem] bottom-[-30rem] h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle,rgba(240,125,26,0.35)_0%,rgba(26,115,212,0.12)_45%,transparent_68%)]"
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 lg:pt-40 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4">
            <h1 className="font-display font-bold text-5xl sm:text-6xl tracking-tight">ANDF Live</h1>
            <p className="mt-5 text-lg text-white/80 leading-relaxed">
              Program recaps, highlight reels, and live events from A New Day Foundation, streaming on our YouTube
              channel, A New Day Now.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
              <a href={`${YOUTUBE_CHANNEL}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="donate" className="w-full sm:w-auto">
                  Subscribe on YouTube
                </Button>
              </a>
              <a href={`${YOUTUBE_CHANNEL}/live`} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                  <Radio className="h-4 w-4" />
                  Watch live
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-white/55">
              &ldquo;Watch live&rdquo; opens our current stream on YouTube when we&apos;re broadcasting.
            </p>
          </div>

          {latest ? (
            <div className="lg:col-span-8">
              <p className="text-sm font-medium text-secondary-300 mb-3">Latest video</p>
              <YouTubeCard key={latest.id} {...latest} large dark />
            </div>
          ) : null}
        </div>
      </section>

      {/* Library */}
      <section className="py-20 lg:py-24 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">More from A New Day Now</h2>
            <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-600 underline underline-offset-4">
              See the full channel
            </a>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {rest.map((v) => (
              <YouTubeCard key={v.id} {...v} />
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 px-6 bg-neutral-50 border-t border-neutral-200">
        <div className="mx-auto max-w-4xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-foreground">Like what you see?</h2>
            <p className="mt-1 text-foreground-muted">Every one of these moments is funded by donors and partners.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/donate">
              <Button variant="donate">
                <Heart className="h-4 w-4" />
                Donate
              </Button>
            </Link>
            <Link href="/sponsor">
              <Button variant="outline">Partner with us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
