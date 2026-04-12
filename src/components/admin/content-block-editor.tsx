"use client";

import { useState } from "react";
import { Save, Eye, EyeOff, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

interface ContentBlockEditorProps {
  block: ContentBlock;
  onSave: (block: ContentBlock) => Promise<void>;
  onDelete?: (blockId: string) => void;
  isDragging?: boolean;
}

const BLOCK_TYPE_LABELS: Record<string, string> = {
  hero: "Hero Section",
  heading_text: "Heading + Text",
  rich_text: "Rich Text",
  image: "Image",
  image_gallery: "Image Gallery",
  stats_grid: "Stats Grid",
  cta_banner: "Call to Action",
  testimonials: "Testimonials",
  programs_grid: "Programs Grid",
  events_list: "Events List",
  team_grid: "Team Grid",
  video: "Video",
  custom_html: "Custom HTML",
  values_grid: "Values Grid",
};

export function ContentBlockEditor({ block, onSave, onDelete, isDragging }: ContentBlockEditorProps) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState<Record<string, any>>(block.content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ ...block, content });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async () => {
    await onSave({ ...block, is_visible: !block.is_visible });
  };

  const updateField = (key: string, value: any) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className={cn(
        "rounded-xl border transition-all",
        isDragging ? "border-primary-500 shadow-lg" : "border-border",
        !block.is_visible && "opacity-50",
        editing ? "bg-background-card" : "bg-background-card/50 hover:bg-background-card"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="cursor-grab text-foreground-subtle hover:text-foreground-muted">
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {content.title || content.label || block.section_key.replace(/_/g, " ")}
            </h3>
            <Badge variant="secondary" className="text-[10px] shrink-0">
              {BLOCK_TYPE_LABELS[block.block_type] || block.block_type}
            </Badge>
            {!block.is_published && (
              <Badge variant="default" className="text-[10px] bg-amber-500/20 text-amber-500">Draft</Badge>
            )}
          </div>
          {content.subtitle || content.description ? (
            <p className="text-xs text-foreground-muted mt-0.5 truncate">
              {content.subtitle || content.description}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleToggleVisibility}
            className="p-1.5 rounded-md text-foreground-muted hover:text-foreground hover:bg-background-elevated transition-colors"
            title={block.is_visible ? "Hide section" : "Show section"}
          >
            {block.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancel" : "Edit"}
          </Button>
          {onDelete && (
            <button
              onClick={() => onDelete(block.id)}
              className="p-1.5 rounded-md text-red-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Delete section"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {renderFieldsForBlockType(block.block_type, content, updateField)}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function renderFieldsForBlockType(
  blockType: string,
  content: Record<string, any>,
  updateField: (key: string, value: any) => void
) {
  switch (blockType) {
    case "hero":
      return (
        <div className="space-y-3">
          <Input label="Label" value={content.label || ""} onChange={(e) => updateField("label", e.target.value)} />
          <Input label="Title (Line 1)" value={content.title_line1 || ""} onChange={(e) => updateField("title_line1", e.target.value)} />
          <Input label="Title (Line 2)" value={content.title_line2 || ""} onChange={(e) => updateField("title_line2", e.target.value)} />
          <Input label="Title (Line 3)" value={content.title_line3 || ""} onChange={(e) => updateField("title_line3", e.target.value)} />
          <Textarea label="Subtitle" value={content.subtitle || ""} onChange={(e) => updateField("subtitle", e.target.value)} />
          <Input label="Background Image URL" value={content.background_image || ""} onChange={(e) => updateField("background_image", e.target.value)} />
          <Input label="CTA 1 Text" value={content.cta1_text || ""} onChange={(e) => updateField("cta1_text", e.target.value)} />
          <Input label="CTA 1 Link" value={content.cta1_link || ""} onChange={(e) => updateField("cta1_link", e.target.value)} />
          <Input label="CTA 2 Text" value={content.cta2_text || ""} onChange={(e) => updateField("cta2_text", e.target.value)} />
          <Input label="CTA 2 Link" value={content.cta2_link || ""} onChange={(e) => updateField("cta2_link", e.target.value)} />
        </div>
      );

    case "heading_text":
      return (
        <div className="space-y-3">
          <Input label="Label" value={content.label || ""} onChange={(e) => updateField("label", e.target.value)} />
          <Input label="Title" value={content.title || ""} onChange={(e) => updateField("title", e.target.value)} />
          <Textarea label="Description" value={content.description || ""} onChange={(e) => updateField("description", e.target.value)} />
        </div>
      );

    case "rich_text":
      return (
        <div className="space-y-3">
          <Input label="Title (optional)" value={content.title || ""} onChange={(e) => updateField("title", e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1.5">Content</label>
            <RichTextEditor content={content.body || ""} onChange={(html) => updateField("body", html)} />
          </div>
        </div>
      );

    case "cta_banner":
      return (
        <div className="space-y-3">
          <Input label="Label" value={content.label || ""} onChange={(e) => updateField("label", e.target.value)} />
          <Input label="Title" value={content.title || ""} onChange={(e) => updateField("title", e.target.value)} />
          <Textarea label="Description" value={content.description || ""} onChange={(e) => updateField("description", e.target.value)} />
          <Input label="Primary Button Text" value={content.cta_text || ""} onChange={(e) => updateField("cta_text", e.target.value)} />
          <Input label="Primary Button Link" value={content.cta_link || ""} onChange={(e) => updateField("cta_link", e.target.value)} />
          <Input label="Secondary Button Text" value={content.cta2_text || ""} onChange={(e) => updateField("cta2_text", e.target.value)} />
          <Input label="Secondary Button Link" value={content.cta2_link || ""} onChange={(e) => updateField("cta2_link", e.target.value)} />
        </div>
      );

    case "stats_grid":
      return (
        <div className="space-y-4">
          <p className="text-xs text-foreground-muted">Edit each stat below. Values are shown as animated counters.</p>
          {(content.stats || []).map((stat: any, idx: number) => (
            <div key={idx} className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-background-elevated/50 border border-border">
              <Input
                label="Value"
                value={stat.target?.toString() || ""}
                onChange={(e) => {
                  const stats = [...(content.stats || [])];
                  stats[idx] = { ...stats[idx], target: parseInt(e.target.value) || 0 };
                  updateField("stats", stats);
                }}
              />
              <Input
                label="Prefix"
                value={stat.prefix || ""}
                onChange={(e) => {
                  const stats = [...(content.stats || [])];
                  stats[idx] = { ...stats[idx], prefix: e.target.value };
                  updateField("stats", stats);
                }}
              />
              <Input
                label="Suffix"
                value={stat.suffix || ""}
                onChange={(e) => {
                  const stats = [...(content.stats || [])];
                  stats[idx] = { ...stats[idx], suffix: e.target.value };
                  updateField("stats", stats);
                }}
              />
              <Input
                label="Label"
                value={stat.label || ""}
                onChange={(e) => {
                  const stats = [...(content.stats || [])];
                  stats[idx] = { ...stats[idx], label: e.target.value };
                  updateField("stats", stats);
                }}
              />
            </div>
          ))}
        </div>
      );

    case "values_grid":
      return (
        <div className="space-y-3">
          <Input label="Section Label" value={content.label || ""} onChange={(e) => updateField("label", e.target.value)} />
          <Input label="Section Title" value={content.title || ""} onChange={(e) => updateField("title", e.target.value)} />
          <Textarea label="Section Description" value={content.description || ""} onChange={(e) => updateField("description", e.target.value)} />
          <p className="text-xs text-foreground-muted pt-2">Edit each value card:</p>
          {(content.values || []).map((value: any, idx: number) => (
            <div key={idx} className="p-3 rounded-lg bg-background-elevated/50 border border-border space-y-2">
              <Input
                label={`Value ${idx + 1} Title`}
                value={value.title || ""}
                onChange={(e) => {
                  const values = [...(content.values || [])];
                  values[idx] = { ...values[idx], title: e.target.value };
                  updateField("values", values);
                }}
              />
              <Textarea
                label="Description"
                value={value.description || ""}
                onChange={(e) => {
                  const values = [...(content.values || [])];
                  values[idx] = { ...values[idx], description: e.target.value };
                  updateField("values", values);
                }}
              />
            </div>
          ))}
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <Input label="Image URL" value={content.url || ""} onChange={(e) => updateField("url", e.target.value)} />
          <Input label="Alt Text" value={content.alt || ""} onChange={(e) => updateField("alt", e.target.value)} />
          <Input label="Caption (optional)" value={content.caption || ""} onChange={(e) => updateField("caption", e.target.value)} />
        </div>
      );

    case "video":
      return (
        <div className="space-y-3">
          <Input label="Video URL or Mux Playback ID" value={content.video_url || ""} onChange={(e) => updateField("video_url", e.target.value)} />
          <Input label="Title" value={content.title || ""} onChange={(e) => updateField("title", e.target.value)} />
          <Textarea label="Description" value={content.description || ""} onChange={(e) => updateField("description", e.target.value)} />
          <Input label="Thumbnail URL" value={content.thumbnail || ""} onChange={(e) => updateField("thumbnail", e.target.value)} />
        </div>
      );

    default:
      return (
        <div className="space-y-3">
          <p className="text-xs text-foreground-muted">Edit raw JSON content for this block type:</p>
          <Textarea
            label="Content (JSON)"
            value={JSON.stringify(content, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                Object.keys(parsed).forEach((key) => updateField(key, parsed[key]));
              } catch {
                // Invalid JSON, ignore
              }
            }}
            className="font-mono text-xs min-h-[200px]"
          />
        </div>
      );
  }
}
