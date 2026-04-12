import { createAdminClient } from "@/lib/supabase/admin";

interface AuditEntry {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
}

export async function logAudit(entry: AuditEntry) {
  try {
    const supabase = createAdminClient();
    await supabase.from("audit_log").insert({
      user_id: entry.userId,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId || null,
      changes: entry.changes || null,
      ip_address: entry.ipAddress || null,
    });
  } catch (error) {
    // Audit logging should never break the request
    console.error("Audit log error:", error);
  }
}
