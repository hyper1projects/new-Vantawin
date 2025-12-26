-- Schedule the fetch-scores job to run every hour
-- This checks for completed games and updates "matches" table with winners.

select cron.schedule(
    'fetch-scores-hourly',
    '0 9 * * *', -- Run daily at 9 AM UTC
    $$
    select
      net.http_post(
          url:='https://znixyxfchxezwsyewath.supabase.co/functions/v1/fetch-scores',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuaXh5eGZjaHhlendzeWV3YXRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0ODM0MiwiZXhwIjoyMDc4NDI0MzQyfQ.ACxAq4gJaWAFJD6UDitLu3MvFtrZqPtGr11ICUPp4aA"}'::jsonb,
          body:='{}'::jsonb
      ) as request_id;
    $$
);
