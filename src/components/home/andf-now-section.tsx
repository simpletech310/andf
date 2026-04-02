"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, X } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MuxStreamPlayer = dynamic(() => import("@/components/live/MuxStreamPlayer"), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-neutral-100 rounded-2xl flex items-center justify-center">
      <div className="h-8 w-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  ),
});

const MUX_VIDEO_ID = "DvUNmWbAG0100yvsdMvVzTod00dPKsJrL00xu1lG5MmsKIA";

const videos = [
  {
    id: "featured",
    title: "A New Day Foundation — Our Story",
    description: "Watch how A New Day Foundation is transforming lives through music, mentorship, technology, and community. See the impact firsthand.",
    thumbnail: "/images/gallery/fnf-group-lineup.jpg",
    duration: "2:45",
    category: "Featured",
    featured: true,
  },
  {
    id: "giving-tuesday",
    title: "Giving Tuesday 2025",
    description: "Highlights from our Giving Tuesday campaign — see the community rally together.",
    thumbnail: "/images/gallery/scholarship-recipient.jpg",
    duration: "1:30",
    category: "Campaign",
    featured: false,
  },
  {
    id: "band-camp-recap",
    title: "Band Camp Summer Showcase",
    description: "Young musicians take the stage in a powerful closing night concert.",
    thumbnail: "/images/gallery/opening-panel.jpg",
    duration: "4:15",
    category: "Programs",
    featured: false,
  },
];

export function ANDFNowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const featured = videos[0];
  const secondary = videos.slice(1);

  return (
    <SectionWrapper className="py-24 lg:py-32 px-6 bg-gradient-to-b from-primary-50 to-white">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="A New Day Now!"
          title="Watch, Learn, Get Inspired"
          description="Catch up on our latest programs, events, and community moments — all streaming on A New Day Now!"
        />

        <div ref={ref} className="mt-16">
          {/* Inline Mux player */}
          <AnimatePresence>
            {activeVideo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="relative rounded-2xl overflow-hidden bg-neutral-900">
                  <MuxStreamPlayer
                    playbackId={MUX_VIDEO_ID}
                    videoUrl="/videos/andf-content.mp4"
                    title={videos.find((v) => v.id === activeVideo)?.title || "ANDF Video"}
                  />
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-30"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured video */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => setActiveVideo(featured.id)}
                className="block w-full group text-left"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-100">
                  <Image
                    src={featured.thumbnail}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-secondary-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="default" className="bg-black/60 text-white border-0">{featured.duration}</Badge>
                  </div>

                  {/* Info overlay */}
                  <div className="absolute bottom-4 left-4 right-20">
                    <Badge variant="secondary" className="mb-2">{featured.category}</Badge>
                    <h3 className="text-xl font-semibold text-white">{featured.title}</h3>
                    <p className="text-sm text-white/70 mt-1 line-clamp-2">{featured.description}</p>
                  </div>
                </div>
              </button>
            </motion.div>

            {/* Secondary videos */}
            <div className="flex flex-col gap-6">
              {secondary.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                >
                  <button
                    onClick={() => setActiveVideo(video.id)}
                    className="block w-full group text-left"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-secondary-500/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-5 w-5 text-white ml-0.5" fill="currentColor" />
                        </div>
                      </div>

                      <div className="absolute bottom-3 right-3">
                        <Badge variant="default" className="bg-black/60 text-white border-0 text-[10px]">{video.duration}</Badge>
                      </div>

                      <div className="absolute bottom-3 left-3 right-14">
                        <h4 className="text-sm font-semibold text-white line-clamp-1">{video.title}</h4>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/live">
              <Button variant="outline" size="lg">
                Watch More on A New Day Now!
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
