"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Lock, Film } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string;
  duration_seconds: number;
  pay_per_view: boolean;
  minimum_amount: number;
  view_count: number;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        if (res.ok) {
          const data = await res.json();
          setVideos(data.videos || []);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const categories = ["all", ...new Set(videos.map((v) => v.category))];
  const filtered = category === "all" ? videos : videos.filter((v) => v.category === category);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-neutral-900">Video Library</h1>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Watch stories, program highlights, and community moments from A New Day Foundation.
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-primary-500 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat === "all" ? "All Videos" : cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-video rounded-2xl bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Film className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No videos available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((video) => (
                <Link
                  key={video.id}
                  href={`/videos/${video.id}`}
                  className="group block rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-video bg-neutral-100">
                    {video.thumbnail_url ? (
                      <Image
                        src={video.thumbnail_url}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="h-12 w-12 text-neutral-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-6 w-6 text-neutral-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    {video.pay_per_view && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gold-500 text-white border-0">
                          <Lock className="h-3 w-3 mr-1" /> ${video.minimum_amount}+ to unlock
                        </Badge>
                      </div>
                    )}
                    {video.duration_seconds > 0 && (
                      <div className="absolute bottom-3 right-3">
                        <Badge className="bg-black/60 text-white border-0">{formatDuration(video.duration_seconds)}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{video.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                      <span>{video.view_count} views</span>
                      <span className="capitalize">{video.category.replace(/_/g, " ")}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
