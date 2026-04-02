-- Ad Sponsorship Program Schema
-- Businesses can purchase ad placements on ANDF Now! streams

-- ============================================
-- AD PACKAGES (sponsorship tiers)
-- ============================================
create table public.ad_packages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  duration_months int not null,
  price_cents int not null,
  max_impressions int,
  placement_priority int not null default 0,
  features text[] default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- AD SPONSORS (registered businesses)
-- ============================================
create table public.ad_sponsors (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  website_url text,
  logo_url text,
  stripe_customer_id text,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'suspended', 'inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- AD SUBMISSIONS (individual ad videos)
-- ============================================
create table public.ad_submissions (
  id uuid primary key default uuid_generate_v4(),
  sponsor_id uuid not null references public.ad_sponsors(id) on delete cascade,
  package_id uuid not null references public.ad_packages(id) on delete restrict,
  title text not null,
  description text,
  -- Video lifecycle
  original_video_url text not null,
  mux_asset_id text,
  mux_playback_id text,
  duration_seconds float,
  thumbnail_url text,
  -- Status
  status text not null default 'pending_review'
    check (status in ('pending_review', 'approved', 'rejected', 'active', 'expired', 'paused')),
  rejection_reason text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  -- Payment
  stripe_payment_intent_id text,
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'refunded', 'failed')),
  -- Schedule
  starts_at timestamptz,
  expires_at timestamptz,
  -- Targeting
  target_channels text[] default '{channel_1,channel_2}',
  -- Metrics
  impression_count int not null default 0,
  click_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- AD IMPRESSIONS (analytics log)
-- ============================================
create table public.ad_impressions (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid not null references public.ad_submissions(id) on delete cascade,
  stream_id uuid references public.live_streams(id) on delete set null,
  channel text,
  impression_type text not null default 'view'
    check (impression_type in ('view', 'click', 'skip')),
  viewer_session text,
  created_at timestamptz not null default now()
);

-- ============================================
-- ADD CHANNEL TO LIVE STREAMS
-- ============================================
alter table public.live_streams add column if not exists channel text default 'channel_1'
  check (channel in ('channel_1', 'channel_2'));

-- ============================================
-- INDEXES
-- ============================================
create index idx_ad_submissions_sponsor on public.ad_submissions(sponsor_id);
create index idx_ad_submissions_status on public.ad_submissions(status);
create index idx_ad_submissions_active on public.ad_submissions(status, starts_at, expires_at);
create index idx_ad_impressions_submission on public.ad_impressions(submission_id);
create index idx_ad_impressions_created on public.ad_impressions(created_at);
create index idx_ad_sponsors_email on public.ad_sponsors(contact_email);
create index idx_ad_sponsors_status on public.ad_sponsors(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.ad_packages enable row level security;
alter table public.ad_sponsors enable row level security;
alter table public.ad_submissions enable row level security;
alter table public.ad_impressions enable row level security;

-- Public can read active packages
create policy "Public can read active packages" on public.ad_packages
  for select using (is_active = true);

-- Admin full access on all ad tables
create policy "Admins manage packages" on public.ad_packages
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
  );

create policy "Admins manage sponsors" on public.ad_sponsors
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
  );

create policy "Admins manage submissions" on public.ad_submissions
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
  );

create policy "Admins manage impressions" on public.ad_impressions
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
  );

-- Public can register as sponsors
create policy "Public can register as sponsors" on public.ad_sponsors
  for insert with check (true);

-- Public can submit ads (linked to their sponsor record)
create policy "Public can submit ads" on public.ad_submissions
  for insert with check (true);

-- Public can log impressions
create policy "Public can log impressions" on public.ad_impressions
  for insert with check (true);

-- Public can read active ads (for player)
create policy "Public can read active ads" on public.ad_submissions
  for select using (status = 'active');

-- ============================================
-- SEED DEFAULT PACKAGES
-- ============================================
insert into public.ad_packages (name, slug, description, duration_months, price_cents, placement_priority, features) values
  ('Starter', 'starter', 'Perfect for small businesses looking to reach our community.', 2, 25000, 1,
   '{"Up to 15-second ad", "2 months of airtime", "Basic analytics dashboard", "Community recognition"}'),
  ('Growth', 'growth', 'Our most popular option — ideal for growing brands with a mission.', 4, 50000, 3,
   '{"Up to 30-second ad", "4 months of airtime", "Priority placement", "Detailed analytics", "Social media mention", "Website logo placement"}'),
  ('Premium', 'premium', 'Maximum visibility and impact for established brands and sponsors.', 8, 100000, 5,
   '{"Up to 60-second ad", "8 months of airtime", "Highest priority placement", "Real-time analytics", "Featured sponsor spotlight", "Event partnership opportunities", "Custom campaign support"}'),
  ('Annual Partner', 'annual-partner', 'Year-round partnership with exclusive benefits and dedicated support.', 12, 175000, 8,
   '{"Up to 60-second ad", "12 months of airtime", "Top-tier priority", "Comprehensive analytics", "Co-branded content opportunities", "VIP event access", "Quarterly strategy sessions", "Dedicated account manager"}');
