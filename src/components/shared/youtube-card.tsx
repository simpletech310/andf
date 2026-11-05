"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { ChannelVideo } from "@/lib/videos";

/** Lightweight YouTube embed: shows the thumbnail until clicked, then loads the privacy-enhanced player. */
export function YouTubeCard({ id, title, tag, large = false, dark = false }: ChannelVideo & { large?: boolean; dark?: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="group">
      <div className="relative aspect-video overflow-hidden rounded-md bg-neutral-900">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary-400"
            aria-label={`Play ${title}`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              fill
              className="object-cover"
              sizes={large ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            />
            <span className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className={`rounded-full bg-white text-primary-700 flex items-center justify-center shadow-xl ${large ? "h-20 w-20" : "h-14 w-14"}`}>
                <Play className={`${large ? "h-8 w-8" : "h-6 w-6"} ml-1 fill-current`} />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="mt-3">
        <span className={`text-xs font-medium ${dark ? "text-secondary-300" : "text-secondary-600"}`}>{tag}</span>
        <h3 className={`font-semibold leading-snug ${large ? "text-xl" : "text-base"} ${dark ? "text-white" : "text-foreground"}`}>{title}</h3>
      </div>
    </div>
  );
}
