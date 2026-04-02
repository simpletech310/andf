# ANDF Admin Backend — Production Build Tracker

> Last updated: 2026-04-01
> Status: **COMPLETE** — All phases built. Needs migration run + compile verification.

---

## Phase 1 — Fix Broken Core Flows

| Task | Status | Files |
|---|---|---|
| Wire Stripe Elements into donate page | `[x]` | `src/app/(public)/donate/page.tsx` |
| Wire event registration form to real API | `[x]` | `src/app/(public)/events/[id]/register/page.tsx` |
| Add QR code generation on registration | `[x]` | `src/app/api/events/[id]/register/qr/route.ts` |
| Add logout button to admin sidebar | `[x]` | `src/app/(admin)/layout.tsx` |
| Enforce role checks in admin API routes | `[x]` | `src/app/api/admin/ads/review/route.ts` |
| Add password reset to login page | `[x]` | `src/app/login/page.tsx` |

## Phase 2 — Database & Foundation

| Task | Status | Files |
|---|---|---|
| Migration 003: program_applications, event_checkins, donor_notes, staff_invitations, video_library, video_ad_cue_points | `[x]` | `supabase/migrations/003_admin_features.sql` |
| Shared admin components (DataTable, PageHeader, StatCard, FilterBar, StatusBadge, ConfirmDialog) | `[x]` | `src/components/admin/*.tsx` |
| Admin auth helper (reusable role check) | `[x]` | `src/lib/admin-auth.ts` |

## Phase 3 — Wire Admin Pages to Real Data

| Task | Status | Files |
|---|---|---|
| Dashboard — real metrics from Supabase | `[x]` | `src/app/(admin)/admin/page.tsx` |
| Leads — real data, search, filter, detail wired | `[x]` | `src/app/(admin)/admin/leads/page.tsx`, `[id]/page.tsx` |
| Donations — real data, donor detail, thank-you tracking | `[x]` | `src/app/(admin)/admin/donations/page.tsx`, `[id]/page.tsx` |
| Events — real data, create/edit wired, detail page | `[x]` | `src/app/(admin)/admin/events/page.tsx`, `[id]/page.tsx`, `new/page.tsx` |
| Ads — real data, confirm dialogs | `[x]` | `src/app/(admin)/admin/ads/page.tsx` |
| Programs — real CRUD | `[x]` | `src/app/(admin)/admin/content/programs/page.tsx` |
| Team — real CRUD | `[x]` | `src/app/(admin)/admin/content/team/page.tsx` |
| Testimonials — real CRUD | `[x]` | `src/app/(admin)/admin/content/testimonials/page.tsx` |
| Streams — wire to real data + create + delete | `[x]` | `src/app/(admin)/admin/streams/page.tsx` |
| Settings — wire save to Supabase | `[x]` | `src/app/(admin)/admin/settings/page.tsx` |
| Update sidebar nav with new sections | `[x]` | `src/app/(admin)/layout.tsx` |

## Phase 4 — New Admin Sections

| Task | Status | Files |
|---|---|---|
| Program Applications — list, detail, status workflow, bulk actions | `[x]` | `src/app/(admin)/admin/applications/page.tsx`, `[id]/page.tsx` |
| Public program application forms | `[x]` | `src/app/(public)/programs/[slug]/apply/page.tsx` |
| Program application API routes | `[x]` | `src/app/api/applications/route.ts`, `src/app/api/admin/applications/` |
| Event Check-in page (mobile-first) | `[x]` | `src/app/(admin)/admin/events/[id]/checkin/page.tsx` |
| Check-in API routes | `[x]` | `src/app/api/admin/events/[id]/checkin/route.ts` |
| QR code check-in landing page | `[x]` | `src/app/(public)/checkin/[token]/page.tsx` |
| Video Library admin — list, upload to Mux, manage | `[x]` | `src/app/(admin)/admin/videos/page.tsx` |
| Video upload API (Mux direct upload) | `[x]` | `src/app/api/admin/videos/route.ts` |
| Per-video ad cue point management | `[x]` | `src/app/(admin)/admin/videos/[id]/page.tsx` |
| Ad cue points API | `[x]` | `src/app/api/admin/videos/[id]/cuepoints/route.ts` |
| Sponsor video upload portal | `[x]` | `src/app/(public)/sponsor/submit/page.tsx` |
| Staff Management page | `[x]` | `src/app/(admin)/admin/staff/page.tsx` |
| Staff API routes | `[x]` | `src/app/api/admin/staff/route.ts`, `[id]/route.ts` |

