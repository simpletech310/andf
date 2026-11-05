"use client";

import { YouTubeCard } from "@/components/shared/youtube-card";
import { VIDEOS, YOUTUBE_CHANNEL } from "@/lib/videos";

/** Real program footage from the ANDF YouTube channel. Replaces the old placeholder "A New Day Now" block. */
export function WatchSection() {
  const [featured, ...rest] = VIDEOS;
  return (
    <section id="watch" className="py-24 lg:py-32 px-6 bg-primary-900 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display font-bold text-4xl sm:text-5xl leading-[1.08]">See it for yourself</h2>
            <p className="mt-4 text-lg text-white/75 leading-relaxed">
              Recaps and highlight reels from this year&apos;s programs, straight from A New Day Now.
            </p>
          </div>
          <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-secondary-300 underline underline-offset-4 hover:text-white">
            Subscribe on YouTube
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <YouTubeCard {...featured} large dark />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            {rest.slice(0, 2).map((v) => (
              <YouTubeCard key={v.id} {...v} dark />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
