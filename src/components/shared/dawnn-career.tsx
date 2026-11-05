"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { ROLES, ALSO_HEARD_IN, COMMUNITY_PHOTOS, type Role } from "@/lib/dawnn";

const TONES: Record<Role["tone"], string> = {
  midnight: "bg-primary-900 text-white",
  sunrise: "bg-gradient-to-br from-secondary-400 to-secondary-600 text-white",
  blue: "bg-primary-500 text-white",
  plum: "bg-[#3B1E4A] text-white",
  ink: "bg-neutral-900 text-white",
};

/**
 * A role card styled as a poster. Front art: a licensed poster (`image`) if ANDF has one,
 * otherwise a frame from the official video embed, otherwise a typographic poster.
 * Clicking plays the official video when there is one.
 */
function RoleCard({ r, onPlay }: { r: Role; onPlay: (r: Role) => void }) {
  // Licensed poster first; otherwise the high-res frame of the official video embed.
  const art = r.image ?? (r.video ? `https://i.ytimg.com/vi/${r.video.id}/maxresdefault.jpg` : null);
  const Wrapper = r.video ? "button" : "div";
  return (
    <article className="snap-start shrink-0 w-[13.5rem] lg:w-auto">
      <Wrapper
        {...(r.video
          ? { type: "button" as const, onClick: () => onPlay(r), "aria-label": `Play ${r.video.label}: ${r.title}` }
          : {})}
        className={`group relative block w-full text-left aspect-[2/3] overflow-hidden rounded-md shadow-[0_18px_40px_-18px_rgba(7,29,62,0.55)] ring-1 ring-black/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary-400 ${art ? "bg-neutral-950" : TONES[r.tone]}`}
      >
        {art ? (
          <>
            {r.image && r.imageFit === "contain" ? (
              <>
                <Image src={art} alt="" aria-hidden fill className="object-cover scale-125 blur-2xl opacity-70" sizes="120px" />
                <Image
                  src={art}
                  alt={`${r.title} key art`}
                  fill
                  className="object-contain transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 240px, 220px"
                />
              </>
            ) : (
              <Image
                src={art}
                alt={r.image ? `${r.title} ${r.titleOverlay ? "still" : "poster"}` : ""}
                fill
                style={r.image && r.imagePosition ? { objectPosition: r.imagePosition } : undefined}
                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${r.image ? "" : "object-[50%_40%] scale-[1.35] group-hover:scale-[1.42]"}`}
                sizes="(max-width: 640px) 240px, 220px"
              />
            )}
            {!r.image ? <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/95" /> : null}
            {r.image && r.titleOverlay ? (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-16">
                <h4 className="font-display font-bold text-[1.45rem] leading-[1.05] text-white">{r.title}</h4>
                <p className="mt-1 text-[0.68rem] text-white/70">{r.where}</p>
              </div>
            ) : null}
          </>
        ) : (
          // Typographic poster for titles without licensed art or an official video.
          <div aria-hidden className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-white/10" />
        )}

        {!r.image ? (
          <div className="absolute inset-0 p-4 flex flex-col">
            <span className="text-[0.7rem] font-semibold tracking-[0.18em] text-white/85">DAWNN LEWIS</span>
            <div className="mt-auto">
              <h4 className="font-display font-bold text-[1.45rem] leading-[1.05] text-white">{r.title}</h4>
              <p className="mt-2 text-xs text-white/80">as {r.role.replace(" (voice)", "")}</p>
              <div className="mt-3 pt-2 border-t border-white/25 flex items-center justify-between text-[0.68rem] text-white/70">
                <span>{r.where}</span>
                {r.years ? <span>{r.years}</span> : null}
              </div>
            </div>
          </div>
        ) : null}

        {r.video && r.image ? (
          <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 rounded-full bg-neutral-950/80 px-2.5 py-1.5 text-[0.68rem] font-semibold text-white shadow-lg backdrop-blur-sm transition-transform group-hover:scale-105">
            <Play className="h-3 w-3 fill-current" />
            Trailer
          </span>
        ) : null}
        {r.video && !r.image ? (
          <span className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
            <span className="h-11 w-11 rounded-full bg-white/95 text-primary-800 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="h-4 w-4 ml-0.5 fill-current" />
            </span>
            <span className="text-[0.65rem] font-semibold text-white/90 opacity-0 transition-opacity group-hover:opacity-100">Watch trailer</span>
          </span>
        ) : null}
      </Wrapper>
      <p className="mt-3 font-medium text-foreground">{r.role}</p>
      {r.note ? <p className="text-sm text-foreground-muted leading-snug mt-0.5">{r.note}</p> : null}
      {r.video ? (
        <p className="text-xs text-neutral-400 mt-1">
          {r.video.label}, via {r.video.source}
        </p>
      ) : null}
    </article>
  );
}

function VideoModal({ role, onClose }: { role: Role | null; onClose: () => void }) {
  useEffect(() => {
    if (!role) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [role, onClose]);

  if (!role?.video) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={`${role.title}: ${role.video.label}`}>
      <div className="absolute inset-0 bg-neutral-950/85" onClick={onClose} />
      <div className="relative w-full max-w-4xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 h-10 w-10 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25"
          aria-label="Close video"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${role.video.id}?autoplay=1&rel=0`}
            title={`${role.title}: ${role.video.label}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-3 text-sm text-white/70">
          {role.title}: {role.video.label}, via {role.video.source}
        </p>
      </div>
    </div>
  );
}

export function CareerRail() {
  const [playing, setPlaying] = useState<Role | null>(null);
  const close = useCallback(() => setPlaying(null), []);
  return (
    <div>
      <div className="-mx-6 px-6 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5 lg:gap-x-6 lg:gap-y-10 lg:overflow-visible">
        {ROLES.map((r) => (
          <RoleCard key={r.title} r={r} onPlay={setPlaying} />
        ))}
      </div>
      <p className="mt-6 text-sm text-foreground-muted">
        Also heard in{" "}
        {ALSO_HEARD_IN.length > 2
          ? `${ALSO_HEARD_IN.slice(0, -1).join(", ")}, and ${ALSO_HEARD_IN[ALSO_HEARD_IN.length - 1]}`
          : ALSO_HEARD_IN.join(" and ")}
        .
      </p>
      <VideoModal role={playing} onClose={close} />
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
