-- Create user preferences table
create table if not exists public.user_preferences (
  id uuid primary key references public.profiles(id) on delete cascade,
  preferred_call_type text check (preferred_call_type in ('audio', 'video', 'both')) default 'both',
  show_gender_filter boolean default true,
  show_online_status boolean default true,
  allow_calls_from text check (allow_calls_from in ('everyone', 'same_gender', 'none')) default 'everyone',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_preferences enable row level security;

-- RLS policies for user preferences
create policy "preferences_select_own"
  on public.user_preferences for select
  using (auth.uid() = id);

create policy "preferences_insert_own"
  on public.user_preferences for insert
  with check (auth.uid() = id);

create policy "preferences_update_own"
  on public.user_preferences for update
  using (auth.uid() = id);

-- Create function to create default preferences for new users
create or replace function public.create_default_preferences()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_preferences (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Create trigger for default preferences
drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row
  execute function public.create_default_preferences();
