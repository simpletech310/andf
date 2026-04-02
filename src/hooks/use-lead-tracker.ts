"use client";

import { useCallback } from "react";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("andf_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("andf_session_id", id);
  }
  return id;
}

export function useLeadTracker() {
  const trackInteraction = useCallback(
    async ({
      email,
      name,
      phone,
      interactionType,
      description,
      metadata,
    }: {
      email?: string;
      name?: string;
      phone?: string;
      interactionType: string;
      description?: string;
      metadata?: Record<string, unknown>;
    }) => {
      try {
        const sessionId = getSessionId();
        await fetch("/api/leads/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            phone,
            interactionType,
            description,
            metadata: { ...metadata, sessionId },
          }),
        });
      } catch {
        // Silent fail for tracking
      }
    },
    []
  );

  const trackCTAClick = useCallback(
    (buttonLabel: string, page: string) => {
      trackInteraction({
        interactionType: "cta_click",
        description: `Clicked "${buttonLabel}"`,
        metadata: { button: buttonLabel, page },
      });
    },
    [trackInteraction]
  );

  return { trackInteraction, trackCTAClick };
}
