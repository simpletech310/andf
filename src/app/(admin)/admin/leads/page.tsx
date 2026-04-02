"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Download, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  status: string;
  interests: string[];
  totalDonated: number;
  interactionCount: number;
  lastInteraction: string | null;
  createdAt: string;
}

interface LeadsData {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  funnel: Record<string, number>;
}

const statusColors: Record<string, "gold" | "success" | "info" | "warning" | "default" | "danger"> = {
  new: "gold",
  contacted: "info",
  engaged: "success",
  donor: "gold",
  volunteer: "success",
  inactive: "default",
};

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function AdminLeadsPage() {
  const [data, setData] = useState<LeadsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (sourceFilter) params.set("source", sourceFilter);
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await fetch(`/api/admin/leads?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchLeads, search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [fetchLeads, search]);

  const handleExportCSV = () => {
    window.open("/api/admin/leads?format=csv", "_blank");
  };

  const funnelStages = [
    { label: "New", key: "new", color: "text-gold-500" },
    { label: "Contacted", key: "contacted", color: "text-blue-400" },
    { label: "Engaged", key: "engaged", color: "text-emerald-400" },
    { label: "Donors", key: "donor", color: "text-gold-400" },
    { label: "Volunteers", key: "volunteer", color: "text-green-400" },
    { label: "Inactive", key: "inactive", color: "text-foreground-subtle" },
  ];

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Leads / CRM</h1>
          <p className="text-foreground-muted mt-1">Track and manage all contacts and leads</p>
        </div>
        <Button variant="secondary" onClick={handleExportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Funnel stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {funnelStages.map((stage) => (
          <div key={stage.label} className="p-4 rounded-xl bg-background-card border border-border text-center">
            <div className={`text-2xl font-bold ${stage.color}`}>
              {data?.funnel?.[stage.key] ?? 0}
            </div>
            <div className="text-xs text-foreground-subtle">{stage.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
          <Input
            placeholder="Search leads by name or email..."
            className="pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="h-11 rounded-lg bg-background-elevated border border-border px-4 text-sm text-foreground-muted"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="engaged">Engaged</option>
          <option value="donor">Donor</option>
          <option value="volunteer">Volunteer</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          className="h-11 rounded-lg bg-background-elevated border border-border px-4 text-sm text-foreground-muted"
          value={sourceFilter}
          onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Sources</option>
          <option value="website">Website</option>
          <option value="event">Event</option>
          <option value="donation">Donation</option>
          <option value="referral">Referral</option>
          <option value="social">Social</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Table */}
      <Card hover={false}>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-gold-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Contact</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Source</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Interests</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Donated</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.leads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-foreground-subtle">
                        No leads found.
                      </td>
                    </tr>
                  )}
                  {data?.leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-background-elevated/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/leads/${lead.id}`} className="block">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-background-elevated flex items-center justify-center text-sm font-semibold text-gold-500">
                              {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground hover:text-gold-500 transition-colors">{lead.name}</div>
                              <div className="text-xs text-foreground-subtle">{lead.email}</div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground-muted capitalize">{lead.source}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColors[lead.status] || "default"}>{lead.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {lead.interests.slice(0, 2).map((interest) => (
                            <Badge key={interest} variant="outline" className="text-xs">{interest}</Badge>
                          ))}
                          {lead.interests.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{lead.interests.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground-muted">
                        {lead.totalDonated > 0 ? <span className="text-gold-500 font-medium">${lead.totalDonated}</span> : "\u2014"}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground-subtle">{relativeTime(lead.lastInteraction)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <div className="text-sm text-foreground-subtle">
                Showing {((data.page - 1) * data.limit) + 1}-{Math.min(data.page * data.limit, data.total)} of {data.total}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
