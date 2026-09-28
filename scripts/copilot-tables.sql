-- Creating Supabase tables for copilot system
-- copilot event log
create table if not exists public.copilot_events (
  id uuid primary key,
  type text not null,
  ts bigint not null,
  session_id text not null,
  user_id uuid,
  context jsonb,
  data jsonb
);

-- mentor notifications
create table if not exists public.mentor_notifications (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null,
  entry_id uuid,
  from_user_id uuid,
  kind text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table public.copilot_events enable row level security;
create policy "owner can read their events"
  on public.copilot_events for select
  using (auth.uid() = user_id or user_id is null);

create policy "anyone can insert events"
  on public.copilot_events for insert
  with check (true);

alter table public.mentor_notifications enable row level security;
create policy "mentor can read own notifications"
  on public.mentor_notifications for select
  using (auth.uid() = mentor_id);

create policy "insert notifications (server role)"
  on public.mentor_notifications for insert
  with check (true);
