"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import { SectionWrapper } from "@/components/shared/section-wrapper";

const partnersRow1 = [
  { name: "Coca-Cola", logo: "/images/partners/coca-cola.jpg" },
  { name: "Google", logo: "/images/partners/google.png" },
  { name: "LA Dodgers", logo: "/images/partners/la-dodgers.png" },
  { name: "LA Lakers", logo: "/images/partners/la-lakers.png" },
  { name: "UPS", logo: "/images/partners/ups.png" },
  { name: "Xerox", logo: "/images/partners/xerox.png" },
  { name: "PepsiCo", logo: "/images/partners/pepsico.png" },
  { name: "Herbalife", logo: "/images/partners/herbalife.jpg" },
  { name: "MSNBC", logo: "/images/partners/msnbc.png" },
  { name: "New Balance", logo: "/images/partners/new-balance.png" },
  { name: "Activision", logo: "/images/partners/activision.jpg" },
  { name: "USC", logo: "/images/partners/usc.jpg" },
  { name: "LMU", logo: "/images/partners/lmu.jpg" },
  { name: "Junior Achievement", logo: "/images/partners/junior-achievement.jpg" },
];

const partnersRow2 = [
  { name: "Donald Driver", logo: "/images/partners/donald-driver.jpg" },
  { name: "Northrop Grumman", logo: "/images/partners/northrop-grumman.jpg" },
  { name: "Thrivent", logo: "/images/partners/thrivent.png" },
  { name: "US Bank", logo: "/images/partners/us-bank.jpg" },
  { name: "Frost Equity", logo: "/images/partners/frost-equity.jpg" },
  { name: "Hello Beautiful", logo: "/images/partners/hello-beautiful.jpg" },
  { name: "CFF", logo: "/images/partners/cff.jpg" },
  { name: "FNF", logo: "/images/partners/fnf.jpg" },
  { name: "FMS", logo: "/images/partners/fms.png" },
  { name: "CSL", logo: "/images/partners/csl.png" },
  { name: "TMFam", logo: "/images/partners/tmfam.png" },
  { name: "RJones", logo: "/images/partners/rjones.png" },
  { name: "AHackett", logo: "/images/partners/ahackett.png" },
  { name: "AAAA LMU", logo: "/images/partners/aaaa-lmu.png" },
];

function MarqueeRow({ partners, direction }: { partners: typeof partnersRow1; direction: "left" | "right" }) {
  const doubled = [...partners, ...partners];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-12 items-center ${direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}`}
        style={{ width: "max-content" }}
      >
        {doubled.map((partner, i) => (
          <div
            key={`${partner.name}-${i}`}
            className="relative h-16 w-32 shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              fill
              className="object-contain"
              sizes="128px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnersSection() {
  return (
    <SectionWrapper className="py-24 lg:py-32 px-6 bg-neutral-50">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="Our Partners"
          title="Powered by Partnership"
          description="We collaborate with organizations that share our vision of empowering youth."
        />

        <div className="mt-16 space-y-10">
          <MarqueeRow partners={partnersRow1} direction="left" />
          <MarqueeRow partners={partnersRow2} direction="right" />
        </div>
      </div>
    </SectionWrapper>
  );
}
