"use client";

import Image from "next/image";
import Link from "next/link";

const EXPERIENCES = [
  { src: "/images/experiences/nmaahc-2025.jpg", place: "Smithsonian NMAAHC", city: "Washington, D.C.", big: true },
  { src: "/images/experiences/ifly-2025.jpg", place: "iFLY indoor skydiving", city: "Los Angeles" },
  { src: "/images/experiences/lakers-experience.jpg", place: "Behind the scenes with the Lakers", city: "Los Angeles" },
  { src: "/images/experiences/sheriff-crime-lab-2025.jpg", place: "Sheriff’s forensic science lab", city: "Los Angeles" },
  { src: "/images/experiences/harbor-patrol-2025.jpg", place: "Sheriff’s Harbor Patrol", city: "Los Angeles County" },
  { src: "/images/experiences/color-purple-2025.jpg", place: "The Color Purple, live", city: "Los Angeles" },
  { src: "/images/experiences/band-camp-2025.jpg", place: "Band Camp with working musicians", city: "Los Angeles" },
  { src: "/images/experiences/frost-stem-2025.jpg", place: "Coding at Frost STEM", city: "Los Angeles" },
  { src: "/images/experiences/inspiration-52-2025.jpg", place: "Inspiration 52 at Jordan High", city: "Los Angeles" },
];

/**
 * Proof for donors: real places ANDF teens have been. Photos are ANDF's own (2025 season).
 */
export function ExperiencesWall() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <h2 className="lg:col-span-7 font-display font-bold text-4xl sm:text-5xl leading-[1.08] text-foreground">
            Rooms most teens never get to walk into.
          </h2>
          <p className="lg:col-span-5 text-lg text-foreground-muted leading-relaxed">
            Every outing is chosen to widen what a young person thinks is possible: a forensic lab, a national
            museum, a wind tunnel, a recording studio. Small groups of 8 to 20 teens, with guest speakers who share how they got there.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 auto-rows-[11rem] sm:auto-rows-[14rem] gap-3 sm:gap-4">
          {EXPERIENCES.map((e) => (
            <figure
              key={e.src}
              className={`relative overflow-hidden rounded-md bg-neutral-200 ${e.big ? "col-span-2 row-span-2" : ""}`}
            >
              <Image
                src={e.src}
                alt={`${e.place}, ${e.city}`}
                fill
                className="object-cover"
                sizes={e.big ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/75 to-transparent text-white">
                <span className={`block font-medium leading-tight ${e.big ? "text-lg sm:text-xl" : "text-sm"}`}>{e.place}</span>
                <span className="block text-xs text-white/70 mt-0.5">{e.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/gallery" className="text-sm font-semibold text-primary-600 underline underline-offset-4 decoration-primary-200 hover:decoration-primary-500">
            See every experience in the gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
