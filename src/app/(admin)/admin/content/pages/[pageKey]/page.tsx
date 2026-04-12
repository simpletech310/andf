"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, ExternalLink, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { ContentBlockEditor } from "@/components/admin/content-block-editor";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";

interface ContentBlock {
  id: string;
  page_key: string;
  section_key: string;
  block_type: string;
  content: Record<string, any>;
  display_order: number;
  is_published: boolean;
  is_visible: boolean;
  settings: Record<string, any>;
}

const PAGE_LABELS: Record<string, string> = {
  home: "Home Page",
  about: "About",
  donate: "Donate",
  contact: "Contact",
  programs: "Programs Landing",
  events: "Events Landing",
  live: "Live / Video",
  gallery: "Gallery",
};

const PAGE_URLS: Record<string, string> = {
  home: "/",
  about: "/about",
  donate: "/donate",
  contact: "/contact",
  programs: "/programs",
  events: "/events",
  live: "/live",
  gallery: "/gallery",
};

const NEW_BLOCK_TYPES = [
  { type: "heading_text", label: "Heading + Text" },
  { type: "rich_text", label: "Rich Text" },
  { type: "image", label: "Image" },
  { type: "cta_banner", label: "Call to Action" },
  { type: "stats_grid", label: "Stats Grid" },
  { type: "values_grid", label: "Values Grid" },
  { type: "video", label: "Video" },
];

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageKey = params.pageKey as string;

  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteBlockId, setDeleteBlockId] = useState<string | null>(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchBlocks = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/content/pages/${pageKey}`);
      const data = await res.json();
      setBlocks(data.blocks || []);
    } catch (error) {
      console.error("Failed to fetch blocks:", error);
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleSaveBlock = async (updatedBlock: ContentBlock) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/pages/${pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block: { id: updatedBlock.id, content: updatedBlock.content, is_visible: updatedBlock.is_visible, is_published: updatedBlock.is_published } }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setBlocks((prev) => prev.map((b) => (b.id === data.block.id ? data.block : b)));
    } catch (error) {
      console.error("Failed to save block:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlock = async () => {
    if (!deleteBlockId) return;
    try {
      const res = await fetch(`/api/admin/content/pages/${pageKey}?blockId=${deleteBlockId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setBlocks((prev) => prev.filter((b) => b.id !== deleteBlockId));
    } catch (error) {
      console.error("Failed to delete block:", error);
    } finally {
      setDeleteBlockId(null);
    }
  };

  const handleAddBlock = async (blockType: string) => {
    const sectionKey = `${blockType}_${Date.now()}`;
    const defaultContent = getDefaultContent(blockType);

    try {
      const res = await fetch(`/api/admin/content/pages/${pageKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_key: sectionKey,
          block_type: blockType,
          content: defaultContent,
        }),
      });
      if (!res.ok) throw new Error("Create failed");
      const data = await res.json();
      setBlocks((prev) => [...prev, data.block]);
      setShowAddBlock(false);
    } catch (error) {
      console.error("Failed to add block:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/content/pages"
          className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-elevated transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <PageHeader
            title={PAGE_LABELS[pageKey] || pageKey}
            description="Edit the content sections on this page. Changes save individually per section."
          />
        </div>
        <a
          href={PAGE_URLS[pageKey] || "/"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-foreground-muted hover:text-gold-500 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Preview Page
        </a>
      </div>

      {saving && (
        <div className="flex items-center gap-2 text-sm text-gold-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-background-card animate-pulse" />
          ))}
        </div>
      ) : blocks.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <p className="text-foreground-muted mb-4">
            No content sections set up yet for this page.
          </p>
          <p className="text-sm text-foreground-subtle mb-6">
            Run the seed script or add sections manually below.
          </p>
          <Button onClick={() => setShowAddBlock(true)}>
            <Plus className="h-4 w-4" />
            Add First Section
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block) => (
            <ContentBlockEditor
              key={block.id}
              block={block}
              onSave={handleSaveBlock}
              onDelete={(id) => setDeleteBlockId(id)}
            />
          ))}
        </div>
      )}

      {/* Add Section Button */}
      {blocks.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAddBlock(!showAddBlock)}
            className="border-dashed"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </div>
      )}

      {/* Add Section Panel */}
      {showAddBlock && (
        <div className="rounded-xl border border-border bg-background-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Choose a section type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {NEW_BLOCK_TYPES.map((bt) => (
              <button
                key={bt.type}
                onClick={() => handleAddBlock(bt.type)}
                className="p-4 rounded-lg border border-border hover:border-gold-500/30 hover:bg-gold-500/5 transition-all text-center"
              >
                <span className="text-sm font-medium text-foreground">{bt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteBlockId}
        onClose={() => setDeleteBlockId(null)}
        onConfirm={handleDeleteBlock}
        title="Delete Section"
        message="Are you sure you want to delete this content section? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}

function getDefaultContent(blockType: string): Record<string, any> {
  switch (blockType) {
    case "heading_text":
      return { label: "", title: "New Section", description: "" };
    case "rich_text":
      return { title: "", body: "<p>Start writing here...</p>" };
    case "image":
      return { url: "", alt: "", caption: "" };
    case "cta_banner":
      return { label: "Take Action", title: "Your Headline Here", description: "Add a description...", cta_text: "Learn More", cta_link: "/" };
    case "stats_grid":
      return { stats: [{ target: 0, prefix: "", suffix: "+", label: "Stat 1", description: "" }] };
    case "values_grid":
      return { label: "", title: "Our Values", description: "", values: [{ title: "Value 1", description: "Description..." }] };
    case "video":
      return { video_url: "", title: "", description: "", thumbnail: "" };
    default:
      return {};
  }
}
