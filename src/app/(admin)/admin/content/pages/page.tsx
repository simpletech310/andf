"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, ArrowRight, Clock, Layers } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { format } from "date-fns";

interface PageInfo {
  key: string;
  label: string;
  description: string;
  sectionCount: number;
  lastUpdated: string | null;
}

export default function ContentPagesListPage() {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch("/api/admin/content/pages");
        const data = await res.json();
        setPages(data.pages || []);
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Website Pages"
        description="Manage the content on every page of your website. Click a page to edit its sections, text, images, and layout."
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-background-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((page) => (
            <Link
              key={page.key}
              href={`/admin/content/pages/${page.key}`}
              className="group relative p-6 rounded-xl border border-border bg-background-card hover:border-primary-200 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary-600 transition-colors">
                      {page.label}
                    </h3>
                    <p className="text-sm text-foreground-muted mt-0.5">
                      {page.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-foreground-subtle group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-foreground-subtle">
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  {page.sectionCount} {page.sectionCount === 1 ? "section" : "sections"}
                </span>
                {page.lastUpdated && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Updated {format(new Date(page.lastUpdated), "MMM d, yyyy")}
                  </span>
                )}
                {!page.lastUpdated && page.sectionCount === 0 && (
                  <span className="text-amber-500">Not set up yet</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-border bg-background-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">How it works</h3>
        <ul className="text-sm text-foreground-muted space-y-1.5">
          <li>1. Click on any page above to see its content sections</li>
          <li>2. Edit text, images, and settings for each section</li>
          <li>3. Reorder sections by dragging them into the order you want</li>
          <li>4. Toggle sections on/off without deleting them</li>
          <li>5. Changes go live immediately when you save</li>
        </ul>
      </div>
    </div>
  );
}
