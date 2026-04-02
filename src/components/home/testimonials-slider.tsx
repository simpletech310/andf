"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SectionHeading } from "@/components/shared/section-heading";

const testimonials = [
  {
    quote: "A New Day Foundation changed my daughter's life. The mentorship program gave her confidence she never had before, and now she's thriving in ways I couldn't have imagined.",
    author: "Maria S.",
    title: "Parent of Program Participant",
  },
  {
    quote: "Band Camp was the most incredible experience. I learned to play instruments I'd never touched before, and the connections I made will last a lifetime. Thank you ANDF!",
    author: "Jordan T.",
    title: "Band Camp Alumni, Class of 2025",
  },
  {
    quote: "Partnering with A New Day Foundation has been one of the most rewarding experiences of my career. The impact they have on young lives is truly remarkable.",
    author: "David L.",
    title: "Corporate Sponsor",
  },
  {
    quote: "The Drone Experience program opened my eyes to an entire career field I didn't know existed. Now I'm studying aerospace engineering, all thanks to ANDF.",
    author: "Keisha W.",
    title: "Drone Experience Graduate",
  },
];

export function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <SectionWrapper className="py-24 lg:py-32 px-6 bg-primary-50">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          label="Testimonials"
          title="Stories of Impact"
        />

        <div className="mt-16 relative">
          {/* Quote decoration */}
          <Quote className="absolute -top-6 left-0 h-16 w-16 text-primary-200" />

          <div className="min-h-[250px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-6"
              >
                <blockquote className="text-xl sm:text-2xl text-neutral-800 leading-relaxed font-light italic">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                <div className="space-y-1">
                  <div className="font-semibold text-primary-600">
                    {testimonials[current].author}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {testimonials[current].title}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="h-10 w-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-500 hover:text-primary-500 hover:border-primary-300 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-primary-500" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="h-10 w-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-500 hover:text-primary-500 hover:border-primary-300 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
