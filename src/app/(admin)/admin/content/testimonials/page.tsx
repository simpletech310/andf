"use client";

import { useState, useEffect } from "react";
import { Plus, Quote, MoreVertical, Loader2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  id: string;
  author: string;
  title: string | null;
  quote: string;
  program_id: string | null;
  program_name: string | null;
  is_featured: boolean;
  is_active: boolean;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Form state
  const [formAuthor, setFormAuthor] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formQuote, setFormQuote] = useState("");
  const [formProgramId, setFormProgramId] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/content/testimonials");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTestimonials(data.testimonials);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const resetForm = () => {
    setFormAuthor(""); setFormTitle(""); setFormQuote(""); setFormProgramId(""); setFormIsFeatured(false); setFormIsActive(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormAuthor(t.author);
    setFormTitle(t.title || "");
    setFormQuote(t.quote);
    setFormProgramId(t.program_id || "");
    setFormIsFeatured(t.is_featured);
    setFormIsActive(t.is_active);
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleSave = async () => {
    if (!formAuthor || !formQuote) { alert("Author and Quote are required."); return; }
    setSaving(true);
    try {
      const body = { author: formAuthor, title: formTitle, quote: formQuote, program_id: formProgramId || null, is_featured: formIsFeatured, is_active: formIsActive };
      const url = editingId ? `/api/admin/content/testimonials/${editingId}` : "/api/admin/content/testimonials";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setShowForm(false); setEditingId(null); resetForm();
      await fetchTestimonials();
    } catch (err: any) { alert(err.message || "Failed to save."); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    setMenuOpen(null);
    try {
      const res = await fetch(`/api/admin/content/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchTestimonials();
    } catch { alert("Failed to delete testimonial."); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background-card border border-border rounded-xl p-6 w-full max-w-lg mx-4 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">{editingId ? "Edit Testimonial" : "New Testimonial"}</h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="text-foreground-subtle hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <Input id="tAuthor" label="Author Name" value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} required />
            <Input id="tTitle" label="Author Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g., Parent of Program Participant" />
            <Textarea id="tQuote" label="Quote" value={formQuote} onChange={(e) => setFormQuote(e.target.value)} required />
            <Input id="tProgram" label="Program ID (optional)" value={formProgramId} onChange={(e) => setFormProgramId(e.target.value)} placeholder="Leave empty for general testimonial" />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="tFeatured" checked={formIsFeatured} onChange={(e) => setFormIsFeatured(e.target.checked)} className="rounded" />
                <label htmlFor="tFeatured" className="text-sm text-foreground-muted">Featured</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="tActive" checked={formIsActive} onChange={(e) => setFormIsActive(e.target.checked)} className="rounded" />
                <label htmlFor="tActive" className="text-sm text-foreground-muted">Active</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editingId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Testimonials</h1>
          <p className="text-foreground-muted mt-1">Manage testimonials and quotes</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <Card key={t.id} hover={false}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <Quote className="h-6 w-6 text-gold-500/30" />
                <div className="flex items-center gap-2">
                  {t.is_featured && <Badge variant="gold">Featured</Badge>}
                  <Badge variant={t.is_active ? "success" : "default"}>{t.is_active ? "Active" : "Inactive"}</Badge>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === t.id ? null : t.id)}
                      className="p-1 text-foreground-subtle hover:text-foreground rounded hover:bg-background-elevated transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {menuOpen === t.id && (
                      <div className="absolute right-0 top-8 z-10 bg-background-card border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                        <button onClick={() => openEdit(t)} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-background-elevated transition-colors">Edit</button>
                        <button onClick={() => handleDelete(t.id)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-background-elevated transition-colors">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground-muted italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">{t.author}</div>
                  <div className="text-xs text-foreground-subtle">{t.title}</div>
                </div>
                {t.program_name && <Badge variant="outline">{t.program_name}</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-2 text-center py-12 text-foreground-muted">No testimonials found.</div>
        )}
      </div>
    </div>
  );
}
