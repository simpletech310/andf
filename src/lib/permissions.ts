import { createAdminClient } from "@/lib/supabase/admin";

export interface Permission {
  resource: string;
  action: string;
  allowed: boolean;
}

const permissionCache = new Map<string, Permission[]>();

export async function getPermissions(role: string): Promise<Permission[]> {
  if (permissionCache.has(role)) return permissionCache.get(role)!;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("role_permissions")
    .select("resource, action, allowed")
    .eq("role", role);

  if (error) {
    console.error("Permissions fetch error:", error);
    return [];
  }

  const permissions = data || [];
  permissionCache.set(role, permissions);
  // Clear cache after 5 minutes
  setTimeout(() => permissionCache.delete(role), 5 * 60 * 1000);
  return permissions;
}

export async function hasPermission(role: string, resource: string, action: string): Promise<boolean> {
  // Super admin always has access
  if (role === "super_admin") return true;

  const permissions = await getPermissions(role);
  const match = permissions.find((p) => p.resource === resource && p.action === action);
  return match?.allowed ?? false;
}
