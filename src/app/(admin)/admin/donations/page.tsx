"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Download, DollarSign, TrendingUp, Users, Repeat, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Donation {
  id: string;
  donor: string;
  email: string;
  amount: number;
  type: string;
  status: string;
  program: string | null;
  date: string;
  thankYouSent: boolean;
  isAnonymous: boolean;
}

interface DonationsData {
  donations: Donation[];
  total: number;
  page: number;
  limit: number;
  stats: {
    totalRaisedMonth: number;
    avgDonation: number;
    uniqueDonors: number;
    recurringCount: number;
  };
}

export default function AdminDonationsPage() {
  const [data, setData] = useState<DonationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (typeFilter) params.set("type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await fetch(`/api/admin/donations?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch {
      console.error("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchDonations, search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [fetchDonations, search]);

  const handleExportCSV = () => {
    window.open("/api/admin/donations?format=csv", "_blank");
  };

  const statsDisplay = [
    { label: "Total Raised (Month)", value: `$${(data?.stats.totalRaisedMonth ?? 0).toLocaleString()}`, icon: DollarSign },
    { label: "Average Donation", value: `$${data?.stats.avgDonation ?? 0}`, icon: TrendingUp },
    { label: "Total Donors", value: String(data?.stats.uniqueDonors ?? 0), icon: Users },
    { label: "Recurring Donors", value: String(data?.stats.recurringCount ?? 0), icon: Repeat },
  ];

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Donations</h1>
          <p className="text-foreground-muted mt-1">Track and manage all donations</p>
        </div>
        <Button variant="secondary" onClick={handleExportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsDisplay.map((stat) => (
          <Card key={stat.label} hover={false}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-gold-500" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-foreground-subtle">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
          <Input
            placeholder="Search donors..."
            className="pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="h-11 rounded-lg bg-background-elevated border border-border px-4 text-sm text-foreground-muted"
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Types</option>
          <option value="one_time">One-time</option>
          <option value="recurring">Recurring</option>
        </select>
        <select
          className="h-11 rounded-lg bg-background-elevated border border-border px-4 text-sm text-foreground-muted"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="succeeded">Succeeded</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
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
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Donor</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Amount</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Type</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Program</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.donations.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-foreground-subtle">
                        No donations found.
                      </td>
                    </tr>
                  )}
                  {data?.donations.map((d) => (
                    <tr key={d.id} className="border-b border-border last:border-0 hover:bg-background-elevated/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/donations/${d.id}`} className="block">
                          <div className="text-sm font-medium text-foreground hover:text-gold-500 transition-colors">{d.donor}</div>
                          <div className="text-xs text-foreground-subtle">{d.email}</div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gold-500">${d.amount}</td>
                      <td className="px-6 py-4">
                        <Badge variant={d.type === "recurring" ? "info" : "default"}>
                          {d.type === "recurring" ? "Monthly" : "One-time"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground-muted">{d.program || "General"}</td>
                      <td className="px-6 py-4">
                        <Badge variant={d.status === "succeeded" ? "success" : d.status === "refunded" ? "warning" : "danger"}>
                          {d.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground-muted">
                        {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
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
