-- Programs Elevation Migration
-- Add missing columns to programs table to match frontend detail pages

-- Long description (multi-paragraph about section)
alter table public.programs add column if not exists long_description text;

-- Logo image URL
alter table public.programs add column if not exists logo_url text;

-- Features array (e.g., ["Professional instruction", "Ensemble workshops", ...])
alter table public.programs add column if not exists features jsonb default '[]';

-- Outcomes/stats array (e.g., [{"stat": "500+", "label": "Students Trained"}, ...])
alter table public.programs add column if not exists outcomes jsonb default '[]';

-- Video title for the featured video
alter table public.programs add column if not exists video_title text;

-- Mux playback ID for the program's featured video
alter table public.programs add column if not exists mux_playback_id text;

-- Mux integration for media_assets (for videos uploaded through media library)
alter table public.media_assets add column if not exists mux_upload_id text;
alter table public.media_assets add column if not exists mux_asset_id text;
alter table public.media_assets add column if not exists mux_playback_id text;
alter table public.media_assets add column if not exists mux_status text;
