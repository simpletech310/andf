"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, DollarSign, Users, FileText,
  Settings, ChevronLeft, ChevronRight, LogOut, Menu, X, Music,
  Shield, Globe, Image as ImageIcon, ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/admin/content/programs", label: "Programs", icon: Music },
      { href: "/admin/events", label: "Events", icon: Calendar },
      { href: "/admin/donations", label: "Donations", icon: DollarSign },
    ],
  },
  {
    label: "Website",
    items: [
      { href: "/admin/content/pages", label: "Pages", icon: Globe },
      { href: "/admin/content/team", label: "Team", icon: Users },
      { href: "/admin/content/testimonials", label: "Testimonials", icon: FileText },
      { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/staff", label: "Staff", icon: Shield, requiredRole: "super_admin" },
      { href: "/admin/settings/audit-log", label: "Audit Log", icon: ScrollText, requiredRole: "super_admin" },
    ],
  },
];

// Flatten for backward compat
const navItems: NavItem[] = navGroups.flatMap((g) => g.items);

interface UserProfile {
  full_name: string | null;
  email: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();
      setUserProfile({
        full_name: profile?.full_name || null,
        email: user.email || "",
        role: profile?.role || "admin",
      });
    }
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email[0]?.toUpperCase() || "A";
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-40 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-display font-bold text-sm">A</div>
          <span className="font-display font-bold text-foreground">ANDF Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-foreground-muted">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-border flex flex-col transition-all duration-300 shadow-sm",
        collapsed ? "w-20" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-border shrink-0">
          <div className="h-9 w-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-display font-bold shrink-0">A</div>
          {!collapsed && <span className="font-display font-bold text-foreground whitespace-nowrap">ANDF Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-4 px-3">
            {navGroups.map((group) => {
              const groupItems = group.items.filter((item) => {
                if (item.requiredRole && userProfile?.role !== item.requiredRole) return false;
                return true;
              });
              if (groupItems.length === 0) return null;
              return (
                <div key={group.label || "main"}>
                  {group.label && !collapsed && (
                    <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                      {group.label}
                    </div>
                  )}
                  {group.label && collapsed && (
                    <div className="mx-3 mb-1.5 h-px bg-border" />
                  )}
                  <ul className="space-y-0.5">
                    {groupItems.map((item) => {
                      const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                              isActive
                                ? "bg-primary-50 text-primary-600"
                                : "text-foreground-muted hover:text-foreground hover:bg-neutral-100"
                            )}
                            title={collapsed ? item.label : undefined}
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-1">
          {/* User profile */}
          {userProfile && (
            <div className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg",
              collapsed && "justify-center"
            )}>
              <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0">
                {getInitials(userProfile.full_name, userProfile.email)}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {userProfile.full_name || userProfile.email}
                  </p>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 rounded px-1.5 py-0.5 mt-0.5">
                    {userProfile.role.replace("_", " ")}
                  </span>
                </div>
              )}
            </div>
          )}

          <Link href="/" className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-neutral-100 transition-colors"
          )}>
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Back to Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:text-red-500 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-subtle hover:text-foreground-muted w-full transition-colors"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <><ChevronLeft className="h-5 w-5" /> <span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300 pt-16 lg:pt-0",
        collapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
