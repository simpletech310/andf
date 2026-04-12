"use client";

import { useState, useEffect } from "react";

interface ContentBlock {
  section_key: string;
  block_type: string;
  content: Record<string, any>;
  settings: Record<string, any>;
}

interface PageContent {
  sections: ContentBlock[];
  contentMap: Record<string, { type: string; content: Record<string, any>; settings: Record<string, any> }>;
  sectionOrder: string[];
  loading: boolean;
}

export function usePageContent(pageKey: string): PageContent {
  const [data, setData] = useState<Omit<PageContent, "loading">>({
    sections: [],
    contentMap: {},
    sectionOrder: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`/api/content/${pageKey}`);
        if (res.ok) {
          const json = await res.json();
          setData({
            sections: json.sections || [],
            contentMap: json.contentMap || {},
            sectionOrder: json.sectionOrder || [],
          });
        }
      } catch {
        // Silently fail - components will use hardcoded fallbacks
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [pageKey]);

  return { ...data, loading };
}

/**
 * Helper to get a specific section's content with a fallback
 */
export function getSectionContent<T extends Record<string, any>>(
  contentMap: Record<string, any>,
  sectionKey: string,
  fallback: T
): T {
  const section = contentMap[sectionKey];
  if (!section?.content) return fallback;
  return { ...fallback, ...section.content };
}
