import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// The public site has no backend. Only the legacy admin area still uses Supabase auth.
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
