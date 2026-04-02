-- Admin Features Migration
-- Adds: program applications, event check-ins, donor notes,
-- staff invitations, video library, and video ad cue points

-- ============================================
-- 1. PROGRAM APPLICATIONS
-- ============================================
create table public.program_applications (
  id uuid primary key default uuid_generate_v4(),
  program_id uuid references public.programs(id) on delete set null,
  program_slug text not null,
  applicant_name text not null,
  applicant_email text not null,
  applicant_phone text,
  applicant_age int,
  guardian_name text,
  guardian_email text,
  guardian_phone text,
  form_data jsonb not null default '{}',
  status text not null default 'submitted' check (status in ('submitted','under_review','accepted','rejected','waitlisted')),
  reviewer_notes text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  lead_id uuid references public.leads(id) on delete set null,
  source text default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- 2. EVENT CHECK-INS
-- ============================================
create table public.event_checkins (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  registration_id uuid not null references public.registrations(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  checked_in_by uuid references public.profiles(id) on delete set null,
  method text default 'manual' check (method in ('manual','qr_scan')),
  notes text,
  unique(event_id, registration_id)
);

-- ============================================
-- 3. DONOR NOTES
-- ============================================
create table public.donor_notes (
  id uuid primary key default uuid_generate_v4(),
  donor_email text not null,
  donation_id uuid references public.donations(id) on delete cascade,
  note_type text not null default 'note' check (note_type in ('note','thank_you_sent','receipt_sent','phone_call','email_sent')),
  content text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================
-- 4. STAFF INVITATIONS
-- ============================================
create table public.staff_invitations (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  role text not null default 'viewer' check (role in ('admin','editor','viewer')),
  invited_by uuid references public.profiles(id) on delete set null,
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  accepted_at timestamptz,
  expires_at timestamptz not null default now() + interval '7 days',
  created_at timestamptz not null default now()
);

-- ============================================
-- 5. VIDEO LIBRARY (Mux VOD content management)
-- ============================================
create table public.video_library (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  category text not null default 'general' check (category in ('past_streams','programs','events','behind_the_scenes','general')),
  mux_asset_id text,
  mux_playback_id text,
  mux_upload_id text,
  duration_seconds numeric,
  thumbnail_url text,
  status text not null default 'processing' check (status in ('waiting','processing','ready','errored','deleted')),
  program_id uuid references public.programs(id) on delete set null,
  featured boolean default false,
  view_count int default 0,
  uploaded_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- 6. VIDEO AD CUE POINTS (per-video ad slot management)
-- ============================================
create table public.video_ad_cue_points (
  id uuid primary key default uuid_generate_v4(),
  video_id uuid not null references public.video_library(id) on delete cascade,
  ad_submission_id uuid not null references public.ad_submissions(id) on delete cascade,
  trigger_at_seconds numeric not null,
  is_active boolean default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================
-- 7. ADD COLUMNS TO EXISTING TABLES
-- ============================================
alter table public.registrations add column if not exists qr_code_token text unique default encode(gen_random_bytes(16), 'hex');
alter table public.registrations add column if not exists checked_in boolean default false;
alter table public.registrations add column if not exists checked_in_at timestamptz;
alter table public.events add column if not exists checked_in_count int not null default 0;
alter table public.donations add column if not exists thank_you_sent boolean not null default false;
alter table public.donations add column if not exists thank_you_sent_at timestamptz;

-- ============================================
-- 8. ROW LEVEL SECURITY
-- ============================================
alter table public.program_applications enable row level security;
alter table public.event_checkins enable row level security;
alter table public.donor_notes enable row level security;
alter table public.staff_invitations enable row level security;
alter table public.video_library enable row level security;
alter table public.video_ad_cue_points enable row level security;

-- RLS Policies
create policy "Public insert applications" on public.program_applications for insert with check (true);
create policy "Admin full applications" on public.program_applications for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','editor')));

create policy "Admin full checkins" on public.event_checkins for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')));

create policy "Admin full donor_notes" on public.donor_notes for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')));

create policy "Admin full staff_invitations" on public.staff_invitations for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')));

create policy "Public read published videos" on public.video_library for select using (status = 'ready' and published_at is not null);
create policy "Admin full videos" on public.video_library for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','editor')));

create policy "Admin full cue_points" on public.video_ad_cue_points for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')));

-- ============================================
-- INDEXES
-- ============================================
create index idx_applications_program on public.program_applications(program_slug);
create index idx_applications_status on public.program_applications(status);
create index idx_applications_email on public.program_applications(applicant_email);
create index idx_checkins_event on public.event_checkins(event_id);
create index idx_checkins_registration on public.event_checkins(registration_id);
create index idx_donor_notes_donor on public.donor_notes(donor_email);
create index idx_video_library_status on public.video_library(status);
create index idx_video_library_category on public.video_library(category);
create index idx_video_cue_points_video on public.video_ad_cue_points(video_id);
create index idx_registrations_qr on public.registrations(qr_code_token);

-- ============================================
-- TRIGGERS (updated_at)
-- ============================================
create trigger update_program_applications_updated_at before update on public.program_applications for each row execute function update_updated_at();
create trigger update_video_library_updated_at before update on public.video_library for each row execute function update_updated_at();

-- ============================================
-- DONOR TIER FUNCTION
-- ============================================
create or replace function get_donor_tier(total numeric) returns text as $$
begin
  if total >= 1000 then return 'platinum';
  elsif total >= 500 then return 'gold';
  elsif total >= 100 then return 'silver';
  else return 'bronze';
  end if;
end;
$$ language plpgsql immutable;
