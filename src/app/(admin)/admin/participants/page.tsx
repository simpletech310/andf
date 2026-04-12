"use client";

import { useState, useEffect } from "react";
import { Search, Users, Download, Mail, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin/stat-card";

interface Participant {
  email: string;
  name: string;
  phone: string;
  events: { event_id: string; title: string; checked_in: boolean }[];
  checkins: number;
  lastRegistration: string;
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchParticipants() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: page.toString() });
        if (search) params.set("search", search);
        const res = await fetch(`/api/admin/participants?${params}`);
        const data = await res.json();
        setParticipants(data.participants || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchParticipants();
  }, [search, page]);

  const uniqueParticipants = participants.length;
  const totalCheckins = participants.reduce((sum, p) => sum + p.checkins, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Participants"
        description="View all event participants across all events. Search by name, email, or phone."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Registrations" value={total.toString()} icon={Users} />
        <StatCard label="Unique Participants" value={uniqueParticipants.toString()} icon={Users} />
        <StatCard label="Total Check-ins" value={totalCheckins.toString()} icon={CheckCircle} />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-card text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary-300"
          />
        </div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-background-elevated/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-muted uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-muted uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-muted uppercase tracking-wider hidden md:table-cell">Phone</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-muted uppercase tracking-wider">Events</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-muted uppercase tracking-wider">Check-ins</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-background-card rounded animate-pulse" /></td></tr>
              ))
            ) : participants.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-foreground-muted">No participants found</td></tr>
            ) : (
              participants.map((p) => (
                <tr key={p.email} className="hover:bg-background-card/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">{p.email}</td>
                  <td className="px-4 py-3 text-sm text-foreground-muted hidden md:table-cell">{p.phone || "—"}</td>
                  <td className="px-4 py-3 text-sm text-center text-foreground">{p.events.length}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={p.checkins > 0 ? "text-emerald-600" : "text-foreground-subtle"}>
                      {p.checkins}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 25 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-foreground-muted py-2">Page {page}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
