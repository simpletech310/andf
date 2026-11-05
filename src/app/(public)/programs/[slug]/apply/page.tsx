"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmailForm } from "@/components/shared/email-form";
import { PROGRAMS, PROGRAMS_BY_SLUG } from "@/lib/programs";
import { ORG } from "@/lib/contact";

export default function ProgramApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const program = PROGRAMS_BY_SLUG[slug];
  const title = program?.title ?? "an ANDF program";

  return (
    <div className="bg-neutral-50 min-h-screen">
      <section className="bg-primary-900 text-white">
        <div className="mx-auto max-w-4xl px-6 pt-32 pb-12">
          <Link href={program ? `/programs/${slug}` : "/programs"} className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to {program ? program.title : "programs"}
          </Link>
          <div className="mt-6 flex items-center gap-5">
            {program?.logo_url ? (
              <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-white">
                <Image src={program.logo_url} alt={`${program.title} logo`} fill className="object-contain" sizes="80px" />
              </div>
            ) : null}
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-5xl tracking-tight">Apply for {title}</h1>
              <p className="mt-2 text-white/75">For youth ages 13–19. A parent or guardian should help complete this for anyone under 18.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white border border-neutral-200 p-6 sm:p-10">
          <EmailForm
            fields={[
              ...(program
                ? []
                : [{ name: "program", label: "Program", type: "select" as const, options: PROGRAMS.map((p) => p.title), required: true }]),
              { name: "name", label: "Student's full name", required: true, half: true },
              { name: "age", label: "Age", type: "number", required: true, half: true },
              { name: "school", label: "School", half: true },
              { name: "grade", label: "Grade", half: true },
              { name: "email", label: "Student's email", type: "email", required: true, half: true },
              { name: "phone", label: "Student's phone", type: "tel", half: true },
              { name: "city", label: "City", half: true },
              { name: "guardianName", label: "Parent or guardian name", half: true },
              { name: "guardianEmail", label: "Parent or guardian email", type: "email", half: true },
              { name: "guardianPhone", label: "Parent or guardian phone", type: "tel", half: true },
              { name: "interest", label: "Why are you interested in this program?", type: "textarea", required: true },
              { name: "goals", label: "What do you hope to gain?", type: "textarea" },
              {
                name: "heardFrom",
                label: "How did you hear about us?",
                type: "select",
                options: ["School or teacher", "Friend or family", "Social media", "YouTube", "Community organization", "Event", "Other"],
              },
            ]}
            subject={(v) => `Program application: ${program?.title ?? v.program} for ${v.name}`}
            intro={`Hello ANDF team, I'd like to apply for ${program?.title ?? "a program"}.`}
            submitLabel="Send application"
            note={`This opens your email app with the application addressed to ${ORG.email}. Press send to submit. Nothing is stored on this website.`}
          />
        </div>
      </section>
    </div>
  );
}
