"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronLeft, ChevronRight, Camera, ArrowRight, Heart,
  Sparkles, PartyPopper, Star, Zap
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

/* ─── Data ─────────────────────────────────────────────────────────── */

const galleryItems = [
  { id: 1, src: "/images/gallery/leadership-group.jpg", category: "Events", title: "Leadership Panel Discussion", caption: "Community leaders sharing insights at our annual event" },
  { id: 2, src: "/images/programs/engaged-students.jpg", category: "Band Camp", title: "Students In the Zone", caption: "Band Camp participants fully engaged in their workshop" },
  { id: 3, src: "/images/gallery/fnf-group-lineup.jpg", category: "Events", title: "Focused N FIT Lineup", caption: "The energy was incredible at our FNF community event" },
  { id: 4, src: "/images/gallery/omega-psi-phi.jpg", category: "HBCU Heroes", title: "Omega Psi Phi Brothers", caption: "HBCU excellence on full display" },
  { id: 5, src: "/images/programs/drone-teach.jpg", category: "Drone Experience", title: "Drone Training Day", caption: "Future pilots learning to fly at our drone workshop" },
  { id: 6, src: "/images/gallery/dawnn-zeta-sorors.jpg", category: "Community", title: "Dawnn with Zeta Sorors", caption: "Sisterhood and community at its finest" },
  { id: 7, src: "/images/gallery/siedah-garrett-dawnn.jpg", category: "Events", title: "Siedah Garrett & Dawnn", caption: "Grammy winner Siedah Garrett with our founder" },
  { id: 8, src: "/images/gallery/nasa-team-teaches.jpg", category: "Drone Experience", title: "NASA Team Workshop", caption: "Real NASA professionals teaching our students" },
  { id: 9, src: "/images/gallery/scholarship-recipient.jpg", category: "Community", title: "Scholarship Celebration", caption: "Dreams coming true — scholarship award moment" },
  { id: 10, src: "/images/gallery/opening-panel.jpg", category: "Events", title: "Opening Panel", caption: "Kicking off another powerful day of programming" },
  { id: 11, src: "/images/gallery/dawnn-steve-wesson.jpg", category: "MenTORS", title: "Dawnn & Steve Wesson", caption: "Mentorship connections that change lives" },
  { id: 12, src: "/images/programs/mentorship-session.jpg", category: "Mentorship", title: "Mentorship Session", caption: "One-on-one guidance from experienced professionals" },
  { id: 13, src: "/images/gallery/volunteer-leader.jpg", category: "Community", title: "Volunteer Leader", caption: "Our incredible volunteers making it all happen" },
  { id: 14, src: "/images/gallery/fnf-scholarship-2024.jpg", category: "Events", title: "FNF Scholarship 2024", caption: "Investing in the next generation of leaders" },
  { id: 15, src: "/images/gallery/knowledj-teaches.jpg", category: "Band Camp", title: "KnowleDJ Teaches", caption: "Music industry professionals sharing their craft" },
  { id: 16, src: "/images/gallery/nasa-workshop-2.jpg", category: "Drone Experience", title: "Hands-On NASA Workshop", caption: "Students getting hands-on with real technology" },
  { id: 17, src: "/images/gallery/noel-massie-teaches.jpg", category: "Band Camp", title: "Noel Massie Teaches", caption: "Professional musicians mentoring the next wave" },
  { id: 18, src: "/images/gallery/swat-experience.jpg", category: "Events", title: "SWAT Experience", caption: "An unforgettable day with law enforcement heroes" },
  { id: 19, src: "/images/gallery/raffle-winner.jpg", category: "Events", title: "Raffle Winner!", caption: "The excitement is real — congrats to our winner!" },
  { id: 20, src: "/images/gallery/dawnn-on-the-move.jpg", category: "Community", title: "Dawnn On the Move", caption: "Our founder always on the go for the community" },
  { id: 21, src: "/images/hero/community-group.jpg", category: "Community", title: "The ANDF Family", caption: "Our incredible community at Bing Theatre" },
  { id: 22, src: "/images/gallery/zeta-phi-beta.jpg", category: "Community", title: "Zeta Phi Beta", caption: "Greek organizations supporting our mission" },
  { id: 23, src: "/images/programs/nasa-workshop.jpg", category: "Drone Experience", title: "NASA Workshop", caption: "Where science meets inspiration" },
  { id: 24, src: "/images/gallery/event-photo.jpg", category: "Events", title: "Event Day", caption: "Another incredible day of programming and fun" },
];

