"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { ANDFNowSection } from "@/components/home/andf-now-section";
import { EventsCarousel } from "@/components/home/events-carousel";
import { ImpactStats } from "@/components/home/impact-stats";
import { ProgramsPreview } from "@/components/home/programs-preview";
import { PartnersSection } from "@/components/home/partners-section";
import { TestimonialsSlider } from "@/components/home/testimonials-slider";
import { DonationCTA } from "@/components/home/donation-cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ANDFNowSection />
        <EventsCarousel />
        <ImpactStats />
        <ProgramsPreview />
        <PartnersSection />
        <TestimonialsSlider />
        <DonationCTA />
      </main>
      <Footer />
    </>
  );
}
