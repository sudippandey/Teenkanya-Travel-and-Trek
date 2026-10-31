-- Backend platform: catalogue association, special requirements, content duplicate
-- detection, notification attempt tracking, staff authorization and audit history.
-- Additive only: no columns, rows or tables are dropped or rewritten.

-- 1. Staff members (authorization source for the admin API)
create table if not exists public.staff_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'agent')),
  display_name text check (display_name is null or char_length(btrim(display_name)) between 1 and 120),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.staff_members enable row level security;
revoke all on table public.staff_members from anon, authenticated;
grant all on table public.staff_members to service_role;

-- 2. Enquiry extensions
alter table public.enquiries
  add column if not exists catalogue_item_type text
    check (catalogue_item_type is null or catalogue_item_type in ('destination', 'package', 'trek')),
  add column if not exists catalogue_item_slug text
    check (catalogue_item_slug is null or (char_length(catalogue_item_slug) <= 120 and catalogue_item_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')),
  add column if not exists special_requirements text
    check (special_requirements is null or char_length(special_requirements) <= 1000),
  add column if not exists content_fingerprint text
    check (content_fingerprint is null or content_fingerprint ~ '^[a-f0-9]{64}$'),
  add column if not exists notification_attempts integer not null default 0
    check (notification_attempts >= 0),
  add column if not exists last_notification_attempt_at timestamptz,
  add column if not exists acknowledgement_status text not null default 'not_configured'
    check (acknowledgement_status in ('not_configured', 'pending', 'sent', 'failed')),
  add column if not exists status_changed_at timestamptz,
  add column if not exists assigned_staff_id uuid references public.staff_members (user_id) on delete set null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'enquiries_catalogue_item_pair'
  ) then
    alter table public.enquiries
      add constraint enquiries_catalogue_item_pair
      check ((catalogue_item_type is null) = (catalogue_item_slug is null));
  end if;
end;
$$;

create index if not exists enquiries_content_fingerprint_idx
  on public.enquiries (content_fingerprint, created_at desc)
  where content_fingerprint is not null;
create index if not exists enquiries_notification_status_idx
  on public.enquiries (notification_status, updated_at)
  where notification_status in ('pending', 'failed', 'not_configured');
create index if not exists enquiries_email_idx on public.enquiries (email) where email is not null;

-- 3. Audit history
create table if not exists public.enquiry_events (
  id bigint generated always as identity primary key,
  enquiry_id uuid not null references public.enquiries (id) on delete cascade,
  event_type text not null check (event_type in (
    'created',
    'duplicate_suppressed',
    'notification_claimed',
    'notification_sent',
    'notification_failed',
    'notification_reset',
    'notification_retry_requested',
    'status_changed',
    'note_added'
  )),
  actor_type text not null check (actor_type in ('system', 'customer', 'staff')),
  actor_id uuid references public.staff_members (user_id) on delete set null,
  from_status text,
  to_status text,
  note text check (note is null or char_length(note) between 1 and 2000),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists enquiry_events_enquiry_created_idx
  on public.enquiry_events (enquiry_id, created_at);
alter table public.enquiry_events enable row level security;
revoke all on table public.enquiry_events from anon, authenticated;
grant all on table public.enquiry_events to service_role;

-- 4. Notification attempt counting (before insert/update)
create or replace function public.enquiries_track_notification_attempts()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if tg_op = 'INSERT' then
    if new.notification_status = 'pending' then
      new.notification_attempts := 1;
      new.last_notification_attempt_at := now();
    end if;
    return new;
  end if;

  if new.notification_status = 'pending' and old.notification_status is distinct from 'pending' then
    new.notification_attempts := old.notification_attempts + 1;
    new.last_notification_attempt_at := now();
  end if;
  return new;
end;
$function$;

drop trigger if exists enquiries_track_notification_attempts on public.enquiries;
create trigger enquiries_track_notification_attempts
  before insert or update of notification_status on public.enquiries
  for each row execute function public.enquiries_track_notification_attempts();

-- 5. Automatic audit events for creation and notification state changes
create or replace function public.enquiries_record_events()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if tg_op = 'INSERT' then
    insert into public.enquiry_events (enquiry_id, event_type, actor_type, to_status, metadata)
    values (new.id, 'created', 'customer', new.status,
      jsonb_build_object('notification_status', new.notification_status));
  elsif new.notification_status is distinct from old.notification_status then
    insert into public.enquiry_events (enquiry_id, event_type, actor_type, metadata)
    values (
      new.id,
      case new.notification_status
        when 'pending' then 'notification_claimed'
        when 'sent' then 'notification_sent'
        when 'failed' then 'notification_failed'
        else 'notification_reset'
      end,
      'system',
      jsonb_build_object(
        'from', old.notification_status,
        'to', new.notification_status,
        'attempts', new.notification_attempts
      )
    );
  end if;
  return null;
end;
$function$;

drop trigger if exists enquiries_record_events on public.enquiries;
create trigger enquiries_record_events
  after insert or update of notification_status on public.enquiries
  for each row execute function public.enquiries_record_events();

-- 6. Atomic staff operations (status change + audit, note + audit)
create or replace function public.change_enquiry_status(
  p_reference text,
  p_from_status text,
  p_to_status text,
  p_actor_id uuid,
  p_note text
)
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_id uuid;
begin
  update public.enquiries
  set status = p_to_status, status_changed_at = now(), updated_at = now()
  where reference = p_reference and status = p_from_status
  returning id into v_id;

  if v_id is null then
    if exists (select 1 from public.enquiries where reference = p_reference) then
      return 'conflict';
    end if;
    return 'not_found';
  end if;

  insert into public.enquiry_events (enquiry_id, event_type, actor_type, actor_id, from_status, to_status, note)
  values (v_id, 'status_changed', 'staff', p_actor_id, p_from_status, p_to_status, nullif(btrim(p_note), ''));

  return 'updated';
end;
$function$;

create or replace function public.add_enquiry_note(
  p_reference text,
  p_actor_id uuid,
  p_note text
)
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_id uuid;
begin
  select id into v_id from public.enquiries where reference = p_reference;
  if v_id is null then
    return 'not_found';
  end if;

  insert into public.enquiry_events (enquiry_id, event_type, actor_type, actor_id, note)
  values (v_id, 'note_added', 'staff', p_actor_id, btrim(p_note));

  return 'added';
end;
$function$;

revoke all on function public.change_enquiry_status(text, text, text, uuid, text) from public, anon, authenticated;
grant execute on function public.change_enquiry_status(text, text, text, uuid, text) to service_role;
revoke all on function public.add_enquiry_note(text, uuid, text) from public, anon, authenticated;
grant execute on function public.add_enquiry_note(text, uuid, text) to service_role;
