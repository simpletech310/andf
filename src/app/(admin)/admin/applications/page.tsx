"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ─────────────────────────────────────────────── */
/*  Types                                          */
/* ─────────────────────────────────────────────── */

interface Application {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_age: number | null;
  status: string;
  created_at: string;
  programs: { id: string; title: string; slug: string } | null;
}

interface ApiResponse {
  applications: Application[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ─────────────────────────────────────────────── */
/*  Status helpers                                 */
/* ─────────────────────────────────────────────── */

const statusColors: Record<
  string,
  "info" | "warning" | "success" | "danger" | "outline"
> = {
  submitted: "info",
  under_review: "warning",
  accepted: "success",
  rejected: "danger",
  waitlisted: "outline",
};

const statusLabels: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
  waitlisted: "Waitlisted",
};

/* ─────────────────────────────────────────────── */
/*  Page                                           */
/* ─────────────────────────────────────────────── */

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");

  // Bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    under_review: 0,
    accepted: 0,
    rejected: 0,
  });

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (programFilter) params.set("program", programFilter);
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await fetch(`/api/admin/applications?${params}`);
      const data: ApiResponse = await res.json();

      setApplications(data.applications || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      console.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, programFilter, page]);

  // Fetch stats (unfiltered count)
  const fetchStats = useCallback(async () => {
    try {
      const statuses = ["submitted", "under_review", "accepted", "rejected"];
      const results = await Promise.all([
        fetch("/api/admin/applications?limit=1").then((r) => r.json()),
        ...statuses.map((s) =>
          fetch(`/api/admin/applications?status=${s}&limit=1`).then((r) =>
            r.json()
          )
        ),
      ]);
      setStats({
        total: results[0].total || 0,
        submitted: results[1].total || 0,
        under_review: results[2].total || 0,
        accepted: results[3].total || 0,
        rejected: results[4].total || 0,
      });
    } catch {
      // stats are supplementary
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === applications.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(applications.map((a) => a.id)));
    }
  };

  const handleBulkAction = async (action: "accept" | "reject" | "waitlist") => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      await fetch("/api/admin/applications/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), action }),
      });
      setSelected(new Set());
      fetchApplications();
      fetchStats();
    } catch {
      console.error("Bulk action failed");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Program",
      "Age",
      "Status",
      "Submitted",
    ];
    const rows = applications.map((a) => [
      a.applicant_name,
      a.applicant_email,
      a.programs?.title || "Unknown",
      a.applicant_age ?? "",
      statusLabels[a.status] || a.status,
      new Date(a.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `applications-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Applications
          </h1>
          <p className="text-foreground-muted mt-1">
            Review and manage program applications
          </p>
        </div>
        <Button variant="secondary" onClick={handleExportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            count: stats.total,
            color: "text-foreground",
            icon: FileText,
          },
          {
            label: "Pending Review",
            count: stats.submitted + stats.under_review,
            color: "text-amber-400",
            icon: Clock,
          },
          {
            label: "Accepted",
            count: stats.accepted,
            color: "text-emerald-400",
            icon: CheckCircle2,
          },
          {
            label: "Rejected",
            count: stats.rejected,
            color: "text-red-400",
            icon: XCircle,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-background-card border border-border text-center"
          >
            <stat.icon
              className={`h-5 w-5 mx-auto mb-1 ${stat.color} opacity-60`}
            />
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.count}
            </div>
            <div className="text-xs text-foreground-subtle">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <select
          className="h-11 rounded-lg bg-background-elevated border border-border px-4 text-sm text-foreground-muted"
          value={programFilter}
          onChange={(e) => {
            setProgramFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Programs</option>
          <option value="band-camp">Band Camp</option>
          <option value="drone-experience">Drone Experience</option>
          <option value="topgolf">TopGolf Experience</option>
          <option value="mentorship">Mentorship Program</option>
          <option value="hbcu-heroes">HBCU Heroes</option>
          <option value="mentors">MenTORS</option>
          <option value="sisters-hangout">Sisters Hangout</option>
        </select>
        <select
          className="h-11 rounded-lg bg-background-elevated border border-border px-4 text-sm text-foreground-muted"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="waitlisted">Waitlisted</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-500/10 border border-primary-500/20">
          <span className="text-sm text-foreground-muted">
            {selected.size} selected
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleBulkAction("accept")}
            disabled={bulkLoading}
          >
            {bulkLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3 w-3" />
            )}{" "}
            Accept Selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleBulkAction("reject")}
            disabled={bulkLoading}
          >
            <XCircle className="h-3 w-3" /> Reject Selected
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <Card hover={false}>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-foreground-muted" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-10 w-10 mx-auto text-foreground-subtle mb-3" />
              <p className="text-foreground-muted">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 w-10">
                      <input
                        type="checkbox"
                        className="accent-primary-500"
                        checked={
                          selected.size === applications.length &&
                          applications.length > 0
                        }
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">
                      Applicant
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">
                      Program
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">
                      Age
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-border last:border-0 hover:bg-background-elevated/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="accent-primary-500"
                          checked={selected.has(app.id)}
                          onChange={() => toggleSelect(app.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="block"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-background-elevated flex items-center justify-center text-sm font-semibold text-primary-500">
                              {app.applicant_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground hover:text-primary-500 transition-colors">
                                {app.applicant_name}
                              </div>
                              <div className="text-xs text-foreground-subtle">
                                {app.applicant_email}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="text-sm text-foreground-muted"
                        >
                          {app.programs?.title || "Unknown Program"}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground-muted">
                        {app.applicant_age ?? "---"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={statusColors[app.status] || "default"}
                        >
                          {statusLabels[app.status] || app.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground-subtle">
                        {formatDate(app.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground-subtle">
            Showing {(page - 1) * 20 + 1}--
            {Math.min(page * 20, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-foreground-muted">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
