import React, { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import LeaderboardTable from '../components/LeaderboardTable';
import LeaderboardPodium from '../components/LeaderboardPodium';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboardEntries, setLeaderboardEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // 1. Get active pool ID
        const { data: poolId, error: poolError } = await supabase.rpc('get_active_pool_id', { p_tier: 'free' }); // Default to free or pass tier? Assuming global for now

        // Note: Leaderboard View should be queried by pool_id.
        // If poolId is null, maybe show last week? Or empty?
        // Let's query the latest pool if current is null?

        let targetPoolId = poolId;
        if (!targetPoolId) {
          // Fallback: Get most recent pool
          const { data: recentPool } = await supabase.from('pools').select('id').order('start_time', { ascending: false }).limit(1).single();
          targetPoolId = recentPool?.id;
        }

        if (targetPoolId) {
          const { data: entries, error } = await supabase
            .from('leaderboard_view')
            .select('*')
            .eq('pool_id', targetPoolId)
            .order('rank', { ascending: true });

          if (error) throw error;

          // Map to component format
          const mappedEntries = entries.map((e: any) => ({
            rank: e.rank,
            playerName: e.username,
            xp: e.total_xp,
            winRate: e.win_rate,
            prizeNaira: 0, // Prize is calc at end? Or we can estimate? For now 0.
            isCurrentUser: false // We can check `auth.uid()` vs `e.user_id` if view had user_id
          }));
          setLeaderboardEntries(mappedEntries);
        }

      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('leaderboard_updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'tournament_entries'
        },
        (payload) => {
          console.log('Leaderboard update received!', payload);
          // Simple strategy: Just refetch the sorted view to get correct ranks
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const top3Players = leaderboardEntries.filter(entry => entry.rank <= 3);
  const remainingPlayers = leaderboardEntries.filter(entry => entry.rank > 3);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-vanta-dark">
        <Loader2 className="w-10 h-10 text-vanta-neon-blue animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <SectionHeader title="Global Leaderboard" className="mb-6" textColor="text-vanta-text-light" />
      {leaderboardEntries.length > 0 ? (
        <>
          <LeaderboardPodium topPlayers={top3Players} className="mb-8" />
          <LeaderboardTable entries={remainingPlayers} />
        </>
      ) : (
        <div className="text-center text-gray-400 mt-10">
          <p>No rankings yet for this week. Be the first to bet!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;