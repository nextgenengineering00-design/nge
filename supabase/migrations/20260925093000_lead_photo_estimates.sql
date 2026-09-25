alter table public.contact_leads add column if not exists photo_paths jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lead-photos','lead-photos',false,8388608,array['image/jpeg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

alter table storage.objects enable row level security;
drop policy if exists "crm may read lead photos" on storage.objects;
create policy "crm may read lead photos" on storage.objects for select to authenticated
using (bucket_id='lead-photos' and public.is_crm_user());