const categories = ["All", "Events", "Band Camp", "Drone Experience", "Mentorship", "MenTORS", "HBCU Heroes", "Community"];

// Masonry-style size classes for visual variety
const sizeClasses = [
  "col-span-2 row-span-2", // 0 - hero large
  "col-span-1 row-span-1", // 1
  "col-span-1 row-span-2", // 2 - tall
  "col-span-1 row-span-1", // 3
  "col-span-1 row-span-1", // 4
  "col-span-2 row-span-1", // 5 - wide
  "col-span-1 row-span-1", // 6
  "col-span-1 row-span-2", // 7 - tall
  "col-span-1 row-span-1", // 8
  "col-span-1 row-span-1", // 9
  "col-span-2 row-span-1", // 10 - wide
  "col-span-1 row-span-1", // 11
];

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const selectedIndex = selectedItem !== null ? filtered.findIndex(i => i.id === selectedItem) : -1;

  const navigateLightbox = useCallback((dir: number) => {
    if (selectedIndex < 0) return;
    const nextIndex = (selectedIndex + dir + filtered.length) % filtered.length;
    setSelectedItem(filtered[nextIndex].id);
  }, [selectedIndex, filtered]);

  return (
    <div className="pb-0">

      {/* ───── 1. HERO ───── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/lets-go.jpg"
            alt="ANDF Gallery"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-36 text-center space-y-6">
          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-secondary-400 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20">
              <Camera className="inline h-3.5 w-3.5 mr-2 -mt-0.5" />
              {galleryItems.length} Photos &bull; Real Moments &bull; Real Impact
            </span>
          </motion.div>
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            This Is What
            <br />
            <span className="text-secondary-400">Fun Looks Like</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Music, drones, mentorship, community — every event is packed with energy,
            laughter, and moments that change lives. See for yourself.
          </motion.p>
          <motion.div
            className="flex items-center justify-center gap-6 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <a href="#gallery">
              <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-white/90">
                <PartyPopper className="h-4 w-4" />
                Explore the Gallery
              </Button>
            </a>
            <Link href="/events">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Join the Next Event
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ───── 2. FUN STATS ───── */}
      <section className="bg-gradient-to-r from-secondary-500 via-secondary-400 to-secondary-500 py-8 px-6">
        <div className="mx-auto max-w-4xl grid grid-cols-4 gap-6">
          {[
            { icon: PartyPopper, value: "50+", label: "Events Held" },
            { icon: Camera, value: "1,000+", label: "Photos Taken" },
            { icon: Star, value: "2,000+", label: "Smiles Captured" },
            { icon: Zap, value: "100%", label: "Good Vibes" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
            >
              <stat.icon className="h-5 w-5 text-white/80 mx-auto mb-1.5" />
              <div className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-xs text-white/80 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───── 3. GALLERY ───── */}
      <section id="gallery" className="py-16 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-7xl">
          {/* Header + filters */}
          <div className="text-center mb-10">
            <motion.span
              className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary-500 mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Browse by Category
            </motion.span>
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-foreground mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              The Full Gallery
            </motion.h2>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-primary-500 text-white shadow-md shadow-primary-500/25 scale-105"
                      : "bg-white border border-neutral-200 text-foreground-muted hover:border-primary-300 hover:text-primary-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[200px] gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((item, i) => {
                const sizeClass = sizeClasses[i % sizeClasses.length];

                return (
                  <motion.button
                    key={item.id}
                    className={`${sizeClass} relative rounded-2xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                    onClick={() => setSelectedItem(item.id)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    {/* Category pill */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="bg-white/90 backdrop-blur-sm text-neutral-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    {/* Zoom icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="h-8 w-8 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Bottom text */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white font-bold text-sm drop-shadow-lg">{item.title}</p>
                      <p className="text-white/80 text-xs mt-0.5 drop-shadow-lg">{item.caption}</p>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Count */}
          <div className="mt-8 text-center">
            <p className="text-sm text-foreground-muted">
              Showing <span className="font-bold text-foreground">{filtered.length}</span> of {galleryItems.length} photos
              {activeCategory !== "All" && (
                <> in <span className="font-bold text-primary-500">{activeCategory}</span></>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ───── 4. "YOU HAD TO BE THERE" HIGHLIGHT REEL ───── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Highlight Reel"
            title="You Had to Be There"
            description="Some moments are too good for just one photo. Here are a few of our favorite stories from ANDF events."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                image: "/images/gallery/fnf-scholarship-2024.jpg",
                title: "Scholarship Dreams",
                desc: "When a young student finds out they just received a scholarship — that moment of pure joy is what drives everything we do.",
                tag: "FNF 2024",
              },
              {
                image: "/images/gallery/nasa-team-teaches.jpg",
                title: "NASA Comes to ANDF",
                desc: "Real NASA engineers spent the day with our students, proving that rocket science isn't just for textbooks.",
                tag: "Drone Experience",
              },
              {
                image: "/images/gallery/siedah-garrett-dawnn.jpg",
                title: "Grammy Meets Mission",
                desc: "Grammy-winning songwriter Siedah Garrett joined Dawnn to inspire the next generation of musicians and dreamers.",
                tag: "Band Camp",
              },
            ].map((story, i) => (
              <motion.div
                key={story.title}
                className="group rounded-2xl overflow-hidden bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-xl transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-secondary-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {story.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary-500 transition-colors">{story.title}</h3>
                  <p className="text-sm text-foreground-muted mt-2 leading-relaxed">{story.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 5. CTA ───── */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/community-group.jpg"
            alt="ANDF community"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-700/90 via-primary-600/90 to-primary-700/90" />
        </div>
        <motion.div
          className="mx-auto max-w-3xl relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <PartyPopper className="h-10 w-10 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Want to Be in the
            <br />
            <span className="text-secondary-400">Next Photo?</span>
          </h2>
          <p className="text-white/80 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
            The best memories are the ones you&apos;re part of.
            Join us at our next event and make some moments of your own.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/events">
              <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-white/90 shadow-xl">
                <Sparkles className="h-4 w-4" />
                See Upcoming Events
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <Heart className="h-4 w-4" /> Support ANDF
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ───── LIGHTBOX ───── */}
      <AnimatePresence>
        {selectedItem !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            {/* Close */}
            <button
              className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-20"
              onClick={() => setSelectedItem(null)}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Nav arrows */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-20"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-20"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <motion.div
              className="relative max-w-5xl w-full max-h-[80vh] aspect-video rounded-2xl overflow-hidden mx-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {filtered[selectedIndex] && (
                <>
                  <Image
                    src={filtered[selectedIndex].src}
                    alt={filtered[selectedIndex].title}
                    fill
                    className="object-contain bg-black"
                    sizes="100vw"
                  />
                  {/* Caption bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white font-bold text-lg">{filtered[selectedIndex].title}</p>
                    <p className="text-white/70 text-sm mt-1">{filtered[selectedIndex].caption}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-white/50 font-medium uppercase tracking-wider">{filtered[selectedIndex].category}</span>
                      <span className="text-xs text-white/50">{selectedIndex + 1} / {filtered.length}</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
