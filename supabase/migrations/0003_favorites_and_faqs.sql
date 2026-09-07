-- 0003_favorites_and_faqs.sql
-- Per-user favorites: adds nullable columns for the customer's preferred
-- branch and preferred service. Nothing is required at sign-up; both
-- default to null and are set by the heart toggles in the app.
--
-- Also introduces the FAQs table so support can maintain the list from
-- the Supabase SQL editor without a new app release. The client falls
-- back to a bundled mockFaqs list when the table is empty or unreachable.

alter table public.profiles
  add column if not exists favorite_location_id text,
  add column if not exists favorite_service_id  text;

create table if not exists public.faqs (
  id           text primary key,
  question     text not null,
  answer       text not null,
  category     text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.faqs enable row level security;

create policy "Anyone signed in can read FAQs"
  on public.faqs for select
  to authenticated
  using (true);

-- Reuse the updated_at trigger function created in 0001.
create trigger faqs_set_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();
