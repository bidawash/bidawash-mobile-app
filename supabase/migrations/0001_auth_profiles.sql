-- 0001_auth_profiles.sql
-- Adds a `profiles` table that mirrors auth.users one-to-one and holds
-- BidaWash-specific customer fields. Wires up RLS so a user can only read
-- and update their own row, plus a trigger that seeds the profile from
-- sign-up metadata.

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null default '',
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are visible to their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by their owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by their owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Keep updated_at fresh on every write.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Seed a profile row whenever a new auth user is created. The name comes
-- from the `name` key inside raw_user_meta_data, which the client sets via
-- supabase.auth.signUp({ options: { data: { name } } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
