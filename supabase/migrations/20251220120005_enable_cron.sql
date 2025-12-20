-- Enable Extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Schedule the job to run every hour (Minute 0)
-- NOTE: We use pg_net to call the Edge Function. 
-- You must replace 'YOUR_PROJECT_REF' with your actual Supabase Project Reference (found in URL).
-- You must also provide the ANON_KEY or SERVICE_ROLE_KEY if the function requires Auth.
-- Assuming fetch-odds is public or protected. Currently it checks API_KEY from Env, implying it might be public?
-- If it's protected by standard Supabase JWT, we need the Authorization header.

/*
  EXAMPLE USAGE (Run this in SQL Editor after replacing values):

  select cron.schedule(
    'fetch-odds-hourly',
    '0 * * * *', -- Every Hour
    $$
    select
      net.http_post(
          url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/fetch-odds',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
          body:='{}'::jsonb
      ) as request_id;
    $$
  );
*/

-- For this migration file, we will just Enable the Extension.
-- The actual scheduling usually relies on secrets (Key/URL) which we shouldn't hardcode in a migration file.
-- I will provide the SQL snippet to the user to run manually.
