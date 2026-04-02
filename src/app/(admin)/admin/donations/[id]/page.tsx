"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, DollarSign, Mail, Check, Clock, CreditCard, MessageSquare, Loader2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DonationDetail {
  id: string;
  donor: string;
  email: string;
  amount: number;
  currency: string;
  type: string;
  frequency: string | null;
  status: string;
  isAnonymous: boolean;
  message: string | null;
  program: string | null;
  stripePaymentIntentId: string | null;
  stripeSubscriptionId: string | null;
  thankYouSent: boolean;
  thankYouSentAt: string | null;
  leadId: string | null;
  createdAt: string;
}

interface DonorHistoryItem {
  id: string;
  amount: number;
  type: string;
  status: string;
  program: string | null;
  date: string;
}

interface DonorNote {
  id: string;
  type: string;
  content: string;
  date: string;
}

interface LeadInfo {
  id: string;
  name: string;
  status: string;
}

const statusColors: Record<string, "gold" | "success" | "info" | "warning" | "default" | "danger"> = {
  succeeded: "success",
  pending: "warning",
  failed: "danger",
  refunded: "warning",
  cancelled: "default",
};

export default function DonationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [donation, setDonation] = useState<DonationDetail | null>(null);
  const [donorHistory, setDonorHistory] = useState<DonorHistoryItem[]>([]);
  const [donorNotes, setDonorNotes] = useState<DonorNote[]>([]);
  const [lead, setLead] = useState<LeadInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [markingSent, setMarkingSent] = useState(false);

  const fetchDonation = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/donations/${id}`);
      if (!res.ok) throw new Error("Donation not found");
      const data = await res.json();
      setDonation(data.donation);
      setDonorHistory(data.donorHistory);
      setDonorNotes(data.donorNotes);
      setLead(data.lead);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load donation");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDonation();
  }, [fetchDonation]);

  const handleMarkThankYou = async () => {
    if (!donation) return;
    setMarkingSent(true);
    try {
      const res = await fetch(`/api/admin/donations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thank_you_sent: true }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setDonation({ ...donation, thankYouSent: true, thankYouSentAt: new Date().toISOString() });
    } catch {
      console.error("Failed to mark thank you sent");
    } finally {
      setMarkingSent(false);
    }
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/admin/donations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText, note_type: "note" }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      setDonorNotes([
        { id: crypto.randomUUID(), type: "note", content: noteText, date: new Date().toISOString() },
        ...donorNotes,
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

  if (error || !donation) {
    return (
      <div className="space-y-4">
        <Link href="/admin/donations" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-gold-500 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Donations
        </Link>
        <p className="text-red-400">{error || "Donation not found"}</p>
      </div>
    );
  }

  const totalFromDonor = donorHistory.reduce((sum, d) => sum + d.amount, 0) + donation.amount;

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/admin/donations" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-gold-500 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Donations
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donation Details Card */}
        <Card hover={false}>
          <CardContent className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="mx-auto h-16 w-16 rounded-full bg-gold-500/10 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-gold-500" />
              </div>
              <div className="text-3xl font-bold text-gold-500">${donation.amount}</div>
              <Badge variant={statusColors[donation.status] || "default"}>{donation.status}</Badge>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">Donor</span>
                <span className="text-foreground font-medium">{donation.donor}</span>
              </div>
              {donation.email && (
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Email</span>
                  <span className="text-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {donation.email}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">Type</span>
                <Badge variant={donation.type === "recurring" ? "info" : "default"}>
                  {donation.type === "recurring" ? `Recurring (${donation.frequency || "monthly"})` : "One-time"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">Program</span>
                <span className="text-foreground">{donation.program || "General"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">Date</span>
                <span className="text-foreground">
                  {new Date(donation.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              {donation.stripePaymentIntentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Stripe ID</span>
                  <span className="text-foreground-subtle text-xs flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    {donation.stripePaymentIntentId.slice(0, 20)}...
                  </span>
                </div>
              )}
              {donation.isAnonymous && (
                <div className="text-xs text-foreground-subtle italic">This donation was made anonymously.</div>
              )}
            </div>

            {donation.message && (
              <div className="pt-4 border-t border-border">
                <div className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">Message</div>
                <p className="text-sm text-foreground-muted italic">&ldquo;{donation.message}&rdquo;</p>
              </div>
            )}

            {/* Thank You Tracking */}
            <div className="pt-4 border-t border-border">
              <div className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">Thank You</div>
              {donation.thankYouSent ? (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <Check className="h-4 w-4" />
                  Sent {donation.thankYouSentAt
                    ? new Date(donation.thankYouSentAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : ""}
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={handleMarkThankYou}
                  disabled={markingSent}
                >
                  {markingSent ? "Marking..." : "Mark Thank You Sent"}
                </Button>
              )}
            </div>

            {/* Link to Lead */}
            {lead && (
              <div className="pt-4 border-t border-border">
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Lead Profile ({lead.name})
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donor History */}
          <Card hover={false}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Donor History</CardTitle>
                <div className="text-sm text-foreground-muted">
                  Total from donor: <span className="text-gold-500 font-semibold">${totalFromDonor}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {donorHistory.length === 0 ? (
                <p className="text-sm text-foreground-subtle">This is the only donation from this donor.</p>
              ) : (
                <div className="space-y-3">
                  {donorHistory.map((d) => (
                    <Link
                      key={d.id}
                      href={`/admin/donations/${d.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-background-elevated hover:bg-background-elevated/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-gold-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">${d.amount}</div>
                          <div className="text-xs text-foreground-subtle">{d.program || "General"}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={d.status === "succeeded" ? "success" : "warning"} className="text-xs">
                          {d.status}
                        </Badge>
                        <div className="text-xs text-foreground-subtle mt-1">
                          {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card hover={false}>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a note about this donation or donor..."
                  className="min-h-[80px]"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <Button variant="primary" size="sm" onClick={handleSaveNote} disabled={savingNote || !noteText.trim()}>
                  {savingNote ? "Saving..." : "Save Note"}
                </Button>
              </div>

              {donorNotes.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  {donorNotes.map((note) => (
                    <div key={note.id} className="flex gap-3 p-3 rounded-lg bg-background-elevated">
                      <div className="h-7 w-7 rounded-full bg-background-card border border-border flex items-center justify-center shrink-0">
                        {note.type === "thank_you_sent" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : note.type === "phone_call" ? (
                          <Clock className="h-3.5 w-3.5 text-blue-400" />
                        ) : (
                          <MessageSquare className="h-3.5 w-3.5 text-gold-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{note.content}</p>
                        <p className="text-xs text-foreground-subtle mt-1">
                          {new Date(note.date).toLocaleString("en-US", {
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
