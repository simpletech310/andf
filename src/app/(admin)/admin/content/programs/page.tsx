"use client";

import { useState, useEffect } from "react";
import { Plus, GripVertical, MoreVertical, Loader2, X, Trash2, Image as ImageIcon, Film, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/page-header";
import { FileUpload } from "@/components/admin/file-upload";
import { MultiFileUpload } from "@/components/admin/multi-file-upload";

const ICON_OPTIONS = [
  "Music", "Cpu", "Target", "Users", "GraduationCap", "Heart", "MessageCircle",
  "Star", "Zap", "Globe", "Camera", "Award", "BookOpen", "Rocket",
];

const COLOR_OPTIONS = [
  { label: "Violet → Purple", value: "from-violet-500 to-purple-600" },
  { label: "Cyan → Blue", value: "from-cyan-500 to-blue-600" },
  { label: "Emerald → Green", value: "from-emerald-500 to-green-600" },
  { label: "Red → Rose", value: "from-red-500 to-rose-600" },
  { label: "Pink → Rose", value: "from-pink-500 to-rose-600" },
  { label: "Rose → Red", value: "from-rose-700 to-red-900" },
  { label: "Amber → Orange", value: "from-amber-500 to-orange-600" },
  { label: "Primary", value: "from-primary-500 to-primary-700" },
  { label: "Blue → Indigo", value: "from-blue-500 to-indigo-600" },
  { label: "Teal → Cyan", value: "from-teal-500 to-cyan-600" },
];

interface Program {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  logo_url: string | null;
  icon: string | null;
  color: string | null;
  features: string[];
  outcomes: { stat: string; label: string }[];
  gallery_urls: string[];
  video_url: string | null;
  video_title: string | null;
  mux_playback_id: string | null;
  is_active: boolean;
  display_order: number;
  eventsCount: number;
}

interface FormState {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  long_description: string;
  hero_image_url: string;
  logo_url: string;
  icon: string;
  color: string;
  features: string[];
  outcomes: { stat: string; label: string }[];
  gallery_urls: string[];
  video_url: string;
  video_title: string;
  mux_playback_id: string;
  is_active: boolean;
  display_order: number;
}

const emptyForm: FormState = {
  title: "", slug: "", tagline: "", description: "", long_description: "",
  hero_image_url: "", logo_url: "", icon: "Music", color: "from-violet-500 to-purple-600",
  features: [""], outcomes: [{ stat: "", label: "" }], gallery_urls: [""],
  video_url: "", video_title: "", mux_playback_id: "", is_active: true, display_order: 0,
};

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [activeTab, setActiveTab] = useState<"basic" | "content" | "media" | "stats">("basic");

  const fetchPrograms = async () => {
    try {
      const res = await fetch("/api/admin/content/programs");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPrograms(data.programs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrograms(); }, []);

  const resetForm = () => { setForm({ ...emptyForm, features: [""], outcomes: [{ stat: "", label: "" }], gallery_urls: [""] }); };

  const openEdit = (p: Program) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      tagline: p.tagline || "",
      description: p.description || "",
      long_description: p.long_description || "",
      hero_image_url: p.hero_image_url || "",
      logo_url: p.logo_url || "",
      icon: p.icon || "Music",
      color: p.color || "from-violet-500 to-purple-600",
      features: p.features?.length ? p.features : [""],
      outcomes: p.outcomes?.length ? p.outcomes : [{ stat: "", label: "" }],
      gallery_urls: p.gallery_urls?.length ? p.gallery_urls : [""],
      video_url: p.video_url || "",
      video_title: p.video_title || "",
      mux_playback_id: p.mux_playback_id || "",
      is_active: p.is_active,
      display_order: p.display_order,
    });
    setActiveTab("basic");
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) { alert("Title and Slug are required."); return; }
    setSaving(true);
    try {
      const body = {
        title: form.title,
        slug: form.slug,
        tagline: form.tagline || null,
        description: form.description || null,
        long_description: form.long_description || null,
        hero_image_url: form.hero_image_url || null,
        logo_url: form.logo_url || null,
        icon: form.icon || null,
        color: form.color || null,
        features: form.features.filter(f => f.trim()),
        outcomes: form.outcomes.filter(o => o.stat.trim() && o.label.trim()),
        gallery_urls: form.gallery_urls.filter(g => g.trim()),
        video_url: form.video_url || null,
        video_title: form.video_title || null,
        mux_playback_id: form.mux_playback_id || null,
        is_active: form.is_active,
        display_order: form.display_order,
      };
      const url = editingId ? `/api/admin/content/programs/${editingId}` : "/api/admin/content/programs";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setShowForm(false); setEditingId(null); resetForm();
      await fetchPrograms();
    } catch (err: any) { alert(err.message || "Failed to save."); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    setMenuOpen(null);
    try {
      const res = await fetch(`/api/admin/content/programs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchPrograms();
    } catch { alert("Failed to delete program."); }
  };

  // Auto-generate slug from title
  const updateTitle = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  // Full-page editor when form is open
  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-elevated transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <PageHeader title={editingId ? "Edit Program" : "New Program"} description="Configure all program details that appear on the public website" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editingId ? "Update Program" : "Create Program"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-background-elevated w-fit">
          {(["basic", "content", "media", "stats"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                activeTab === tab ? "bg-background-card text-foreground shadow-sm" : "text-foreground-muted hover:text-foreground"
              }`}
            >
              {tab === "stats" ? "Stats & Outcomes" : tab}
            </button>
          ))}
        </div>

        {/* Basic Tab */}
        {activeTab === "basic" && (
          <div className="rounded-xl border border-border bg-background-card p-6 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Input label="Program Title *" value={form.title} onChange={e => updateTitle(e.target.value)} placeholder="e.g., Band Camp" />
              <Input label="URL Slug *" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="e.g., band-camp" />
            </div>
            <Input label="Tagline" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="e.g., Music that moves the soul" />
            <Textarea label="Short Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description shown on program cards..." className="min-h-[80px]" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground-muted">Icon</label>
                <select
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                  className="w-full h-11 rounded-lg bg-background-elevated border border-border px-4 text-foreground text-sm"
                >
                  {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground-muted">Color Theme</label>
                <select
                  value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  className="w-full h-11 rounded-lg bg-background-elevated border border-border px-4 text-foreground text-sm"
                >
                  {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <div className={`h-3 rounded-full bg-gradient-to-r ${form.color} mt-1`} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Input label="Display Order" type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
              <div className="flex items-end gap-3 pb-1">
                <input type="checkbox" id="pActive" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="rounded h-5 w-5" />
                <label htmlFor="pActive" className="text-sm font-medium text-foreground-muted">Program is Active (visible on website)</label>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="rounded-xl border border-border bg-background-card p-6 space-y-5">
            <Textarea
              label="Long Description (separate paragraphs with blank lines)"
              value={form.long_description}
              onChange={e => setForm({ ...form, long_description: e.target.value })}
              placeholder="Detailed description shown on the program detail page. Use double line breaks for new paragraphs..."
              className="min-h-[200px]"
            />

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground-muted">Features (What&apos;s Included)</label>
                <Button variant="outline" size="sm" onClick={() => setForm({ ...form, features: [...form.features, ""] })}>
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
              {form.features.map((feature, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={e => {
                      const updated = [...form.features];
                      updated[i] = e.target.value;
                      setForm({ ...form, features: updated });
                    }}
                    placeholder={`Feature ${i + 1}, e.g., "Professional instruction"`}
                  />
                  {form.features.length > 1 && (
                    <button
                      onClick={() => setForm({ ...form, features: form.features.filter((_, j) => j !== i) })}
                      className="p-2 text-red-600 hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="rounded-xl border border-border bg-background-card p-6 space-y-5">
            <FileUpload
              label="Hero Image"
              accept="image/jpeg,image/png,image/gif,image/webp"
              folder="programs/heroes"
              currentUrl={form.hero_image_url}
              onUpload={(url) => setForm({ ...form, hero_image_url: url })}
            />
            <FileUpload
              label="Logo Image"
              accept="image/jpeg,image/png,image/gif,image/webp"
              folder="programs/logos"
              currentUrl={form.logo_url}
              onUpload={(url) => setForm({ ...form, logo_url: url })}
            />

            <div className="border-t border-border pt-5">
              <MultiFileUpload
                label="Photo Gallery"
                folder="programs/gallery"
                urls={form.gallery_urls.filter(Boolean)}
                onUrlsChange={(urls) => setForm({ ...form, gallery_urls: urls })}
              />
            </div>

            <div className="border-t border-border pt-5 space-y-3">
              <label className="text-sm font-medium text-foreground-muted flex items-center gap-2"><Film className="h-4 w-4" /> Video</label>
              <Input label="Video Title" value={form.video_title} onChange={e => setForm({ ...form, video_title: e.target.value })} placeholder="e.g., Band Camp Highlights" />
              <FileUpload
                label="Program Video"
                accept="video/mp4,video/quicktime,video/webm"
                folder="programs/videos"
                currentUrl={form.video_url}
                onUpload={(url) => setForm({ ...form, video_url: url })}
              />
              <Input label="Mux Playback ID (optional)" value={form.mux_playback_id} onChange={e => setForm({ ...form, mux_playback_id: e.target.value })} placeholder="e.g., DvUNmWbAG0100yvs..." />
              <p className="text-xs text-foreground-subtle">Upload a video directly, or enter a Mux Playback ID from your Video Library.</p>
            </div>
          </div>
        )}

        {/* Stats & Outcomes Tab */}
        {activeTab === "stats" && (
          <div className="rounded-xl border border-border bg-background-card p-6 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground-muted">Outcomes / Impact Stats</label>
                <Button variant="outline" size="sm" onClick={() => setForm({ ...form, outcomes: [...form.outcomes, { stat: "", label: "" }] })}>
                  <Plus className="h-3 w-3" /> Add Stat
                </Button>
              </div>
              <p className="text-xs text-foreground-subtle">These appear in the stats bar on the program detail page (recommended: 4 stats).</p>
              {form.outcomes.map((outcome, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-32">
                    <Input
                      value={outcome.stat}
                      onChange={e => {
                        const updated = [...form.outcomes];
                        updated[i] = { ...updated[i], stat: e.target.value };
                        setForm({ ...form, outcomes: updated });
                      }}
                      placeholder="500+"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={outcome.label}
                      onChange={e => {
                        const updated = [...form.outcomes];
                        updated[i] = { ...updated[i], label: e.target.value };
                        setForm({ ...form, outcomes: updated });
                      }}
                      placeholder="Students Trained"
                    />
                  </div>
                  {form.outcomes.length > 1 && (
                    <button
                      onClick={() => setForm({ ...form, outcomes: form.outcomes.filter((_, j) => j !== i) })}
                      className="p-2 text-red-600 hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Preview */}
            {form.outcomes.some(o => o.stat && o.label) && (
              <div className="border-t border-border pt-5">
                <label className="text-sm font-medium text-foreground-muted mb-3 block">Preview</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg bg-primary-600/10">
                  {form.outcomes.filter(o => o.stat && o.label).map((o, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-primary-500">{o.stat}</div>
                      <div className="text-xs text-foreground-muted mt-0.5">{o.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Program list view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Programs" description="Manage foundation programs — these appear on the public website" />
        <Button variant="primary" onClick={() => { resetForm(); setEditingId(null); setActiveTab("basic"); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> New Program
        </Button>
      </div>

      <Card hover={false}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-10 px-4 py-4"></th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Program</th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Slug</th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Features</th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Events</th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id} className="border-b border-border last:border-0 hover:bg-background-elevated/50 transition-colors">
                    <td className="px-4 py-4 cursor-grab"><GripVertical className="h-4 w-4 text-foreground-subtle" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {program.color && (
                          <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${program.color} flex items-center justify-center shrink-0`}>
                            <span className="text-white text-xs font-bold">{(program.icon || "?")[0]}</span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-foreground">{program.title}</div>
                          <div className="text-xs text-foreground-subtle">{program.tagline}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted font-mono">{program.slug}</td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">{program.features?.length || 0}</td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">{program.eventsCount}</td>
                    <td className="px-6 py-4">
                      <Badge variant={program.is_active ? "success" : "default"}>
                        {program.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === program.id ? null : program.id)}
                        className="p-2 text-foreground-subtle hover:text-foreground rounded-lg hover:bg-background-elevated transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {menuOpen === program.id && (
                        <div className="absolute right-6 top-12 z-10 bg-background-card border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                          <button onClick={() => openEdit(program)} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-background-elevated transition-colors">Edit</button>
                          <button onClick={() => handleDelete(program.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-background-elevated transition-colors">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {programs.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-foreground-muted">No programs yet. Click &quot;New Program&quot; to create your first one.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
