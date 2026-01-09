"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Ticket, Shirt, Banknote, ArrowLeft, TrendingUp, Target, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const TICKET_TIERS = [
    { name: 'Bronze', cost: 0.75, color: 'text-amber-600', border: 'border-amber-600/30', indicatorClass: 'bg-amber-600' },
    { name: 'Silver', cost: 3.75, color: 'text-gray-300', border: 'border-gray-300/30', indicatorClass: 'bg-gray-300' },
    { name: 'Gold', cost: 7.5, color: 'text-yellow-400', border: 'border-yellow-400/30', indicatorClass: 'bg-yellow-400' },
    { name: 'Platinum', cost: 15, color: 'text-cyan-400', border: 'border-cyan-400/30', indicatorClass: 'bg-cyan-400' }
];

const VALUE_PER_SHARD = 6.67; // $100 / 15 shards

const RewardsHub = () => {
    const { shardsBalance, user } = useAuth();
    const currentShards = shardsBalance || 0;
    const moneyEquivalent = (currentShards * VALUE_PER_SHARD).toFixed(2);

    // Recovery Stats State
    const [recoveryStats, setRecoveryStats] = useState({
        nearMissCount: 0,
        nearMissPools: 0,
        shardVelocity: 0,
        potentialRecovery: 0,
        isLoading: true
    });

    // Badges State
    interface Badge {
        badge_id: string;
        name: string;
        description: string;
        icon: string;
        rarity: string;
        earned: boolean;
        pool_name: string | null;
        user_rank: number | null;
        earned_at: string | null;
    }
    const [badges, setBadges] = useState<Badge[]>([]);
    const [badgesLoading, setBadgesLoading] = useState(true);

    useEffect(() => {
        async function fetchRecoveryStats() {
            if (!user?.id) {
                setRecoveryStats(prev => ({ ...prev, isLoading: false }));
                return;
            }

            try {
                const { data, error } = await supabase.rpc('get_user_recovery_stats', {
                    p_user_id: user.id
                });

                if (error) throw error;

                if (data) {
                    setRecoveryStats({
                        nearMissCount: data.near_miss_count || 0,
                        nearMissPools: data.near_miss_pools || 0,
                        shardVelocity: data.shard_velocity || 0,
                        potentialRecovery: data.potential_recovery || 0,
                        isLoading: false
                    });
                }
            } catch (err) {
                console.error('Error fetching recovery stats:', err);
                setRecoveryStats(prev => ({ ...prev, isLoading: false }));
            }
        }

        fetchRecoveryStats();
    }, [user?.id]);

    // Fetch badges
    useEffect(() => {
        async function fetchBadges() {
            if (!user?.id) {
                setBadgesLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase.rpc('get_user_badges', {
                    p_user_id: user.id
                });

                if (error) throw error;
                if (data) {
                    setBadges(data);
                }
            } catch (err) {
                console.error('Error fetching badges:', err);
            } finally {
                setBadgesLoading(false);
            }
        }

        fetchBadges();
    }, [user?.id]);

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <div className="mb-8">
                <Button variant="ghost" asChild className="mb-4 pl-0 text-gray-400 hover:text-[#00EEEE] hover:bg-transparent">
                    <Link to="/wallet">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wallet
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold text-white mb-2">Rewards Hub</h1>
                <p className="text-gray-400">Track your shards and earn tickets to exclusive events.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Balance Card */}
                <div className="bg-vanta-blue-medium p-8 rounded-[27px] shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-semibold text-gray-400">YOUR BALANCE</span>
                        <div className="bg-[#3A3A3A] p-2 rounded-full">
                            <Gift size={24} className="text-yellow-400" />
                        </div>
                    </div>
                    <div className="flex items-end gap-3 mb-2">
                        <p className="text-6xl font-bold text-white">{currentShards.toFixed(2)}</p>
                        <span className="text-2xl text-vanta-neon-blue font-bold mb-3">SHARDS</span>
                        <span className="text-lg text-gray-400 mb-3">(${moneyEquivalent})</span>
                    </div>
                    <p className="text-gray-400">Earn shards by placing in the Mid 25% of any pool.</p>
                </div>

                {/* Path to Victory - Recovery Stats Card */}
                <div className="bg-vanta-blue-medium p-6 rounded-[27px] shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-400">YOUR PATH TO VICTORY</span>
                        <div className="bg-purple-500/20 p-2 rounded-full">
                            <TrendingUp size={20} className="text-purple-400" />
                        </div>
                    </div>

                    {recoveryStats.isLoading ? (
                        <div className="text-center py-4 text-gray-500">Loading stats...</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-4 text-center mb-4">
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Target size={14} className="text-yellow-400" />
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        {recoveryStats.nearMissCount}
                                        <span className="text-sm text-gray-400">/{recoveryStats.nearMissPools}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">Near-Misses</p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <TrendingUp size={14} className="text-vanta-neon-blue" />
                                    </div>
                                    <p className="text-2xl font-bold text-vanta-neon-blue">
                                        {recoveryStats.shardVelocity.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500">Avg/Game</p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <DollarSign size={14} className="text-green-400" />
                                    </div>
                                    <p className="text-2xl font-bold text-green-400">
                                        ${recoveryStats.potentialRecovery.toFixed(0)}
                                    </p>
                                    <p className="text-xs text-gray-500">Value</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 italic text-center">
                                {recoveryStats.nearMissCount > 0
                                    ? `You've been so close! ${recoveryStats.nearMissCount} of your last ${recoveryStats.nearMissPools} games earned shards.`
                                    : recoveryStats.nearMissPools > 0
                                        ? "Keep pushing! You're building your path to victory."
                                        : "Play more games to track your path to victory!"}
                            </p>
                        </>
                    )}
                </div>

                {/* Ticket Milestones */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Ticket Milestones</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {TICKET_TIERS.map((ticket) => {
                            const isUnlocked = currentShards >= ticket.cost;
                            const ticketProgress = Math.min((currentShards / ticket.cost) * 100, 100);

                            return (
                                <div key={ticket.name} className={`bg-vanta-blue-medium p-5 rounded-[20px] border ${ticket.border} relative overflow-hidden group`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className={`font-bold text-lg ${ticket.color}`}>{ticket.name}</h3>
                                            <p className="text-gray-400 text-sm">{ticket.cost} Shards</p>
                                        </div>
                                        {isUnlocked ? (
                                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold uppercase">Unlocked</span>
                                        ) : (
                                            <span className="bg-gray-700/50 text-gray-500 text-xs px-2 py-1 rounded font-bold uppercase">Locked</span>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Progress</span>
                                            <span>{Math.floor(ticketProgress)}%</span>
                                        </div>
                                        <Progress value={ticketProgress} className="h-2 bg-gray-800" indicatorClassName={isUnlocked ? "bg-green-400" : ticket.indicatorClass} />
                                    </div>

                                    {isUnlocked && (
                                        <Button variant="ghost" size="sm" className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white border border-white/10">
                                            Redeem Ticket <Ticket className="ml-2 h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Badges Collection Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-6">Badge Collection</h2>
                {badgesLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading badges...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {badges.map((badge) => {
                            const rarityColors: Record<string, string> = {
                                legendary: 'border-yellow-500/50 bg-yellow-500/5',
                                epic: 'border-purple-500/50 bg-purple-500/5',
                                rare: 'border-blue-500/50 bg-blue-500/5',
                                common: 'border-gray-600/50 bg-gray-600/5'
                            };
                            const rarityBorderClass = rarityColors[badge.rarity] || rarityColors.common;

                            return (
                                <div
                                    key={badge.badge_id}
                                    className={`relative p-4 rounded-[16px] border transition-all ${badge.earned
                                        ? `${rarityBorderClass} hover:scale-105`
                                        : 'border-gray-800 bg-gray-900/50 opacity-40'
                                        }`}
                                >
                                    {/* Badge Icon */}
                                    <div className="text-4xl text-center mb-2">
                                        {badge.earned ? badge.icon : '🔒'}
                                    </div>

                                    {/* Badge Name */}
                                    <h3 className={`text-center font-bold text-sm mb-1 ${badge.earned ? 'text-white' : 'text-gray-600'
                                        }`}>
                                        {badge.name}
                                    </h3>

                                    {/* Badge Description */}
                                    <p className="text-center text-xs text-gray-500 mb-2">
                                        {badge.description}
                                    </p>

                                    {/* Earned Details */}
                                    {badge.earned && badge.pool_name && (
                                        <div className="text-center text-[10px] text-gray-400 bg-black/30 rounded px-2 py-1">
                                            <div className="font-medium text-white truncate">{badge.pool_name}</div>
                                            {badge.user_rank && <span>Rank #{badge.user_rank}</span>}
                                            {badge.earned_at && (
                                                <span className="ml-1">• {new Date(badge.earned_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Rarity Badge */}
                                    {badge.earned && (
                                        <div className={`absolute top-2 right-2 text-[8px] uppercase font-bold px-1.5 py-0.5 rounded ${badge.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                                            badge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                                                badge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {badge.rarity}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="h-20" /> {/* Spacer */}
        </div>
    );
};

export default RewardsHub;
