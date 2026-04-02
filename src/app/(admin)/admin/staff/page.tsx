"use client";

import { useState, useEffect } from "react";
import {
  Users, Plus, Shield, PenTool, Eye, X, Loader2, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StaffMember {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  avatar_url: string | null;
  updated_at: string;
}

const ROLE_STYLES: Record<string, { variant: "gold" | "info" | "default"; icon: typeof Shield; label: string }> = {
  admin: { variant: "gold", icon: Shield, label: "Admin" },
  editor: { variant: "info", icon: PenTool, label: "Editor" },
  viewer: { variant: "default", icon: Eye, label: "Viewer" },
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [inviting, setInviting] = useState(false);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (res.ok) {
        setShowInvite(false);
        setInviteEmail("");
        setInviteRole("editor");
      }
    } catch (err) {
      console.error("Invite failed:", err);
    } finally {
      setInviting(false);
    }
  }

  async function handleChangeRole(memberId: string, newRole: string) {
    setChangingRole(memberId);
    try {
      await fetch(`/api/admin/staff/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      setStaff((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
    } catch (err) {
      console.error("Role change failed:", err);
    } finally {
      setChangingRole(null);
    }
  }

  async function handleRemove(memberId: string, name: string | null) {
    if (!confirm(`Remove ${name || "this staff member"}? They will be set to viewer and deactivated.`)) {
      return;
    }
    setRemoving(memberId);
    try {
      await fetch(`/api/admin/staff/${memberId}`, { method: "DELETE" });
      setStaff((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      console.error("Remove failed:", err);
    } finally {
      setRemoving(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-11 w-36" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Staff</h1>
          <p className="text-foreground-muted mt-1">Manage team members and roles</p>
        </div>
        <Button variant="primary" onClick={() => setShowInvite(true)}>
          <Plus className="h-4 w-4" /> Invite Staff
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Admins", count: staff.filter((s) => s.role === "admin").length, color: "text-gold-500" },
          { label: "Editors", count: staff.filter((s) => s.role === "editor").length, color: "text-blue-400" },
          { label: "Viewers", count: staff.filter((s) => s.role === "viewer").length, color: "text-foreground-subtle" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-background-card border border-border text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
            <div className="text-xs text-foreground-subtle">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Staff Table */}
      <Card hover={false}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">
                    Member
                  </th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">
                    Role
                  </th>
                  <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">
                    Last Updated
                  </th>
                  <th className="text-right text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => {
                  const roleInfo = ROLE_STYLES[member.role] || ROLE_STYLES.viewer;
                  return (
                    <tr
                      key={member.id}
                      className="border-b border-border last:border-0 hover:bg-background-elevated/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-background-elevated flex items-center justify-center text-sm font-semibold text-gold-500">
                            {member.full_name
                              ? member.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : member.email[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {member.full_name || "No Name"}
                            </div>
                            <div className="text-xs text-foreground-subtle">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground-subtle">
                        {member.updated_at
                          ? new Date(member.updated_at).toLocaleDateString()
                          : "--"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            className="h-9 rounded-lg bg-background-elevated border border-border px-3 text-xs text-foreground-muted"
                            value={member.role}
                            onChange={(e) => handleChangeRole(member.id, e.target.value)}
                            disabled={changingRole === member.id}
                          >
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <button
                            onClick={() => handleRemove(member.id, member.full_name)}
                            disabled={removing === member.id}
                            className="p-2 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {staff.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-8 w-8 text-foreground-subtle mx-auto mb-3" />
              <p className="text-foreground-muted">No staff members found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background-card border border-border shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Invite Staff</h2>
              <button
                onClick={() => setShowInvite(false)}
                className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
              >
                <X className="h-5 w-5 text-foreground-muted" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="team@andf.org"
                required
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground-muted">Role</label>
                <select
                  className="flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={inviting}>
                {inviting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Invite...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Send Invitation
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
