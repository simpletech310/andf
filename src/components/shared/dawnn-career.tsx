"use client";

import Image from "next/image";
import { ROLES, ALSO_HEARD_IN, COMMUNITY_PHOTOS, type Role } from "@/lib/dawnn";

const TONES: Record<Role["tone"], string> = {
  midnight: "bg-primary-900 text-white",
  sunrise: "bg-gradient-to-br from-secondary-400 to-secondary-600 text-white",
  blue: "bg-primary-500 text-white",
  plum: "bg-[#3B1E4A] text-white",
  ink: "bg-neutral-900 text-white",
};

/** A role card. With a licensed image it shows the still; without, a title card in the show's tone. */
function RoleCard({ r }: { r: Role }) {
  return (
    <article className="snap-start shrink-0 w-[16.5rem] sm:w-auto">
      <div className={`relative aspect-[3/4] overflow-hidden rounded-lg ${r.image ? "bg-neutral-200" : TONES[r.tone]}`}>
        {r.image ? (
          <>
            <Image src={r.image} alt={`Dawnn Lewis as ${r.role} in ${r.title}`} fill className="object-cover" sizes="(max-width: 640px) 264px, 220px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          </>
        ) : null}
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <span className="text-xs font-medium text-white/75">
            {r.where}, {r.years}
          </span>
          <h4 className="font-display font-bold text-[1.4rem] leading-tight text-white">{r.title}</h4>
        </div>
      </div>
      <p className="mt-3 font-medium text-foreground">{r.role}</p>
      {r.note ? <p className="text-sm text-foreground-muted leading-snug mt-0.5">{r.note}</p> : null}
    </article>
  );
}

export function CareerRail() {
  return (
    <div>
      <div className="-mx-6 px-6 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
        {ROLES.map((r) => (
          <RoleCard key={r.title} r={r} />
        ))}
      </div>
      <p className="mt-6 text-sm text-foreground-muted">
        Also heard in {ALSO_HEARD_IN.slice(0, -1).join(", ")}, and {ALSO_HEARD_IN[ALSO_HEARD_IN.length - 1]}.
      </p>
    </div>
  );
}

/** Dawnn in the community: an asymmetric photo wall from ANDF's own archive. */
export function CommunityWall({ limit = COMMUNITY_PHOTOS.length }: { limit?: number }) {
  const photos = COMMUNITY_PHOTOS.slice(0, limit);
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
      {photos.map((p) => (
        <figure key={p.src} className="mb-4 break-inside-avoid">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-neutral-200">
            <Image src={p.src} alt={p.caption} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
          </div>
          <figcaption className="mt-2 text-xs text-foreground-muted leading-snug">
            {p.caption}
            {p.credit ? (
              <>
                {" "}
                <a href={p.credit.href} target="_blank" rel="noopener noreferrer" className="text-neutral-400 underline underline-offset-2 hover:text-neutral-600">
                  {p.credit.text}
                </a>
              </>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
