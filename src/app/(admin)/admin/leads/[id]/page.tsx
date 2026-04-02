"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, FileText, MessageSquare, MousePointer, Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface LeadDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  status: string;
  interests: string[];
  notes: string | null;
  totalDonated: number;
  eventsRegistered: number;
  createdAt: string;
  lastInteraction: string | null;
}

interface Interaction {
  id: string;
  type: string;
  description: string;
  metadata: Record<string, unknown>;
  date: string;
}

const interactionIcons: Record<string, typeof DollarSign> = {
  donation: DollarSign,
  event_registration: Calendar,
  contact_form: FileText,
  form_submission: FileText,
  cta_click: MousePointer,
  page_view: Eye,
  note: MessageSquare,
  live_stream_view: Eye,
};

const statusColors: Record<string, "gold" | "success" | "info" | "warning" | "default" | "danger"> = {
  new: "gold",
  contacted: "info",
  engaged: "success",
  donor: "gold",
  volunteer: "success",
  inactive: "default",
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const fetchLead = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`);
      if (!res.ok) throw new Error("Lead not found");
      const data = await res.json();
      setLead(data.lead);
      setInteractions(data.interactions);
      setSelectedStatus(data.lead.status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load lead");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const handleUpdateStatus = async () => {
    if (!lead || selectedStatus === lead.status) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setLead({ ...lead, status: selectedStatus });
    } catch {
      console.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteText }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      const data = await res.json();
      setInteractions([
        {
          id: data.interaction.id,
          type: "note",
          description: noteText,
          metadata: {},
          date: new Date().toISOString(),
        },
        ...interactions,
      ]);
      setNoteText("");
    } catch {
      console.error("Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="space-y-4">
        <Link href="/admin/leads" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-gold-500 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Leads
        </Link>
        <p className="text-red-400">{error || "Lead not found"}</p>
      </div>
    );
  }

  const initials = lead.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-gold-500 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Leads
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card hover={false}>
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-gold-500/10 flex items-center justify-center text-2xl font-display font-bold text-gold-500">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{lead.name}</h2>
              <Badge variant={statusColors[lead.status] || "default"} className="mt-2">{lead.status}</Badge>
            </div>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-center gap-3 text-foreground-muted">
                <Mail className="h-4 w-4 text-gold-500" /> {lead.email}
              </div>
              {lead.phone && (
                <div className="flex items-center gap-3 text-foreground-muted">
                  <Phone className="h-4 w-4 text-gold-500" /> {lead.phone}
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">Source</span>
                <span className="text-foreground capitalize">{lead.source}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">Total Donated</span>
                <span className="text-gold-500 font-semibold">${lead.totalDonated}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">Events Registered</span>
                <span className="text-foreground">{lead.eventsRegistered}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">First Contact</span>
                <span className="text-foreground">{new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
            {lead.interests.length > 0 && (
              <div className="pt-4">
                <div className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">Interests</div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {lead.interests.map((interest) => (
                    <Badge key={interest} variant="outline">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <select
                className="flex-1 h-9 rounded-lg bg-background-elevated border border-border px-3 text-sm text-foreground"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="engaged">Engaged</option>
                <option value="donor">Donor</option>
                <option value="volunteer">Volunteer</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button variant="primary" size="sm" onClick={handleUpdateStatus} disabled={saving || selectedStatus === lead.status}>
                {saving ? "..." : "Update"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Note */}
          <Card hover={false}>
            <CardHeader><CardTitle>Add Note</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Write a note about this lead..."
                className="min-h-[80px]"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <Button variant="primary" size="sm" onClick={handleSaveNote} disabled={savingNote || !noteText.trim()}>
                {savingNote ? "Saving..." : "Save Note"}
              </Button>
            </CardContent>
          </Card>

          {/* Interaction Timeline */}
          <Card hover={false}>
            <CardHeader><CardTitle>Interaction Timeline</CardTitle></CardHeader>
            <CardContent>
              {interactions.length === 0 ? (
                <p className="text-sm text-foreground-subtle">No interactions yet.</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-6">
                    {interactions.map((interaction) => {
                      const Icon = interactionIcons[interaction.type] || MessageSquare;
                      return (
                        <div key={interaction.id} className="relative flex gap-4 pl-2">
                          <div className="h-8 w-8 rounded-full bg-background-elevated border border-border flex items-center justify-center shrink-0 z-10">
                            <Icon className="h-4 w-4 text-gold-500" />
                          </div>
                          <div className="flex-1 pb-2">
                            <p className="text-sm text-foreground">{interaction.description}</p>
                            <p className="text-xs text-foreground-subtle mt-1">
                              {new Date(interaction.date).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
