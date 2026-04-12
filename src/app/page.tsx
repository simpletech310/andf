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
import { usePageContent, getSectionContent } from "@/lib/hooks/use-page-content";

export default function HomePage() {
  const { contentMap } = usePageContent("home");

  return (
    <>
      <Navbar />
      <main>
        <HeroSection cms={contentMap.hero?.content} />
        <ANDFNowSection />
        <EventsCarousel />
        <ImpactStats cms={contentMap.impact_stats?.content} />
        <ProgramsPreview />
        <PartnersSection />
        <TestimonialsSlider />
        <DonationCTA cms={contentMap.donation_cta?.content} />
      </main>
      <Footer />
    </>
  );
}
