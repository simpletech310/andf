"use client";

import { useState, useEffect } from "react";
import {
  Megaphone, Search, Check, X, Clock, Eye, Play,
  DollarSign, TrendingUp, Building2,
  BarChart3, AlertCircle, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdSubmission {
  id: string;
  title: string;
  sponsorName: string;
  sponsorEmail: string;
  packageName: string;
  duration: string;
  priceCents: number;
  status: "pending_review" | "approved" | "active" | "rejected" | "expired" | "paused";
  paymentStatus: "paid" | "unpaid" | "refunded" | "failed";
  submittedAt: string;
  startsAt: string | null;
  expiresAt: string | null;
  videoUrl: string;
  impressions: number;
  clicks: number;
  rejectionReason: string | null;
}

interface Stats {
  totalRevenue: number;
  activeAds: number;
  pendingReview: number;
  totalImpressions: number;
}

type StatusFilter = "all" | "pending_review" | "approved" | "active" | "rejected" | "expired";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending_review: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending Review" },
  approved: { bg: "bg-blue-100", text: "text-blue-700", label: "Approved" },
  active: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
  rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
  expired: { bg: "bg-neutral-100", text: "text-neutral-600", label: "Expired" },
  paused: { bg: "bg-orange-100", text: "text-orange-700", label: "Paused" },
};

const PAYMENT_STYLES: Record<string, { bg: string; text: string }> = {
  paid: { bg: "bg-green-100", text: "text-green-700" },
  unpaid: { bg: "bg-amber-100", text: "text-amber-700" },
  refunded: { bg: "bg-neutral-100", text: "text-neutral-600" },
  failed: { bg: "bg-red-100", text: "text-red-700" },
};

export default function AdminAdsPage() {
  const [submissions, setSubmissions] = useState<AdSubmission[]>([]);
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, activeAds: 0, pendingReview: 0, totalImpressions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectDialogId, setRejectDialogId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/admin/ads");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmissions(data.submissions);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message || "Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const filtered = submissions.filter((sub) => {
    if (statusFilter !== "all" && sub.status !== statusFilter) return false;
    if (search && !sub.title.toLowerCase().includes(search.toLowerCase()) && !sub.sponsorName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleApprove = async (id: string) => {
    if (!window.confirm("Approve this ad? It will be submitted to Mux for processing.")) return;
    setReviewingId(id);
    try {
      await fetch("/api/admin/ads/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: id, action: "approve" }),
      });
      await fetchAds();
    } catch {
      alert("Failed to approve ad.");
    }
    setReviewingId(null);
  };

  const handleReject = async (id: string) => {
    setRejectDialogId(id);
  };

  const confirmReject = async () => {
    if (!rejectDialogId || !rejectReason.trim()) return;
    setReviewingId(rejectDialogId);
    try {
      await fetch("/api/admin/ads/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: rejectDialogId, action: "reject", rejectionReason: rejectReason }),
      });
      await fetchAds();
    } catch {
      alert("Failed to reject ad.");
    }
    setReviewingId(null);
    setRejectDialogId(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-8">
      {/* Reject Dialog */}
      {rejectDialogId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background-card border border-border rounded-xl p-6 w-full max-w-md mx-4 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Reject Ad</h3>
            <p className="text-sm text-foreground-muted">Provide a reason for rejection:</p>
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-background-elevated border border-border text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-gold-500/40 min-h-[80px]"
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setRejectDialogId(null); setRejectReason(""); }}
                className="px-4 py-2 rounded-lg text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Megaphone className="h-7 w-7 text-gold-500" />
            Ad Sponsorships
          </h1>
          <p className="text-foreground-muted mt-1">Manage ad submissions, sponsors, and campaigns.</p>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-500 bg-green-500/10" },
              { label: "Active Ads", value: String(stats.activeAds), icon: Play, color: "text-blue-500 bg-blue-500/10" },
              { label: "Pending Review", value: String(stats.pendingReview), icon: Clock, color: "text-amber-500 bg-amber-500/10" },
              { label: "Total Impressions", value: stats.totalImpressions.toLocaleString(), icon: Eye, color: "text-violet-500 bg-violet-500/10" },
            ].map((stat) => (
              <div key={stat.label} className="p-5 rounded-xl bg-background-card border border-border">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-foreground-muted">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
              <input
                type="text"
                placeholder="Search ads or sponsors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background-elevated border border-border text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "pending_review", "active", "approved", "rejected"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium border transition-colors",
                    statusFilter === s
                      ? "bg-gold-500/10 border-gold-500/30 text-gold-500"
                      : "bg-background-elevated border-border text-foreground-muted hover:text-foreground"
                  )}
                >
                  {s === "all" ? "All" : STATUS_STYLES[s]?.label || s}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background-elevated border-b border-border">
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Ad / Sponsor</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Package</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Payment</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Performance</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((sub) => {
                    const statusStyle = STATUS_STYLES[sub.status] || STATUS_STYLES.pending_review;
                    const paymentStyle = PAYMENT_STYLES[sub.paymentStatus] || PAYMENT_STYLES.unpaid;
                    const ctr = sub.impressions > 0 ? ((sub.clicks / sub.impressions) * 100).toFixed(1) : "0.0";

                    return (
                      <tr key={sub.id} className="bg-background-card hover:bg-background-elevated transition-colors">
                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-foreground">{sub.title}</p>
                            <p className="text-xs text-foreground-muted flex items-center gap-1 mt-0.5">
                              <Building2 className="h-3 w-3" />
                              {sub.sponsorName}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-foreground">{sub.packageName}</p>
                          <p className="text-xs text-foreground-muted">{sub.duration} · ${(sub.priceCents / 100).toLocaleString()}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${paymentStyle.bg} ${paymentStyle.text}`}>
                            {sub.paymentStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4 text-xs text-foreground-muted">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {sub.impressions.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {ctr}% CTR
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {sub.status === "pending_review" && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApprove(sub.id)}
                                disabled={reviewingId === sub.id}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-xs font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50"
                              >
                                <Check className="h-3 w-3" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(sub.id)}
                                disabled={reviewingId === sub.id}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                              >
                                <X className="h-3 w-3" />
                                Reject
                              </button>
                            </div>
                          )}
                          {sub.status === "active" && (
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-background-elevated text-foreground-muted text-xs font-medium hover:text-foreground transition-colors ml-auto">
                              <BarChart3 className="h-3 w-3" />
                              Analytics
                            </button>
                          )}
                          {sub.status === "rejected" && sub.rejectionReason && (
                            <span className="text-xs text-foreground-subtle italic">
                              &quot;{sub.rejectionReason.length > 30 ? sub.rejectionReason.slice(0, 30) + "..." : sub.rejectionReason}&quot;
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="p-12 text-center">
                <AlertCircle className="h-8 w-8 text-foreground-subtle mx-auto mb-3" />
                <p className="text-foreground-muted">No ad submissions match your filters.</p>
              </div>
            )}
          </div>

          {/* Info callout */}
          <div className="rounded-xl bg-primary-500/5 border border-primary-500/20 p-6">
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary-500" />
              How Ad Sponsorships Work
            </h3>
            <ol className="space-y-2 text-sm text-foreground-muted">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                Sponsors register and submit their video ad through the public sponsor page.
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                You review and approve/reject the ad. Approved ads are automatically uploaded to Mux.
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                Once paid, the ad goes live and is inserted into ANDF Now! streams via client-side cue points.
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                Track impressions, clicks, and CTR in the performance column. Ads auto-expire based on package duration.
              </li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
