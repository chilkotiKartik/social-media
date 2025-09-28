-- Create calls table to track call history
create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  caller_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  call_type text check (call_type in ('audio', 'video')) not null default 'audio',
  status text check (status in ('pending', 'accepted', 'declined', 'ended', 'missed')) not null default 'pending',
  started_at timestamp with time zone default now(),
  ended_at timestamp with time zone,
  duration_seconds integer default 0,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.calls enable row level security;

-- RLS policies for calls
create policy "calls_select_own"
  on public.calls for select
  using (auth.uid() = caller_id or auth.uid() = receiver_id);

create policy "calls_insert_as_caller"
  on public.calls for insert
  with check (auth.uid() = caller_id);

create policy "calls_update_participants"
  on public.calls for update
  using (auth.uid() = caller_id or auth.uid() = receiver_id);

-- Create index for better performance
create index if not exists calls_caller_id_idx on public.calls(caller_id);
create index if not exists calls_receiver_id_idx on public.calls(receiver_id);
create index if not exists calls_status_idx on public.calls(status);
