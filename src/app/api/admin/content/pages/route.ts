import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const PAGE_DEFINITIONS = [
  { key: "home", label: "Home Page", description: "Main landing page with hero, programs, events, and donation CTA" },
  { key: "about", label: "About", description: "Organization story, timeline, team, and impact" },
  { key: "donate", label: "Donate", description: "Donation page with impact messaging" },
  { key: "contact", label: "Contact", description: "Contact form and information" },
  { key: "programs", label: "Programs Landing", description: "Programs overview and listing" },
  { key: "events", label: "Events Landing", description: "Events overview and listing" },
  { key: "live", label: "Live / Video", description: "Live streaming and video on demand" },
  { key: "gallery", label: "Gallery", description: "Photo and media gallery" },
];

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Get all content blocks grouped by page
    const { data: blocks, error } = await supabase
      .from("content_blocks")
      .select("page_key, section_key, block_type, is_published, updated_at")
      .order("display_order", { ascending: true });

    if (error) throw error;

    // Count sections per page
    const blocksByPage = (blocks || []).reduce<Record<string, number>>((acc, b) => {
      acc[b.page_key] = (acc[b.page_key] || 0) + 1;
      return acc;
    }, {});

    // Get last updated per page
    const lastUpdated = (blocks || []).reduce<Record<string, string>>((acc, b) => {
      if (!acc[b.page_key] || b.updated_at > acc[b.page_key]) {
        acc[b.page_key] = b.updated_at;
      }
      return acc;
    }, {});

    const pages = PAGE_DEFINITIONS.map((page) => ({
      ...page,
      sectionCount: blocksByPage[page.key] || 0,
      lastUpdated: lastUpdated[page.key] || null,
    }));

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Pages list error:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}
