-- Inspect Active Policies
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('tournament_entries', 'users', 'bets');
