create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  reference text not null unique,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  email text check (email is null or (char_length(email) <= 254 and email = lower(email))),
  phone text check (phone is null or char_length(btrim(phone)) between 7 and 30),
  country_of_residence text check (country_of_residence is null or char_length(country_of_residence) <= 100),
  preferred_contact_channel text not null check (preferred_contact_channel in ('email', 'phone', 'whatsapp')),
  interest text not null check (interest in ('tour', 'trekking', 'travel_service', 'other')),
  message text not null check (char_length(btrim(message)) between 10 and 4000),
  travel_start_date date,
  dates_flexible boolean not null default false,
  traveller_count smallint check (traveller_count is null or traveller_count between 1 and 50),
  source_page text check (source_page is null or (source_page like '/%' and char_length(source_page) <= 512)),
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'confirmed', 'closed', 'spam')),
  notification_status text not null default 'not_configured' check (notification_status in ('not_configured', 'pending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enquiries_need_contact check (email is not null or phone is not null),
  constraint enquiries_preferred_contact_present check (
    (preferred_contact_channel = 'email' and email is not null)
    or (preferred_contact_channel in ('phone', 'whatsapp') and phone is not null)
  )
);

create index enquiries_created_at_idx on public.enquiries (created_at desc);
create index enquiries_status_created_at_idx on public.enquiries (status, created_at desc);
alter table public.enquiries enable row level security;
revoke all on table public.enquiries from anon, authenticated;
grant all on table public.enquiries to service_role;

create table public.enquiry_rate_limits (
  key_hash text primary key check (key_hash ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0),
  updated_at timestamptz not null default now()
);
create index enquiry_rate_limits_updated_at_idx on public.enquiry_rate_limits (updated_at);
alter table public.enquiry_rate_limits enable row level security;
revoke all on table public.enquiry_rate_limits from anon, authenticated;
grant all on table public.enquiry_rate_limits to service_role;

create or replace function public.consume_enquiry_rate_limit(
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_request_count integer;
begin
  if p_key_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid rate limit key';
  end if;

  if p_limit < 1 or p_limit > 20 or p_window_seconds < 60 or p_window_seconds > 3600 then
    raise exception 'Invalid rate limit configuration';
  end if;

  if random() < 0.02 then
    delete from public.enquiry_rate_limits
    where updated_at < now() - interval '1 day';
  end if;

  insert into public.enquiry_rate_limits as existing (
    key_hash,
    window_started_at,
    request_count
  ) values (
    p_key_hash,
    now(),
    1
  )
  on conflict (key_hash) do update
  set
    window_started_at = case
      when existing.window_started_at <= now() - make_interval(secs => p_window_seconds) then now()
      else existing.window_started_at
    end,
    request_count = case
      when existing.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1
      else existing.request_count + 1
    end,
    updated_at = now()
  returning request_count into v_request_count;

  return v_request_count <= p_limit;
end;
$function$;

revoke all on function public.consume_enquiry_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_enquiry_rate_limit(text, integer, integer) to service_role;
