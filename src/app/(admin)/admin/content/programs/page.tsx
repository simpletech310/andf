"use client";

import { useState, useEffect } from "react";
import { Plus, GripVertical, MoreVertical, Loader2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Program {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  hero_image_url: string | null;
  is_active: boolean;
  display_order: number;
  eventsCount: number;
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formHeroImage, setFormHeroImage] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

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

  const resetForm = () => {
    setFormTitle(""); setFormSlug(""); setFormTagline(""); setFormDescription(""); setFormHeroImage(""); setFormIsActive(true);
  };

  const openEdit = (p: Program) => {
    setEditingId(p.id);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormTagline(p.tagline || "");
    setFormDescription(p.description || "");
    setFormHeroImage(p.hero_image_url || "");
    setFormIsActive(p.is_active);
    setShowNewForm(true);
    setMenuOpen(null);
  };

  const handleSave = async () => {
    if (!formTitle || !formSlug) { alert("Title and Slug are required."); return; }
    setSaving(true);
    try {
      const body = { title: formTitle, slug: formSlug, tagline: formTagline, description: formDescription, hero_image_url: formHeroImage || null, is_active: formIsActive };
      const url = editingId ? `/api/admin/content/programs/${editingId}` : "/api/admin/content/programs";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setShowNewForm(false); setEditingId(null); resetForm();
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

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Programs</h1>
          <p className="text-foreground-muted mt-1">Manage foundation programs</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setEditingId(null); setShowNewForm(true); }}>
          <Plus className="h-4 w-4" /> New Program
        </Button>
      </div>

      {/* New/Edit Form Modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background-card border border-border rounded-xl p-6 w-full max-w-lg mx-4 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">{editingId ? "Edit Program" : "New Program"}</h3>
              <button onClick={() => { setShowNewForm(false); setEditingId(null); resetForm(); }} className="text-foreground-subtle hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <Input id="pTitle" label="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
            <Input id="pSlug" label="Slug" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} required placeholder="e.g., band-camp" />
            <Input id="pTagline" label="Tagline" value={formTagline} onChange={(e) => setFormTagline(e.target.value)} />
            <Textarea id="pDesc" label="Description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
            <Input id="pHero" label="Hero Image URL" value={formHeroImage} onChange={(e) => setFormHeroImage(e.target.value)} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pActive" checked={formIsActive} onChange={(e) => setFormIsActive(e.target.checked)} className="rounded" />
              <label htmlFor="pActive" className="text-sm text-foreground-muted">Active</label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => { setShowNewForm(false); setEditingId(null); resetForm(); }}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editingId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card hover={false}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-10 px-4 py-4"></th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Program</th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Slug</th>
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
                      <div className="text-sm font-medium text-foreground">{program.title}</div>
                      <div className="text-xs text-foreground-subtle">{program.tagline}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted font-mono">{program.slug}</td>
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
                          <button onClick={() => handleDelete(program.id)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-background-elevated transition-colors">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {programs.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-foreground-muted">No programs found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
