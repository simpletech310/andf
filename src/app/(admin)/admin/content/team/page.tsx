"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Loader2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  name: string;
  title: string | null;
  type: string;
  bio: string | null;
  photo_url: string | null;
  is_active: boolean;
  display_order: number;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState("staff");
  const [formBio, setFormBio] = useState("");
  const [formPhoto, setFormPhoto] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/admin/content/team");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMembers(data.members);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const filtered = members.filter((m) => {
    if (typeFilter !== "all" && m.type !== typeFilter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const resetForm = () => {
    setFormName(""); setFormTitle(""); setFormType("staff"); setFormBio(""); setFormPhoto(""); setFormIsActive(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setFormName(m.name);
    setFormTitle(m.title || "");
    setFormType(m.type);
    setFormBio(m.bio || "");
    setFormPhoto(m.photo_url || "");
    setFormIsActive(m.is_active);
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleSave = async () => {
    if (!formName) { alert("Name is required."); return; }
    setSaving(true);
    try {
      const body = { name: formName, title: formTitle, type: formType, bio: formBio, photo_url: formPhoto || null, is_active: formIsActive };
      const url = editingId ? `/api/admin/content/team/${editingId}` : "/api/admin/content/team";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setShowForm(false); setEditingId(null); resetForm();
      await fetchMembers();
    } catch (err: any) { alert(err.message || "Failed to save."); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    setMenuOpen(null);
    try {
      const res = await fetch(`/api/admin/content/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchMembers();
    } catch { alert("Failed to delete member."); }
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
              <h3 className="text-lg font-semibold text-foreground">{editingId ? "Edit Member" : "New Member"}</h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="text-foreground-subtle hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <Input id="mName" label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
            <Input id="mTitle" label="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground-muted">Type</label>
              <select className="flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground" value={formType} onChange={(e) => setFormType(e.target.value)}>
                <option value="board">Board</option>
                <option value="staff">Staff</option>
                <option value="advisor">Advisor</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            <Textarea id="mBio" label="Bio" value={formBio} onChange={(e) => setFormBio(e.target.value)} />
            <Input id="mPhoto" label="Photo URL" value={formPhoto} onChange={(e) => setFormPhoto(e.target.value)} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="mActive" checked={formIsActive} onChange={(e) => setFormIsActive(e.target.checked)} className="rounded" />
              <label htmlFor="mActive" className="text-sm text-foreground-muted">Active</label>
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
          <h1 className="text-3xl font-display font-bold text-foreground">Team Members</h1>
          <p className="text-foreground-muted mt-1">Manage board and staff</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Member
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
          <Input placeholder="Search team..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          className="h-11 rounded-lg bg-background-elevated border border-border px-4 text-sm text-foreground-muted"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="board">Board</option>
          <option value="staff">Staff</option>
          <option value="advisor">Advisor</option>
          <option value="volunteer">Volunteer</option>
        </select>
      </div>

      <Card hover={false}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Name</th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Title</th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Type</th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr key={member.id} className="border-b border-border last:border-0 hover:bg-background-elevated/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gold-500/10 flex items-center justify-center text-sm font-semibold text-gold-500">
                          {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">{member.title}</td>
                    <td className="px-6 py-4">
                      <Badge variant={member.type === "board" ? "gold" : "default"}>{member.type}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={member.is_active ? "success" : "default"}>
                        {member.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === member.id ? null : member.id)}
                        className="p-2 text-foreground-subtle hover:text-foreground rounded-lg hover:bg-background-elevated transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {menuOpen === member.id && (
                        <div className="absolute right-6 top-12 z-10 bg-background-card border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                          <button onClick={() => openEdit(member)} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-background-elevated transition-colors">Edit</button>
                          <button onClick={() => handleDelete(member.id)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-background-elevated transition-colors">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-foreground-muted">No team members found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
