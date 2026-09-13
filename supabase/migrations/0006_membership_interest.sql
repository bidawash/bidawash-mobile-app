-- 0006_membership_interest.sql
-- Adds a per-user opt-in timestamp for the BidaWash Premium launch
-- waitlist. When a signed-in customer taps "Notify me when memberships
-- launch" on the Membership tab, we store the timestamp; tapping
-- "Leave the list" clears it back to null.
--
-- Query the launch mailing list with:
--   select p.id, u.email, p.membership_interest_at
--     from public.profiles p
--     join auth.users u on u.id = p.id
--    where p.membership_interest_at is not null
--    order by p.membership_interest_at;
--
-- Requires 0001_auth_profiles.sql (uses public.profiles).

alter table public.profiles
  add column if not exists membership_interest_at timestamptz;
