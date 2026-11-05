import { NextResponse } from "next/server";
import { VIDEOS, YOUTUBE_CHANNEL, type ChannelVideo } from "@/lib/videos";

// Re-read the channel at most once an hour.
export const revalidate = 3600;

/** Newest uploads from the ANDF YouTube channel, falling back to the built-in list. */
export async function GET() {
  try {
    const res = await fetch(`${YOUTUBE_CHANNEL}/videos`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ANDF-site/1.0)", "Accept-Language": "en-US,en" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`YouTube ${res.status}`);
    const html = await res.text();
    const videos = parseChannelVideos(html);
    if (videos.length === 0) throw new Error("No videos parsed");
    return NextResponse.json({ videos, source: "youtube" });
  } catch {
    return NextResponse.json({ videos: VIDEOS, source: "fallback" });
  }
}

function parseChannelVideos(html: string): ChannelVideo[] {
  const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
  if (!match) return [];
  const data = JSON.parse(match[1]);
  const known = new Map(VIDEOS.map((v) => [v.id, v]));
  const out: ChannelVideo[] = [];
  const seen = new Set<string>();

  // Each upload is a lockupViewModel with contentId and metadata.lockupMetadataViewModel.title.content.
  const walk = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;
    const lockup = obj.lockupViewModel as
      | { contentId?: string; metadata?: { lockupMetadataViewModel?: { title?: { content?: string } } } }
      | undefined;
    const id = lockup?.contentId;
    const title = lockup?.metadata?.lockupMetadataViewModel?.title?.content;
    if (id && title && !seen.has(id)) {
      seen.add(id);
      out.push(known.get(id) ?? { id, title, tag: "A New Day Now" });
    }
    Object.values(obj).forEach(walk);
  };
  walk(data);
  return out;
}
