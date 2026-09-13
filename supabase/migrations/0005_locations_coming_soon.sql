-- 0005_locations_coming_soon.sql
-- Adds an is_coming_soon flag on locations so the app can list a branch
-- that isn't open yet without dropping it from search, the map, or the
-- "find nearest" sort. Coming-soon branches surface a "COMING SOON"
-- pill on LocationsScreen and a red banner on LocationDetailScreen.
-- Defaults to false so existing rows keep their current visibility.

alter table public.locations
  add column if not exists is_coming_soon boolean not null default false;
