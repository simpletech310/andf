import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("media_assets")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return NextResponse.json({ asset: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch asset" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    const updates: Record<string, any> = {};
    if (body.alt_text !== undefined) updates.alt_text = body.alt_text;
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.is_favorite !== undefined) updates.is_favorite = body.is_favorite;
    if (body.category !== undefined) updates.category = body.category;

    const { data, error } = await supabase
      .from("media_assets")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ asset: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Get file path first
    const { data: asset } = await supabase
      .from("media_assets")
      .select("file_path")
      .eq("id", id)
      .single();

    if (asset?.file_path) {
      await supabase.storage.from("media").remove([asset.file_path]);
    }

    const { error } = await supabase
      .from("media_assets")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
