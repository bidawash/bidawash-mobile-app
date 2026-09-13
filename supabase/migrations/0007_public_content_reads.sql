-- 0007_public_content_reads.sql
-- Allow unauthenticated ("anon") users to read the public content
-- catalogue so guest-mode users can browse locations, services,
-- FAQs, and announcements without signing up. This satisfies Apple
-- Guideline 5.1.1(v) which requires apps to permit browsing of
-- non-account-based content without registration.
--
-- Personal data (profiles.name/phone/email_verified_at/favorite_*/
-- membership_interest_at) is still gated on auth.uid() = id because
-- those policies live on public.profiles, which this migration does
-- not touch.

drop policy if exists "Anyone signed in can read locations" on public.locations;
create policy "Public read on locations"
  on public.locations for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone signed in can read services" on public.services;
create policy "Public read on services"
  on public.services for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone signed in can read location_services" on public.location_services;
create policy "Public read on location_services"
  on public.location_services for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone signed in can read announcements" on public.announcements;
create policy "Public read on announcements"
  on public.announcements for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone signed in can read FAQs" on public.faqs;
create policy "Public read on FAQs"
  on public.faqs for select
  to anon, authenticated
  using (true);
