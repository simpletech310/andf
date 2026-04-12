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
        .select("*")
        .eq("page_key", pageKey)
        .order("display_order", { ascending: true }),
      supabase
        .from("page_layouts")
        .select("*")
        .eq("page_key", pageKey)
        .single(),
    ]);

    if (blocksResult.error) throw blocksResult.error;

    const blocks = blocksResult.data || [];
    const layout = layoutResult.data;

    // If layout exists, order blocks by section_order
    let orderedBlocks = blocks;
    if (layout?.section_order?.length) {
      const orderMap = new Map(layout.section_order.map((key: string, idx: number) => [key, idx]));
      orderedBlocks = [...blocks].sort((a, b) => {
        const aIdx = orderMap.get(a.section_key) ?? 999;
        const bIdx = orderMap.get(b.section_key) ?? 999;
        return (aIdx as number) - (bIdx as number);
      });
    }

    return NextResponse.json({ blocks: orderedBlocks, layout });
  } catch (error) {
    console.error("Page blocks error:", error);
    return NextResponse.json({ error: "Failed to fetch page blocks" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    const { pageKey } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    // Update a single block
    if (body.block) {
      const { id, ...updates } = body.block;
      const { data, error } = await supabase
        .from("content_blocks")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ block: data });
    }

    // Update section order
    if (body.sectionOrder) {
      const { data, error } = await supabase
        .from("page_layouts")
        .upsert({
          page_key: pageKey,
          section_order: body.sectionOrder,
          updated_at: new Date().toISOString(),
        }, { onConflict: "page_key" })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ layout: data });
    }

    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  } catch (error) {
    console.error("Page update error:", error);
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    const { pageKey } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    // Get max display_order for this page
    const { data: existing } = await supabase
      .from("content_blocks")
      .select("display_order")
      .eq("page_key", pageKey)
      .order("display_order", { ascending: false })
      .limit(1);

    const nextOrder = (existing?.[0]?.display_order ?? -1) + 1;

    const { data: block, error } = await supabase
      .from("content_blocks")
      .insert({
        page_key: pageKey,
        section_key: body.section_key,
        block_type: body.block_type,
        content: body.content || {},
        display_order: body.display_order ?? nextOrder,
        is_published: body.is_published ?? true,
        is_visible: body.is_visible ?? true,
        settings: body.settings || {},
      })
      .select()
      .single();

    if (error) throw error;

    // Also update layout section_order
    const { data: layout } = await supabase
      .from("page_layouts")
      .select("section_order")
      .eq("page_key", pageKey)
      .single();

    const currentOrder = layout?.section_order || [];
    if (!currentOrder.includes(body.section_key)) {
      await supabase
        .from("page_layouts")
        .upsert({
          page_key: pageKey,
          section_order: [...currentOrder, body.section_key],
          updated_at: new Date().toISOString(),
        }, { onConflict: "page_key" });
    }

    return NextResponse.json({ block });
  } catch (error) {
    console.error("Block create error:", error);
    return NextResponse.json({ error: "Failed to create block" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get("blockId");
    if (!blockId) {
      return NextResponse.json({ error: "blockId required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("content_blocks")
      .delete()
      .eq("id", blockId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Block delete error:", error);
    return NextResponse.json({ error: "Failed to delete block" }, { status: 500 });
  }
}
