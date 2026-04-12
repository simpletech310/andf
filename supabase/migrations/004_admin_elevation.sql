-- Admin Backend Elevation Migration
-- Phase 1: CMS content blocks and page layouts
-- Phase 2: Media library enhancements
-- Phase 3: Page builder support
-- Phase 4: Program enhancements
-- Phase 5: Donation campaigns and donor communications
-- Phase 6: Participant summary view
-- Phase 7: Event sessions and session check-ins
-- Phase 8: Video pay-per-view access
-- Phase 9: Ad campaign enhancements
-- Phase 10: Role permissions and audit log

-- ============================================
-- 1. CONTENT BLOCKS (CMS)
-- ============================================
create table public.content_blocks (
  id uuid primary key default uuid_generate_v4(),
  page_key text not null,
  section_key text not null,
  block_type text not null check (block_type in (
    'hero', 'heading_text', 'rich_text', 'image', 'image_gallery',
    'stats_grid', 'cta_banner', 'testimonials', 'programs_grid',
    'events_list', 'team_grid', 'video', 'custom_html', 'values_grid'
  )),
  content jsonb not null default '{}',
  display_order int not null default 0,
  is_published boolean not null default true,
  is_visible boolean not null default true,
  settings jsonb not null default '{}',
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(page_key, section_key)
);

