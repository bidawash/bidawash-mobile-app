-- 0004_content_tables.sql
-- Moves the app's core content (branches, services, announcements) out
-- of hardcoded mock files and into Supabase tables so support can update
-- pricing, hours, coverage, and announcements without shipping a new
-- build. Adds latitude/longitude on locations to support the "find
-- nearest branch" feature.
--
-- Client fetches these via src/api/{locations,services,announcements}.ts;
-- the mock*.ts files become fallback data (only used when the fetch
-- fails or the table is empty), matching the pattern established for
-- FAQs in 0003.
--
-- Requires 0003_favorites_and_faqs.sql (reuses set_updated_at()).

-- LOCATIONS --------------------------------------------------------

create table if not exists public.locations (
  id           text primary key,
  name         text not null,
  address      text not null,
  maps_query   text not null,
  latitude     double precision,
  longitude    double precision,
  hours        jsonb not null default '[]'::jsonb,
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.locations enable row level security;

create policy "Anyone signed in can read locations"
  on public.locations for select
  to authenticated
  using (true);

create trigger locations_set_updated_at
  before update on public.locations
  for each row execute function public.set_updated_at();

-- SERVICES ---------------------------------------------------------

create table if not exists public.services (
  id                  text primary key,
  name                text not null,
  description         text not null,
  starting_price_php  integer not null,
  duration_minutes    integer not null,
  is_active           boolean not null default true,
  is_featured         boolean not null default false,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Anyone signed in can read services"
  on public.services for select
  to authenticated
  using (true);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- LOCATION_SERVICES (which services offered at which branches) -----

create table if not exists public.location_services (
  location_id  text not null references public.locations(id) on delete cascade,
  service_id   text not null references public.services(id) on delete cascade,
  primary key (location_id, service_id)
);

alter table public.location_services enable row level security;

create policy "Anyone signed in can read location_services"
  on public.location_services for select
  to authenticated
  using (true);

-- ANNOUNCEMENTS ----------------------------------------------------

create table if not exists public.announcements (
  id                  text primary key,
  title               text not null,
  body                text not null,
  published_at        date not null,
  is_pinned           boolean not null default false,
  -- Optional deep-nav target (mirrors mockAnnouncements shape).
  navigate_to_tab     text,
  navigate_to_screen  text,
  navigate_to_params  jsonb,
  is_active           boolean not null default true,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "Anyone signed in can read announcements"
  on public.announcements for select
  to authenticated
  using (true);

create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();
