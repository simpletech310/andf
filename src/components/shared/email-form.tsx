"use client";

import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ORG, mailtoHref, formatLines } from "@/lib/contact";

export interface EmailField {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select" | "date";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  /** Half width on larger screens. */
  half?: boolean;
  defaultValue?: string;
  help?: string;
}

interface EmailFormProps {
  fields: EmailField[];
  /** Email subject, built from what the person typed. */
  subject: (values: Record<string, string>) => string;
  /** Optional opening line for the email body. */
  intro?: string;
  submitLabel?: string;
  /** Shown under the button. */
  note?: string;
}

const inputClass =
  "w-full rounded-lg bg-white border border-neutral-300 px-4 text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500";

/**
 * A form with no backend: on submit it opens the visitor's email app with a message
 * to ANDF already written. Nothing is stored or sent by the website.
 */
export function EmailForm({ fields, subject, intro, submitLabel = "Send by email", note }: EmailFormProps) {
  const [sent, setSent] = useState<{ href: string; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    fields.forEach((f) => (values[f.name] = String(data.get(f.name) ?? "").trim()));
    const subj = subject(values);
    const lines: (string | [string, string])[] = [];
    if (intro) lines.push(intro, "");
    fields.forEach((f) => lines.push([f.label, values[f.name]]));
    const href = mailtoHref(subj, lines);
    const text = [`To: ${ORG.email}`, `Subject: ${subj}`, "", ...formatLines(lines)].join("\n");
    setSent({ href, text });
    window.location.href = href;
  }

  async function copy() {
    if (!sent) return;
    await navigator.clipboard.writeText(sent.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-6 sm:p-8" role="status">
        <div className="h-12 w-12 rounded-full bg-primary-500 text-white flex items-center justify-center">
          <Mail className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-foreground">Your email is ready to send</h3>
        <p className="mt-2 text-foreground-muted leading-relaxed">
          Your email app should have opened with your message to {ORG.email}. Press send there and we&apos;ll reply
          as soon as we can.
        </p>
        <p className="mt-4 text-sm text-foreground-muted">Didn&apos;t open? Copy the message and email it to us yourself.</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button type="button" onClick={copy} variant="primary">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy message"}
          </Button>
          <a href={sent.href}>
            <Button type="button" variant="outline" className="w-full">Open email again</Button>
          </a>
          <Button type="button" variant="ghost" onClick={() => setSent(null)}>Edit message</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
      {fields.map((f) => {
        const id = `ef-${f.name}`;
        const span = f.half ? "" : "sm:col-span-2";
        return (
          <div key={f.name} className={`space-y-1.5 ${span}`}>
            <label htmlFor={id} className="text-sm font-medium text-neutral-700">
              {f.label}
              {f.required ? <span className="text-secondary-600"> *</span> : null}
            </label>
            {f.type === "textarea" ? (
              <textarea id={id} name={f.name} required={f.required} placeholder={f.placeholder} defaultValue={f.defaultValue} rows={4} className={`${inputClass} py-3`} />
            ) : f.type === "select" ? (
              <select id={id} name={f.name} required={f.required} defaultValue={f.defaultValue ?? ""} className={`${inputClass} h-11`}>
                <option value="">Choose one</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input id={id} name={f.name} type={f.type ?? "text"} required={f.required} placeholder={f.placeholder} defaultValue={f.defaultValue} className={`${inputClass} h-11`} />
            )}
            {f.help ? <p className="text-xs text-neutral-500">{f.help}</p> : null}
          </div>
        );
      })}
      <div className="sm:col-span-2 pt-1">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <Mail className="h-4 w-4" />
          {submitLabel}
        </Button>
        <p className="mt-3 text-xs text-neutral-500">
          {note ?? `This opens your email app with your message to ${ORG.email}. Nothing is stored on this website.`}
        </p>
      </div>
    </form>
  );
}