-- ============================================
-- 2. PAGE LAYOUTS
-- ============================================
create table public.page_layouts (
  id uuid primary key default uuid_generate_v4(),
  page_key text unique not null,
  section_order text[] not null default '{}',
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- ============================================
-- 3. MEDIA LIBRARY ENHANCEMENTS
-- ============================================
alter table public.media_assets add column if not exists tags text[] default '{}';
alter table public.media_assets add column if not exists width int;
alter table public.media_assets add column if not exists height int;
alter table public.media_assets add column if not exists thumbnail_url text;
alter table public.media_assets add column if not exists is_favorite boolean default false;

-- ============================================
-- 4. PROGRAM ENHANCEMENTS
-- ============================================
alter table public.programs add column if not exists page_content jsonb default '{}';
alter table public.programs add column if not exists registration_enabled boolean default false;
alter table public.programs add column if not exists registration_deadline timestamptz;
alter table public.programs add column if not exists default_form_template_id uuid references public.registration_form_templates(id) on delete set null;

-- ============================================
-- 5. DONATION CAMPAIGNS
-- ============================================
create table public.donation_campaigns (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  goal_amount decimal(10,2) not null default 0,
  raised_amount decimal(10,2) not null default 0,
  start_date timestamptz,
  end_date timestamptz,
  status text not null default 'draft' check (status in ('draft','active','completed','cancelled')),
  cover_image_url text,
  is_featured boolean default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- 6. DONOR COMMUNICATIONS
-- ============================================
create table public.donor_communications (
  id uuid primary key default uuid_generate_v4(),
  donor_email text not null,
  type text not null default 'email' check (type in ('email','phone','meeting','letter','other')),
  subject text,
  body text,
  sent_by uuid references public.profiles(id) on delete set null,
  sent_at timestamptz default now(),
  created_at timestamptz not null default now()
);

alter table public.donations add column if not exists campaign_id uuid references public.donation_campaigns(id) on delete set null;

-- ============================================
-- 7. VIDEO PAY-PER-VIEW ACCESS
-- ============================================
alter table public.video_library add column if not exists pay_per_view boolean default false;
alter table public.video_library add column if not exists minimum_amount decimal(10,2) default 0;
alter table public.video_library add column if not exists suggested_amounts int[] default '{5,10,25}';

create table public.video_access (
  id uuid primary key default uuid_generate_v4(),
  video_id uuid not null references public.video_library(id) on delete cascade,
  viewer_email text not null,
  amount_paid decimal(10,2) not null default 0,
  stripe_payment_intent_id text,
  access_token text unique default encode(gen_random_bytes(16), 'hex'),
  expires_at timestamptz default now() + interval '30 days',
  created_at timestamptz not null default now()
);

-- ============================================
-- 8. EVENT SESSIONS
-- ============================================
create table public.event_sessions (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  description text,
  start_time timestamptz,
  end_time timestamptz,
  location text,
  capacity int,
  display_order int default 0,
  created_at timestamptz not null default now()
);

create table public.session_checkins (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.event_sessions(id) on delete cascade,
  registration_id uuid not null references public.registrations(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  checked_in_by uuid references public.profiles(id) on delete set null,
  unique(session_id, registration_id)
);

-- ============================================
-- 9. AD CAMPAIGN ENHANCEMENTS
-- ============================================
alter table public.ad_submissions add column if not exists campaign_name text;
alter table public.ad_submissions add column if not exists daily_budget_cents int;
alter table public.ad_submissions add column if not exists total_budget_cents int;
alter table public.ad_submissions add column if not exists spent_cents int default 0;
alter table public.ad_submissions add column if not exists start_date timestamptz;
alter table public.ad_submissions add column if not exists end_date timestamptz;

-- ============================================
-- 10. ROLE PERMISSIONS
-- ============================================
create table public.role_permissions (
  id uuid primary key default uuid_generate_v4(),
  role text not null,
  resource text not null,
  action text not null check (action in ('read','write','delete','export')),
  allowed boolean not null default true,
  unique(role, resource, action)
);

-- ============================================
-- 11. AUDIT LOG
-- ============================================
create table public.audit_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  changes jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

-- ============================================
-- 12. PARTICIPANT SUMMARY VIEW
-- ============================================
create or replace view public.participant_summary as
select
  r.registrant_email,
  r.registrant_name,
  r.registrant_phone,
  count(distinct r.event_id) as events_count,
  count(case when r.checked_in then 1 end) as checkins_count,
  max(r.created_at) as last_registration,
  bool_or(r.checked_in) as ever_checked_in
from public.registrations r
group by r.registrant_email, r.registrant_name, r.registrant_phone;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.content_blocks enable row level security;
alter table public.page_layouts enable row level security;
alter table public.donation_campaigns enable row level security;
alter table public.donor_communications enable row level security;
alter table public.video_access enable row level security;
alter table public.event_sessions enable row level security;
alter table public.session_checkins enable row level security;
alter table public.role_permissions enable row level security;
alter table public.audit_log enable row level security;

-- Public read for published content
create policy "Public read published content_blocks" on public.content_blocks for select using (is_published = true and is_visible = true);
create policy "Admin full content_blocks" on public.content_blocks for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','editor')));

create policy "Public read page_layouts" on public.page_layouts for select using (true);
create policy "Admin full page_layouts" on public.page_layouts for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','editor')));

create policy "Public read active campaigns" on public.donation_campaigns for select using (status = 'active');
create policy "Admin full donation_campaigns" on public.donation_campaigns for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')));

create policy "Admin full donor_communications" on public.donor_communications for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')));

create policy "Video access by token" on public.video_access for select using (true);
create policy "Admin full video_access" on public.video_access for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')));

create policy "Public read event_sessions" on public.event_sessions for select using (true);
create policy "Admin full event_sessions" on public.event_sessions for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')));

create policy "Admin full session_checkins" on public.session_checkins for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')));

create policy "Super admin full role_permissions" on public.role_permissions for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'super_admin'));
create policy "Admin read role_permissions" on public.role_permissions for select using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')));

create policy "Admin read audit_log" on public.audit_log for select using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')));
create policy "Admin insert audit_log" on public.audit_log for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','editor')));

-- ============================================
-- INDEXES
-- ============================================
create index idx_content_blocks_page on public.content_blocks(page_key);
create index idx_content_blocks_section on public.content_blocks(page_key, section_key);
create index idx_page_layouts_page on public.page_layouts(page_key);
create index idx_donation_campaigns_status on public.donation_campaigns(status);
create index idx_donor_communications_email on public.donor_communications(donor_email);
create index idx_video_access_video on public.video_access(video_id);
create index idx_video_access_token on public.video_access(access_token);
create index idx_event_sessions_event on public.event_sessions(event_id);
create index idx_session_checkins_session on public.session_checkins(session_id);
create index idx_audit_log_user on public.audit_log(user_id);
create index idx_audit_log_resource on public.audit_log(resource_type, resource_id);
create index idx_audit_log_created on public.audit_log(created_at desc);

-- ============================================
-- TRIGGERS
-- ============================================
create trigger update_content_blocks_updated_at before update on public.content_blocks for each row execute function update_updated_at();
create trigger update_donation_campaigns_updated_at before update on public.donation_campaigns for each row execute function update_updated_at();

-- ============================================
-- SEED DEFAULT ROLE PERMISSIONS
-- ============================================
insert into public.role_permissions (role, resource, action, allowed) values
  -- super_admin: full access to everything
  ('super_admin', 'content', 'read', true), ('super_admin', 'content', 'write', true), ('super_admin', 'content', 'delete', true),
  ('super_admin', 'events', 'read', true), ('super_admin', 'events', 'write', true), ('super_admin', 'events', 'delete', true),
  ('super_admin', 'donations', 'read', true), ('super_admin', 'donations', 'write', true), ('super_admin', 'donations', 'export', true),
  ('super_admin', 'media', 'read', true), ('super_admin', 'media', 'write', true), ('super_admin', 'media', 'delete', true),
  ('super_admin', 'staff', 'read', true), ('super_admin', 'staff', 'write', true), ('super_admin', 'staff', 'delete', true),
  ('super_admin', 'settings', 'read', true), ('super_admin', 'settings', 'write', true),
  -- admin: most access
  ('admin', 'content', 'read', true), ('admin', 'content', 'write', true), ('admin', 'content', 'delete', true),
  ('admin', 'events', 'read', true), ('admin', 'events', 'write', true), ('admin', 'events', 'delete', true),
  ('admin', 'donations', 'read', true), ('admin', 'donations', 'write', true), ('admin', 'donations', 'export', true),
  ('admin', 'media', 'read', true), ('admin', 'media', 'write', true), ('admin', 'media', 'delete', true),
  ('admin', 'settings', 'read', true),
  -- editor: content only
  ('editor', 'content', 'read', true), ('editor', 'content', 'write', true),
  ('editor', 'events', 'read', true), ('editor', 'events', 'write', true),
  ('editor', 'media', 'read', true), ('editor', 'media', 'write', true),
  -- viewer: read only
  ('viewer', 'content', 'read', true),
  ('viewer', 'events', 'read', true),
  ('viewer', 'donations', 'read', true),
  ('viewer', 'media', 'read', true);
