"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface AdminUser {
  id: string;
  email: string;
}

interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
}

interface UseAdminUserReturn {
  user: AdminUser | null;
  profile: AdminProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAdminUser(): UseAdminUserReturn {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setLoading(false);
        return;
      }

      setUser({ id: authUser.id, email: authUser.email! });

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileData) {
        setProfile(profileData as AdminProfile);
      }

      setLoading(false);
    }

    fetchUser();
  }, []);

  const isAdmin =
    !!profile && ["super_admin", "admin", "editor"].includes(profile.role);

  return { user, profile, loading, isAdmin };
}
