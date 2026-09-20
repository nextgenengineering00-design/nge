create extension if not exists pgcrypto;

create table if not exists public.marketing_content (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('Facebook','Google Business Profile','บทความเว็บไซต์','LINE OA')),
  goal text not null,
  topic text not null,
  location text,
  proof text,
  draft jsonb not null,
  status text not null default 'draft' check (status in ('draft','approved','published','rejected')),
  ai_mode text not null default 'live',
  approved_at timestamptz,
  published_at timestamptz,
  external_post_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.marketing_audit_log (
  id bigint generated always as identity primary key,
  content_id uuid references public.marketing_content(id) on delete cascade,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.marketing_content enable row level security;
alter table public.marketing_audit_log enable row level security;

revoke all on public.marketing_content from anon, authenticated;
revoke all on public.marketing_audit_log from anon, authenticated;

-- Route handlers use SUPABASE_SECRET_KEY. Never expose it to the browser.
-- contact_leads stays the lead destination and keeps the existing RLS design.
