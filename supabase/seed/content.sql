-- seed/content.sql
-- Populates locations, services, location_services, and announcements
-- with the content that used to live in the client-side mock*.ts files.
-- Re-runnable via UPSERT — safe to paste into the Supabase SQL editor
-- more than once. Rows removed from this file are NOT auto-deleted;
-- delete them by hand or truncate before re-running.
--
-- Requires 0004_content_tables.sql and 0005_locations_coming_soon.sql.

-- LOCATIONS ---------------------------------------------------------

insert into public.locations
  (id, name, address, maps_query, latitude, longitude, hours, sort_order, is_coming_soon)
values
  (
    'gh-mall',
    'GH Mall',
    'O-Square 1 Parking Lot, J22X+M3R, A & E Building, Ortigas Ave, Mandaluyong City',
    'J22X+M3R Mandaluyong City',
    14.601915,
    121.047407,
    $$[
      {"day":"Mon","open":"08:00","close":"19:00"},
      {"day":"Tue","open":"08:00","close":"19:00"},
      {"day":"Wed","open":"08:00","close":"19:00"},
      {"day":"Thu","open":"08:00","close":"19:00"},
      {"day":"Fri","open":"08:00","close":"19:00"},
      {"day":"Sat","open":"08:00","close":"19:00"},
      {"day":"Sun","open":"08:00","close":"19:00"}
    ]$$::jsonb,
    10,
    false
  ),
  (
    'parqal',
    'Parqal',
    'GXHP+53Q Parañaque, Metro Manila',
    'GXHP+53Q Parañaque',
    14.527577,
    120.985872,
    $$[
      {"day":"Mon","open":"08:00","close":"19:00"},
      {"day":"Tue","open":"08:00","close":"19:00"},
      {"day":"Wed","open":"08:00","close":"19:00"},
      {"day":"Thu","open":"08:00","close":"19:00"},
      {"day":"Fri","open":"08:00","close":"19:00"},
      {"day":"Sat","open":"08:00","close":"19:00"},
      {"day":"Sun","open":"08:00","close":"19:00"}
    ]$$::jsonb,
    20,
    true
  )
on conflict (id) do update set
  name           = excluded.name,
  address        = excluded.address,
  maps_query     = excluded.maps_query,
  latitude       = excluded.latitude,
  longitude      = excluded.longitude,
  hours          = excluded.hours,
  sort_order     = excluded.sort_order,
  is_coming_soon = excluded.is_coming_soon;

-- SERVICES ----------------------------------------------------------

insert into public.services
  (id, name, description, starting_price_php, duration_minutes, is_featured, sort_order)
values
  (
    'deluxe-foam',
    'Deluxe Foam Wash',
    E'5-step touchless clean:\n1. Under-chassis wash\n2. Neutral pH pre-soak\n3. Shampoo wash\n4. High-pressure rinse\n5. Drying\n\nGentle on paint, tough on grime.',
    320,
    10,
    true,
    10
  ),
  (
    'premium-wax',
    'Premium Wax Wash',
    'Everything in the Deluxe Foam Wash, plus a water-wax application before drying for extra shine and environmental protection.',
    380,
    10,
    true,
    20
  )
on conflict (id) do update set
  name               = excluded.name,
  description        = excluded.description,
  starting_price_php = excluded.starting_price_php,
  duration_minutes   = excluded.duration_minutes,
  is_featured        = excluded.is_featured,
  sort_order         = excluded.sort_order;

-- LOCATION_SERVICES (many-to-many) ---------------------------------

insert into public.location_services (location_id, service_id) values
  ('gh-mall', 'deluxe-foam'),
  ('gh-mall', 'premium-wax'),
  ('parqal',  'deluxe-foam'),
  ('parqal',  'premium-wax')
on conflict do nothing;

-- ANNOUNCEMENTS -----------------------------------------------------

insert into public.announcements
  (id, title, body, published_at, is_pinned, navigate_to_tab,
   navigate_to_screen, navigate_to_params, sort_order)
values
  (
    'gh-mall-opening',
    'GH Mall branch — soft opening October 1',
    'BidaWash GH Mall opens its doors on October 1. Come by for the official soft opening.',
    '2026-09-08',
    true,
    'LocationsTab',
    'LocationDetail',
    $${"locationId":"gh-mall"}$$::jsonb,
    10
  ),
  (
    'hero-promo',
    'Hero Promo — daily discount',
    'The first 20 cars at any branch each day get a discount on their wash. First come, first served.',
    '2026-06-26',
    false,
    null,
    null,
    null,
    20
  ),
  (
    'premium-loyalty',
    'Ask about BidaWash Premium',
    'Loyalty rewards and branch-exclusive seasonal offers. Tap to learn more.',
    '2026-06-26',
    false,
    'MembershipTab',
    null,
    null,
    30
  )
on conflict (id) do update set
  title              = excluded.title,
  body               = excluded.body,
  published_at       = excluded.published_at,
  is_pinned          = excluded.is_pinned,
  navigate_to_tab    = excluded.navigate_to_tab,
  navigate_to_screen = excluded.navigate_to_screen,
  navigate_to_params = excluded.navigate_to_params,
  sort_order         = excluded.sort_order;
