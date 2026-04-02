-- A New Day Foundation Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'viewer' check (role in ('super_admin', 'admin', 'editor', 'viewer')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- PROGRAMS
-- ============================================
create table public.programs (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  tagline text,
  description text,
  hero_image_url text,
  gallery_urls text[] default '{}',
  video_url text,
  icon text,
  color text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- TEAM MEMBERS
-- ============================================
create table public.team_members (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  title text,
  role_type text not null default 'staff' check (role_type in ('board', 'staff', 'advisor', 'volunteer')),
  bio text,
  headshot_url text,
  linkedin_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- EVENTS
-- ============================================
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  short_description text,
  event_type text not null default 'in_person' check (event_type in ('in_person', 'virtual', 'hybrid')),
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled', 'completed')),
  program_id uuid references public.programs(id) on delete set null,
  start_date timestamptz,
  end_date timestamptz,
  location_name text,
  location_address text,
  location_lat double precision,
  location_lng double precision,
  cover_image_url text,
  gallery_urls text[] default '{}',
  video_url text,
  max_capacity int,
  current_registrations int not null default 0,
  ticket_price decimal(10,2) default 0,
  stripe_price_id text,
  registration_form_id uuid,
  registration_deadline timestamptz,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- REGISTRATION FORM TEMPLATES
-- ============================================
create table public.registration_form_templates (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete set null,
  name text not null,
  description text,
  ai_prompt text,
  form_schema jsonb not null default '{"fields": []}',
  is_template boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add FK from events to registration_form_templates
alter table public.events
  add constraint events_registration_form_fk
  foreign key (registration_form_id)
  references public.registration_form_templates(id) on delete set null;

-- ============================================
-- REGISTRATIONS
-- ============================================
create table public.registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  form_template_id uuid references public.registration_form_templates(id) on delete set null,
  form_data jsonb not null default '{}',
  registrant_name text not null,
  registrant_email text not null,
  registrant_phone text,
  payment_status text not null default 'none' check (payment_status in ('none', 'pending', 'paid', 'refunded')),
  stripe_payment_intent_id text,
  amount_paid decimal(10,2) default 0,
  status text not null default 'confirmed' check (status in ('confirmed', 'waitlisted', 'cancelled')),
  lead_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- DONATIONS
-- ============================================
create table public.donations (
  id uuid primary key default uuid_generate_v4(),
  donor_name text,
  donor_email text,
  amount decimal(10,2) not null,
  currency text not null default 'usd',
  donation_type text not null default 'one_time' check (donation_type in ('one_time', 'recurring')),
  frequency text check (frequency in ('monthly', 'quarterly', 'yearly')),
  stripe_payment_intent_id text unique,
  stripe_subscription_id text,
  stripe_customer_id text,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed', 'refunded', 'cancelled')),
  is_anonymous boolean not null default false,
  message text,
  program_id uuid references public.programs(id) on delete set null,
  lead_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- LEADS (CRM)
-- ============================================
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  phone text,
  source text not null default 'website' check (source in ('website', 'event', 'donation', 'referral', 'social', 'other')),
  status text not null default 'new' check (status in ('new', 'contacted', 'engaged', 'donor', 'volunteer', 'inactive')),
  interest_areas text[] default '{}',
  notes text,
  total_donated decimal(10,2) not null default 0,
  last_interaction_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add FK from registrations and donations to leads
alter table public.registrations add constraint registrations_lead_fk foreign key (lead_id) references public.leads(id) on delete set null;
alter table public.donations add constraint donations_lead_fk foreign key (lead_id) references public.leads(id) on delete set null;

-- ============================================
-- LEAD INTERACTIONS
-- ============================================
create table public.lead_interactions (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  interaction_type text not null check (interaction_type in ('page_view', 'form_submission', 'donation', 'event_registration', 'cta_click', 'contact_form', 'live_stream_view', 'note')),
  description text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- ============================================
-- TESTIMONIALS
-- ============================================
create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  author_name text not null,
  author_title text,
  author_image_url text,
  quote text not null,
  program_id uuid references public.programs(id) on delete set null,
  is_featured boolean not null default false,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- LIVE STREAMS
-- ============================================
create table public.live_streams (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  mux_stream_id text,
  mux_stream_key text,
  mux_playback_id text,
  status text not null default 'idle' check (status in ('idle', 'active', 'disabled')),
  event_id uuid references public.events(id) on delete set null,
  started_at timestamptz,
  ended_at timestamptz,
  recording_asset_id text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- MEDIA ASSETS
-- ============================================
create table public.media_assets (
  id uuid primary key default uuid_generate_v4(),
  file_name text not null,
  storage_path text not null,
  public_url text,
  mime_type text,
  file_size bigint,
  alt_text text,
  category text default 'general' check (category in ('team', 'event', 'program', 'gallery', 'general')),
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================
-- SITE SETTINGS
-- ============================================
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_events_start_date on public.events(start_date);
create index idx_events_status on public.events(status);
create index idx_events_program on public.events(program_id);
create index idx_registrations_event on public.registrations(event_id);
create index idx_registrations_email on public.registrations(registrant_email);
create index idx_donations_email on public.donations(donor_email);
create index idx_donations_status on public.donations(status);
create index idx_donations_created on public.donations(created_at);
create index idx_leads_email on public.leads(email);
create index idx_leads_status on public.leads(status);
create index idx_lead_interactions_lead on public.lead_interactions(lead_id);
create index idx_lead_interactions_created on public.lead_interactions(created_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.team_members enable row level security;
alter table public.events enable row level security;
alter table public.registration_form_templates enable row level security;
alter table public.registrations enable row level security;
alter table public.donations enable row level security;
alter table public.leads enable row level security;
alter table public.lead_interactions enable row level security;
alter table public.testimonials enable row level security;
alter table public.live_streams enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;

-- Public read for published content
create policy "Public read programs" on public.programs for select using (is_active = true);
create policy "Public read team" on public.team_members for select using (is_active = true);
create policy "Public read events" on public.events for select using (status = 'published');
create policy "Public read testimonials" on public.testimonials for select using (is_active = true);
create policy "Public read live streams" on public.live_streams for select using (true);
create policy "Public read form templates" on public.registration_form_templates for select using (true);

-- Authenticated admin full access
create policy "Admin full programs" on public.programs for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin', 'editor'))
);
create policy "Admin full team" on public.team_members for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin', 'editor'))
);
create policy "Admin full events" on public.events for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin', 'editor'))
);
create policy "Admin full testimonials" on public.testimonials for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin', 'editor'))
);
create policy "Admin full registrations" on public.registrations for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
);
create policy "Admin full donations" on public.donations for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
);
create policy "Admin full leads" on public.leads for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
);
create policy "Admin full interactions" on public.lead_interactions for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
);
create policy "Admin full form templates" on public.registration_form_templates for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin', 'editor'))
);
create policy "Admin full streams" on public.live_streams for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
);
create policy "Admin full media" on public.media_assets for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin', 'editor'))
);
create policy "Admin full settings" on public.site_settings for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
);
create policy "Admin read profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin'))
);
create policy "Users read own profile" on public.profiles for select using (id = auth.uid());
create policy "Users update own profile" on public.profiles for update using (id = auth.uid());

-- Allow public inserts for registrations (from public forms)
create policy "Public insert registrations" on public.registrations for insert with check (true);

-- Allow public inserts for donations (from webhook)
create policy "Public insert donations" on public.donations for insert with check (true);

-- Allow public inserts and upserts for leads
create policy "Public insert leads" on public.leads for insert with check (true);
create policy "Public insert interactions" on public.lead_interactions for insert with check (true);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at();
create trigger update_programs_updated_at before update on public.programs for each row execute function public.update_updated_at();
create trigger update_team_members_updated_at before update on public.team_members for each row execute function public.update_updated_at();
create trigger update_events_updated_at before update on public.events for each row execute function public.update_updated_at();
create trigger update_registrations_updated_at before update on public.registrations for each row execute function public.update_updated_at();
create trigger update_donations_updated_at before update on public.donations for each row execute function public.update_updated_at();
create trigger update_leads_updated_at before update on public.leads for each row execute function public.update_updated_at();
create trigger update_testimonials_updated_at before update on public.testimonials for each row execute function public.update_updated_at();
create trigger update_live_streams_updated_at before update on public.live_streams for each row execute function public.update_updated_at();
create trigger update_form_templates_updated_at before update on public.registration_form_templates for each row execute function public.update_updated_at();
