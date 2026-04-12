"use client";

import { useState, useEffect } from "react";
import { Shield, Search, Clock, User, Filter } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AuditEntry {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes: Record<string, any>;
  ip_address: string;
  created_at: string;
  profiles: { full_name: string } | null;
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-emerald-500/10 text-emerald-400",
  update: "bg-blue-500/10 text-blue-400",
  delete: "bg-red-500/10 text-red-400",
  login: "bg-gold-500/10 text-gold-500",
  export: "bg-purple-500/10 text-purple-400",
};

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [resourceFilter, setResourceFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  useEffect(() => {
    async function fetchLog() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: page.toString() });
        if (resourceFilter) params.set("resource_type", resourceFilter);
        if (actionFilter) params.set("action", actionFilter);
        const res = await fetch(`/api/admin/settings/audit-log?${params}`);
        const data = await res.json();
        setEntries(data.entries || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Failed to fetch audit log:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLog();
  }, [page, resourceFilter, actionFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Track all administrative actions across the platform."
      />

      <div className="flex gap-3 flex-wrap">
        <select
          value={resourceFilter}
          onChange={(e) => { setResourceFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-border bg-background-card text-sm text-foreground"
        >
          <option value="">All Resources</option>
          <option value="event">Events</option>
          <option value="program">Programs</option>
          <option value="donation">Donations</option>
          <option value="content">Content</option>
          <option value="media">Media</option>
          <option value="staff">Staff</option>
          <option value="settings">Settings</option>
        </select>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-border bg-background-card text-sm text-foreground"
        >
          <option value="">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="export">Export</option>
          <option value="login">Login</option>
        </select>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-background-elevated/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-muted uppercase">Time</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-muted uppercase">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-muted uppercase">Action</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-muted uppercase">Resource</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-muted uppercase hidden lg:table-cell">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-background-card rounded animate-pulse" /></td></tr>
              ))
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <Shield className="h-10 w-10 text-foreground-subtle mx-auto mb-2" />
                  <p className="text-foreground-muted">No audit entries yet</p>
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-background-card/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-foreground-muted whitespace-nowrap">
                    {format(new Date(entry.created_at), "MMM d, h:mm a")}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {entry.profiles?.full_name || "System"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ACTION_COLORS[entry.action] || "bg-neutral-500/10 text-neutral-400"}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">
                    {entry.resource_type}
                    {entry.resource_id && <span className="text-foreground-subtle"> #{entry.resource_id.slice(0, 8)}</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground-subtle hidden lg:table-cell max-w-xs truncate">
                    {entry.changes ? JSON.stringify(entry.changes).slice(0, 80) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 50 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-foreground-muted py-2">Page {page} of {Math.ceil(total / 50)}</span>
          <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
