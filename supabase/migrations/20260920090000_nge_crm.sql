create extension if not exists pgcrypto;

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  service text,
  location text,
  budget text,
  message text,
  privacy_consent boolean not null default false,
  marketing_consent boolean not null default false,
  consent_version text,
  status text not null default 'new',
  internal_note text,
  next_follow_up_at timestamptz,
  last_contacted_at timestamptz,
  first_response_at timestamptz,
  closed_at timestamptz,
  assigned_to uuid references auth.users(id) on delete set null,
  priority text not null default 'normal',
  lost_reason text,
  page_path text,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  constraint contact_leads_status_check check (status in ('new','contacted','qualified','won','lost','spam')),
  constraint contact_leads_priority_check check (priority in ('low','normal','high','urgent'))
);

alter table public.contact_leads add column if not exists updated_at timestamptz not null default now();
alter table public.contact_leads add column if not exists privacy_consent boolean not null default false;
alter table public.contact_leads add column if not exists marketing_consent boolean not null default false;
alter table public.contact_leads add column if not exists consent_version text;
alter table public.contact_leads add column if not exists status text not null default 'new';
alter table public.contact_leads add column if not exists internal_note text;
alter table public.contact_leads add column if not exists next_follow_up_at timestamptz;
alter table public.contact_leads add column if not exists last_contacted_at timestamptz;
alter table public.contact_leads add column if not exists first_response_at timestamptz;
alter table public.contact_leads add column if not exists closed_at timestamptz;
alter table public.contact_leads add column if not exists assigned_to uuid references auth.users(id) on delete set null;
alter table public.contact_leads add column if not exists priority text not null default 'normal';
alter table public.contact_leads add column if not exists lost_reason text;
alter table public.contact_leads add column if not exists page_path text;
alter table public.contact_leads add column if not exists referrer_host text;
alter table public.contact_leads add column if not exists utm_source text;
alter table public.contact_leads add column if not exists utm_medium text;
alter table public.contact_leads add column if not exists utm_campaign text;
alter table public.contact_leads add column if not exists utm_content text;
alter table public.contact_leads add column if not exists utm_term text;

create table if not exists public.crm_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text,
  team text not null default 'Marketing',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_activities (
  id bigint generated always as identity primary key,
  lead_id uuid not null references public.contact_leads(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  summary text,
  created_at timestamptz not null default now()
);

create or replace function public.is_crm_user()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') in ('crm_admin','crm_staff'), false)
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contact_leads_set_updated_at on public.contact_leads;
create trigger contact_leads_set_updated_at before update on public.contact_leads
for each row execute function public.set_updated_at();

drop trigger if exists crm_profiles_set_updated_at on public.crm_profiles;
create trigger crm_profiles_set_updated_at before update on public.crm_profiles
for each row execute function public.set_updated_at();

create or replace function public.log_lead_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  activity_action text := 'lead_updated';
  activity_summary text := 'อัปเดตข้อมูลลูกค้า';
begin
  if old.status is distinct from new.status then
    activity_action := 'status_changed';
    activity_summary := 'เปลี่ยนสถานะจาก ' || coalesce(old.status, '—') || ' เป็น ' || coalesce(new.status, '—');
  elsif old.assigned_to is distinct from new.assigned_to then
    activity_action := 'owner_changed';
    activity_summary := 'เปลี่ยนผู้รับผิดชอบ';
  elsif old.next_follow_up_at is distinct from new.next_follow_up_at then
    activity_action := 'follow_up_changed';
    activity_summary := 'เปลี่ยนกำหนดติดตาม';
  elsif old.last_contacted_at is distinct from new.last_contacted_at then
    activity_action := 'contact_recorded';
    activity_summary := 'บันทึกการติดต่อลูกค้า';
  end if;
  insert into public.lead_activities (lead_id, actor_id, action, summary)
  values (new.id, auth.uid(), activity_action, activity_summary);
  return new;
end;
$$;

drop trigger if exists contact_leads_log_activity on public.contact_leads;
create trigger contact_leads_log_activity after update on public.contact_leads
for each row execute function public.log_lead_activity();

create or replace function public.get_crm_filter_options()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'services', coalesce((select jsonb_agg(service order by service) from (select distinct service from public.contact_leads where nullif(service, '') is not null) s), '[]'::jsonb),
    'sources', coalesce((select jsonb_agg(jsonb_build_object('value', value, 'label', label) order by label) from (
      select distinct 'utm:' || utm_source as value, utm_source as label from public.contact_leads where nullif(utm_source, '') is not null
      union
      select distinct 'ref:' || referrer_host, referrer_host from public.contact_leads where nullif(referrer_host, '') is not null
    ) x), '[]'::jsonb)
  )
