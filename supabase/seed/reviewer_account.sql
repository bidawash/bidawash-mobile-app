-- seed/reviewer_account.sql
-- Populates the App Store / Play Store review account so reviewers see
-- a lived-in app: verified email, name set, favorite branch, favorite
-- service, and already on the BidaWash Premium launch waitlist.
--
-- SETUP STEPS (once, before running this SQL):
--
--   1. Supabase dashboard → Authentication → Users → "Add user"
--        → "Create new user"
--   2. Email:    reviewer@bidawash.com
--      Password: <pick a strong one; store in 1Password>
--      ✓ Auto-confirm user (skip email verification link)
--   3. Copy the newly created user's UUID.
--   4. Below, replace <REVIEWER_UUID> with that UUID.
--   5. Paste this SQL into the SQL editor and run.
--
-- The profiles row is auto-created by the on_auth_user_created trigger
-- (migration 0001), so this UPDATE just fills in the interesting fields.

update public.profiles
   set name                   = 'BidaWash Reviewer',
       email_verified_at      = now(),
       favorite_location_id   = 'gh-mall',
       favorite_service_id    = 'deluxe-foam',
       membership_interest_at = now() - interval '2 weeks'
 where id = '<REVIEWER_UUID>'::uuid;

-- Verify the update landed:
select id, name, email_verified_at, favorite_location_id,
       favorite_service_id, membership_interest_at
  from public.profiles
 where id = '<REVIEWER_UUID>'::uuid;
