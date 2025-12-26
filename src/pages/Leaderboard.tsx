"use client";

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
        setIsLoading(true);
        // 0. Get current user for highlighting
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Get active pool ID (Try to get ANY active pool first by passing null)
        // If you specifically want a tier, pass it, otherwise null finds the soonest active one.
        const { data: poolId, error: poolError } = await supabase.rpc('get_active_pool_id', { p_tier: null });

        if (poolError) {
          console.error("Error fetching active pool:", poolError);
        }

        let targetPoolId = poolId;

        // 2. Fallback: If no active pool, get the most recent pool (ended or upcoming)
        if (!targetPoolId) {
          const { data: recentPool } = await supabase
            .from('pools')
            .select('id')
            .order('start_time', { ascending: false })
            .limit(1)
            .single();
          targetPoolId = recentPool?.id;
        }

        if (targetPoolId) {
          console.log("Fetching leaderboard for pool:", targetPoolId);
          const { data: entries, error } = await supabase
            .from('leaderboard_view')
            .select('*')
            .eq('pool_id', targetPoolId)
            .order('rank', { ascending: true });

          if (error) throw error;

          if (entries) {
            // Map to component format with safety checks
            const mappedEntries = entries.map((e: any) => ({
              rank: e.rank || 0,
              playerName: e.username || 'Anonymous',
              xp: Number(e.total_xp) || 0,
              winRate: Number(e.win_rate) || 0,
              prizeNaira: 0, // Placeholder
              isCurrentUser: user ? e.user_id === user.id : false
            }));
            setLeaderboardEntries(mappedEntries);
          }
        } else {
            console.log("No pools found to display leaderboard.");
        }

      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();

    // Subscribe to realtime updates for leaderboard changes
    const channel = supabase
      .channel('leaderboard_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournament_entries'
        },
        () => {
          // Refetch on any change
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
        <div className="text-center text-gray-400 mt-10 p-8 bg-[#011B47] rounded-[18px]">
          <p className="text-lg">No rankings available yet.</p>
          <p className="text-sm mt-2">Join a pool and place bets to appear on the leaderboard!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;