$$;

create or replace function public.get_crm_dashboard_metrics()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'new', count(*) filter (where status = 'new'),
    'active', count(*) filter (where status in ('new','contacted','qualified')),
    'due_today', count(*) filter (where next_follow_up_at >= date_trunc('day', now()) and next_follow_up_at < date_trunc('day', now()) + interval '1 day' and status in ('new','contacted','qualified')),
    'overdue', count(*) filter (where next_follow_up_at < date_trunc('day', now()) and status in ('new','contacted','qualified')),
    'unassigned', count(*) filter (where assigned_to is null and status in ('new','contacted','qualified')),
    'urgent', count(*) filter (where priority = 'urgent' and status in ('new','contacted','qualified')),
    'first_response_overdue', count(*) filter (where first_response_at is null and status = 'new' and created_at < now() - interval '2 hours'),
    'won', count(*) filter (where status = 'won'),
    'pipeline', jsonb_build_object(
      'new', count(*) filter (where status = 'new'),
      'contacted', count(*) filter (where status = 'contacted'),
      'qualified', count(*) filter (where status = 'qualified'),
      'won', count(*) filter (where status = 'won'),
      'lost', count(*) filter (where status = 'lost')
    )
  ) from public.contact_leads
$$;

alter table public.contact_leads enable row level security;
alter table public.crm_profiles enable row level security;
alter table public.lead_activities enable row level security;

drop policy if exists "public may submit leads" on public.contact_leads;
create policy "public may submit leads" on public.contact_leads for insert to anon
with check (true);
drop policy if exists "crm may read leads" on public.contact_leads;
create policy "crm may read leads" on public.contact_leads for select to authenticated
using (public.is_crm_user());
drop policy if exists "crm may update leads" on public.contact_leads;
create policy "crm may update leads" on public.contact_leads for update to authenticated
using (public.is_crm_user()) with check (public.is_crm_user());
drop policy if exists "crm may read profiles" on public.crm_profiles;
create policy "crm may read profiles" on public.crm_profiles for select to authenticated
using (public.is_crm_user());
drop policy if exists "crm may read activities" on public.lead_activities;
create policy "crm may read activities" on public.lead_activities for select to authenticated
using (public.is_crm_user());

revoke all on public.contact_leads from anon, authenticated;
revoke all on public.crm_profiles from anon, authenticated;
revoke all on public.lead_activities from anon, authenticated;
grant insert on public.contact_leads to anon;
grant select, update on public.contact_leads to authenticated;
grant select on public.crm_profiles, public.lead_activities to authenticated;
grant usage, select on sequence public.lead_activities_id_seq to authenticated;
grant execute on function public.is_crm_user() to authenticated;
grant execute on function public.get_crm_filter_options() to authenticated;
grant execute on function public.get_crm_dashboard_metrics() to authenticated;

create index if not exists contact_leads_created_at_idx on public.contact_leads (created_at desc);
create index if not exists contact_leads_status_idx on public.contact_leads (status);
create index if not exists contact_leads_follow_up_idx on public.contact_leads (next_follow_up_at) where next_follow_up_at is not null;
create index if not exists contact_leads_assigned_to_idx on public.contact_leads (assigned_to);
create index if not exists lead_activities_lead_id_idx on public.lead_activities (lead_id, created_at desc);

do $$
begin
  alter publication supabase_realtime add table public.contact_leads;
exception
  when duplicate_object then null;
end $$;
