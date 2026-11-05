"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { WatchSection } from "@/components/home/watch-section";
import { EventsCarousel } from "@/components/home/events-carousel";
import { ImpactStats } from "@/components/home/impact-stats";
import { ProgramsPreview } from "@/components/home/programs-preview";
import { PartnersSection } from "@/components/home/partners-section";
import { FounderSpotlight } from "@/components/home/founder-spotlight";
import { ExperiencesWall } from "@/components/home/experiences-wall";
import { PartnerValue } from "@/components/home/partner-value";
import { DonationCTA } from "@/components/home/donation-cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Story arc for donors and partners: who → what it's done → where teens go → how → when → why partner → who's in → give */}
        <HeroSection />
        <FounderSpotlight />
        <ImpactStats />
        <ExperiencesWall />
        <ProgramsPreview />
        <EventsCarousel />
        <PartnerValue />
        <PartnersSection className="pt-16 lg:pt-20 pb-24 lg:pb-32" />
        <WatchSection />
        <DonationCTA />
      </main>
      <Footer />
    </>
  );
}
