"use client";

import { useState, useEffect } from "react";
import { Shield, Check, X, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";

interface Permission {
  id: string;
  role: string;
  resource: string;
  action: string;
  allowed: boolean;
}

const ROLES = ["super_admin", "admin", "editor", "viewer"];
const RESOURCES = ["content", "events", "donations", "media", "staff", "settings"];
const ACTIONS = ["read", "write", "delete", "export"];

export default function RolesPermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const res = await fetch("/api/admin/settings/roles");
        const data = await res.json();
        setPermissions(data.permissions || []);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPermissions();
  }, []);

  const isAllowed = (role: string, resource: string, action: string): boolean => {
    if (role === "super_admin") return true;
    const perm = permissions.find((p) => p.role === role && p.resource === resource && p.action === action);
    return perm?.allowed ?? false;
  };

  const togglePermission = async (role: string, resource: string, action: string) => {
    if (role === "super_admin") return; // Can't modify super_admin
    const key = `${role}-${resource}-${action}`;
    setSaving(key);

    const currentlyAllowed = isAllowed(role, resource, action);
    try {
      const res = await fetch("/api/admin/settings/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, resource, action, allowed: !currentlyAllowed }),
      });
      if (res.ok) {
        const data = await res.json();
        setPermissions((prev) => {
          const idx = prev.findIndex((p) => p.role === role && p.resource === resource && p.action === action);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = data.permission;
            return updated;
          }
          return [...prev, data.permission];
        });
      }
    } catch (error) {
      console.error("Failed to update permission:", error);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Configure what each role can access. Super Admin always has full access."
      />

      {loading ? (
        <div className="h-64 rounded-xl bg-background-card animate-pulse" />
      ) : (
        <div className="space-y-8">
          {ROLES.map((role) => (
            <div key={role} className="rounded-xl border border-border bg-background-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-background-elevated/30">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary-600" />
                  <h3 className="text-sm font-semibold text-foreground capitalize">{role.replace("_", " ")}</h3>
                  {role === "super_admin" && (
                    <span className="text-xs text-foreground-subtle">(All permissions, cannot be modified)</span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-foreground-subtle pb-2 pl-2">Resource</th>
                      {ACTIONS.map((action) => (
                        <th key={action} className="text-center text-xs font-medium text-foreground-subtle pb-2 capitalize">{action}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RESOURCES.map((resource) => (
                      <tr key={resource} className="border-t border-border/50">
                        <td className="py-2 pl-2 text-sm text-foreground capitalize">{resource}</td>
                        {ACTIONS.map((action) => {
                          const allowed = isAllowed(role, resource, action);
                          const key = `${role}-${resource}-${action}`;
                          const isSaving = saving === key;

                          return (
                            <td key={action} className="py-2 text-center">
                              <button
                                onClick={() => togglePermission(role, resource, action)}
                                disabled={role === "super_admin" || isSaving}
                                className={`inline-flex items-center justify-center h-7 w-7 rounded-md transition-colors ${
                                  role === "super_admin"
                                    ? "bg-emerald-500/10 text-emerald-600 cursor-not-allowed"
                                    : allowed
                                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                    : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                                }`}
                              >
                                {isSaving ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : allowed ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <X className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