## Phase 5 — Analytics, Export & Polish

| Task | Status | Files |
|---|---|---|
| Event KPIs (attendance rate, check-in stats) | `[x]` | `src/app/(admin)/admin/events/[id]/page.tsx` |
| Program impact dashboards | `[x]` | `src/app/(admin)/admin/applications/page.tsx` |
| Donor tiers + thank-you tracking | `[x]` | `src/app/(admin)/admin/donations/[id]/page.tsx` |
| CSV export route | `[x]` | `src/app/api/admin/export/route.ts` |
| Bulk actions on applications | `[x]` | `src/app/api/admin/applications/bulk/route.ts` |
| Content CRUD API routes | `[x]` | `src/app/api/admin/content/*/route.ts` |
| Admin settings API | `[x]` | `src/app/api/admin/settings/route.ts` |
| Stream delete API | `[x]` | `src/app/api/admin/streams/[id]/route.ts` |

---

## What Was Built — Summary

### 47 New Files Created
- **6 shared admin components** (`src/components/admin/`)
- **1 admin auth helper** (`src/lib/admin-auth.ts`)
- **1 database migration** (`supabase/migrations/003_admin_features.sql`)
- **22 API routes** (`src/app/api/admin/` + `src/app/api/applications/`)
- **10 new admin pages** (applications, donations detail, events detail, events checkin, videos, videos detail, staff)
- **4 new public pages** (program apply, sponsor submit, QR checkin landing, event register QR)
- **3 modified admin pages** wired to real data (dashboard, leads, donations)

### 15 Existing Files Modified
- Donate page (Stripe Elements integration)
- Event registration form (wired to real API + QR code display)
- Admin layout (logout, new nav items, user profile, role-based visibility)
- Login page (password reset)
- Admin ads review API (role enforcement)
- All admin list pages (real Supabase data)
- Programs page (Apply Now button)
- Mux webhook (video library asset.ready handling)

### Complete User Workflows Now Supported
1. **Donor** → visits /donate → selects amount → pays via Stripe Elements → webhook saves to DB → appears in admin /admin/donations
2. **Sponsor** → registers at /sponsor → submits ad at /sponsor/submit → staff reviews at /admin/ads → approves → collects payment → ad plays in content
3. **Event attendee** → registers at /events/[id]/register → gets QR code → shows QR at door → staff scans at /admin/events/[id]/checkin → checked in
4. **Program applicant** → applies at /programs/[slug]/apply → staff reviews at /admin/applications → accept/reject/waitlist workflow
5. **Staff** → uploads video at /admin/videos → goes to Mux → manages ad cue points at /admin/videos/[id] → sets exact timestamps for ad insertion
6. **Admin** → sees real metrics at /admin → manages leads, donors, events, programs, team, testimonials, streams, settings → exports CSV

---

## Pre-Production Checklist

- [ ] Run migration 003 in Supabase SQL editor
- [ ] Set real STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env.local
- [ ] Create Stripe webhook endpoint pointing to /api/webhooks/stripe
- [ ] Upgrade Mux plan for live streaming (currently free tier)
- [ ] Create first super_admin user in Supabase Auth
- [ ] Test full donation flow end-to-end
- [ ] Test event registration + check-in flow
- [ ] Test program application workflow
- [ ] Wire useLeadTracker hook into public pages (optional enhancement)
- [ ] Add email service integration for receipts/notifications (optional)

## Architecture Notes

- **Stack**: Next.js 16 App Router, TypeScript, Supabase, Stripe, Mux, Framer Motion
- **Auth**: Supabase Auth with role-based access (super_admin, admin, editor, viewer)
- **Admin pattern**: Client Components with useEffect data fetching from admin API routes
- **API pattern**: All admin mutations through `/api/admin/*` routes with role verification via `requireAdmin()`
- **UI library**: Custom components in `src/components/ui/` (Card, Badge, Button, Input, etc.)
- **Colors**: gold-500 (money/active), emerald-400 (success), amber-400 (warning), red-400 (error)
- **Dev server**: `next dev --webpack` on port 3000

## Dependencies (all installed)

```
@stripe/stripe-js + @stripe/react-stripe-js  — frontend Stripe Elements
qrcode + @types/qrcode                        — QR code generation
@mux/mux-node                                 — Mux API
@mux/mux-player-react                         — Mux player
```
