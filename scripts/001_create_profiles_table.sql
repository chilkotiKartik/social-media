-- Create profiles table for user information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  gender text check (gender in ('male', 'female', 'other')) not null,
  date_of_birth date not null,
  avatar_url text,
  bio text,
  is_online boolean default false,
  last_seen timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "profiles_select_all"
  on public.profiles for select
  using (true); -- Allow all users to view profiles for calling

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, gender, date_of_birth)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', 'User'),
    coalesce(new.raw_user_meta_data ->> 'gender', 'other'),
    coalesce((new.raw_user_meta_data ->> 'date_of_birth')::date, '2000-01-01'::date)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Create trigger for new user registration
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
