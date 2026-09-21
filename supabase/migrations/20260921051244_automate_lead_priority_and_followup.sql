alter table public.contact_leads
  add column if not exists lead_score smallint not null default 0,
  add column if not exists auto_priority_reason text;

alter table public.contact_leads
  drop constraint if exists contact_leads_score_check;
alter table public.contact_leads
  add constraint contact_leads_score_check check (lead_score between 0 and 100);

create or replace function public.score_new_contact_lead()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  score integer := 20;
  reasons text[] := array[]::text[];
  location_text text := lower(coalesce(new.location, ''));
  budget_text text := lower(coalesce(new.budget, ''));
begin
  if location_text ~ '(นนทบุรี|กรุงเทพ|ปทุมธานี|สมุทรปราการ|นครปฐม)' then
    score := score + 25;
    reasons := array_append(reasons, 'อยู่ในพื้นที่บริการหลัก');
  elsif location_text <> '' then
    score := score + 5;
  end if;

  if budget_text ~ '(มากกว่า 10|10 ล้าน|10ล้าน)' then
    score := score + 35;
    reasons := array_append(reasons, 'งบมากกว่า 10 ล้านบาท');
  elsif budget_text ~ '(3-10|3–10|3 ล้าน|3ล้าน)' then
    score := score + 30;
    reasons := array_append(reasons, 'งบ 3-10 ล้านบาท');
  elsif budget_text ~ '(1-3|1–3|1 ล้าน|1ล้าน)' then
    score := score + 25;
    reasons := array_append(reasons, 'งบ 1-3 ล้านบาท');
  elsif budget_text ~ '(500,000-1,000,000|500,000–1,000,000)' then
    score := score + 18;
    reasons := array_append(reasons, 'ระบุงบชัดเจน');
  elsif budget_text <> '' then
    score := score + 8;
  end if;

  if nullif(trim(coalesce(new.service, '')), '') is not null and lower(new.service) not like '%อื่น%' then
    score := score + 10;
    reasons := array_append(reasons, 'ระบุประเภทงาน');
  end if;
  if char_length(trim(coalesce(new.message, ''))) >= 20 then
    score := score + 10;
    reasons := array_append(reasons, 'มีรายละเอียดโครงการ');
  end if;
  if nullif(trim(coalesce(new.email, '')), '') is not null then
    score := score + 5;
  end if;

  new.lead_score := least(score, 100);
  new.auto_priority_reason := nullif(array_to_string(reasons, ' • '), '');

  if new.priority is null or new.priority = 'normal' then
    new.priority := case
      when new.lead_score >= 80 then 'urgent'
      when new.lead_score >= 55 then 'high'
      when new.lead_score < 30 then 'low'
      else 'normal'
    end;
  end if;

  if new.next_follow_up_at is null then
    new.next_follow_up_at := now() + case new.priority
      when 'urgent' then interval '15 minutes'
      when 'high' then interval '30 minutes'
      when 'low' then interval '24 hours'
      else interval '2 hours'
    end;
  end if;
  return new;
end;
$$;

revoke all on function public.score_new_contact_lead() from public, anon, authenticated;

drop trigger if exists contact_leads_auto_score on public.contact_leads;
create trigger contact_leads_auto_score
before insert on public.contact_leads
for each row execute function public.score_new_contact_lead();

create index if not exists contact_leads_score_idx
  on public.contact_leads (lead_score desc, created_at desc);

comment on column public.contact_leads.lead_score is 'Automatic 0-100 sales priority score calculated when the lead is created';
comment on column public.contact_leads.auto_priority_reason is 'Short explanation of the automatic lead score';
