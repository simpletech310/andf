"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import type { TeamMember } from "@/lib/team";

export function TeamMemberCard({ name, title, image, bio, featured, onOpen }: TeamMember & { featured?: boolean; onOpen?: () => void }) {
  const hasBio = Boolean(bio?.length && onOpen);
  return (
    <motion.div
      className={`group text-center ${hasBio ? "cursor-pointer" : ""}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={hasBio ? onOpen : undefined}
      onKeyDown={hasBio ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen?.(); } } : undefined}
      role={hasBio ? "button" : undefined}
      tabIndex={hasBio ? 0 : undefined}
      aria-label={hasBio ? `Read ${name}'s bio` : undefined}
    >
      <div className={`relative mx-auto rounded-2xl overflow-hidden border-2 transition-all duration-500 mb-4 shadow-sm group-hover:shadow-xl ${
        featured
          ? "w-40 h-40 sm:w-48 sm:h-48 border-secondary-400 group-hover:border-secondary-500"
          : "w-36 h-36 sm:w-44 sm:h-44 border-neutral-200 group-hover:border-primary-400"
      }`}>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="192px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {featured && (
          <div className="absolute top-2 right-2 bg-secondary-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Founder
          </div>
        )}
      </div>
      <h3 className={`font-semibold group-hover:text-primary-500 transition-colors ${featured ? "text-lg text-foreground" : "text-foreground"}`}>{name}</h3>
      <p className="text-sm text-foreground-muted">{title}</p>
      {hasBio && (
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-500 group-hover:gap-2 transition-all">
          Read bio <ArrowRight className="h-3 w-3" />
        </span>
      )}
    </motion.div>
  );
}

export function BioModal({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  useEffect(() => {
    if (!member) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [member, onClose]);

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bio-title"
            className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 h-9 w-9 inline-flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
              aria-label="Close bio"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 px-6 sm:px-10 pt-10 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-2xl overflow-hidden border-4 border-white/90 shadow-xl">
                <Image src={member.image} alt={member.name} fill className="object-cover" sizes="128px" />
              </div>
              <div className="text-center sm:text-left">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary-300">A New Day Foundation</span>
                <h3 id="bio-title" className="mt-1 text-2xl sm:text-3xl font-bold text-white">{member.name}</h3>
                <p className="text-primary-100">{member.title}</p>
              </div>
            </div>
            <div className="px-6 sm:px-10 py-8 space-y-4">
              {member.bio?.map((para, i) => (
                <p key={i} className="text-foreground-muted leading-relaxed">{para}</p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

