import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    const { pageKey } = await params;
    const supabase = createAdminClient();

    const [blocksResult, layoutResult] = await Promise.all([
      supabase
        .from("content_blocks")
        .select("section_key, block_type, content, settings")
        .eq("page_key", pageKey)
        .eq("is_published", true)
        .eq("is_visible", true)
        .order("display_order", { ascending: true }),
      supabase
        .from("page_layouts")
        .select("section_order")
        .eq("page_key", pageKey)
        .single(),
    ]);

    if (blocksResult.error) throw blocksResult.error;

    const blocks = blocksResult.data || [];
    const sectionOrder = layoutResult.data?.section_order || [];

    // Order blocks by layout
    let orderedBlocks = blocks;
    if (sectionOrder.length) {
      const orderMap = new Map(sectionOrder.map((key: string, idx: number) => [key, idx]));
      orderedBlocks = [...blocks].sort((a, b) => {
        const aIdx = orderMap.get(a.section_key) ?? 999;
        const bIdx = orderMap.get(b.section_key) ?? 999;
        return (aIdx as number) - (bIdx as number);
      });
    }

    // Build a map of section_key -> content for easy consumption
    const contentMap: Record<string, any> = {};
    for (const block of orderedBlocks) {
      contentMap[block.section_key] = {
        type: block.block_type,
        content: block.content,
        settings: block.settings,
      };
    }

    return NextResponse.json({
      sections: orderedBlocks,
      contentMap,
      sectionOrder: sectionOrder.length ? sectionOrder : orderedBlocks.map((b) => b.section_key),
    });
  } catch (error) {
    console.error("Public content error:", error);
    return NextResponse.json({ sections: [], contentMap: {}, sectionOrder: [] });
  }
}
