"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';
import { Gift, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/context/AuthContext';

interface RewardsHubCardProps {
    className?: string;
}

const TICKET_TIERS = [
    { name: 'Bronze', cost: 0.75, color: 'text-amber-600', bgColor: 'bg-amber-600', indicatorClass: 'bg-amber-600' },
    { name: 'Silver', cost: 3.75, color: 'text-gray-300', bgColor: 'bg-gray-300', indicatorClass: 'bg-gray-300' },
    { name: 'Gold', cost: 7.5, color: 'text-yellow-400', bgColor: 'bg-yellow-400', indicatorClass: 'bg-yellow-400' },
    { name: 'Platinum', cost: 15, color: 'text-cyan-400', bgColor: 'bg-cyan-400', indicatorClass: 'bg-cyan-400' }
];

const VALUE_PER_SHARD = 6.67; // $100 / 15 shards

const RewardsHubCard: React.FC<RewardsHubCardProps> = ({ className }) => {
    const { shardsBalance } = useAuth();
    const currentShards = shardsBalance || 0;
    const moneyEquivalent = (currentShards * VALUE_PER_SHARD).toFixed(2);

    // Find the next ticket tier to work toward
    const getNextTicket = () => {
        for (const tier of TICKET_TIERS) {
            if (currentShards < tier.cost) {
                return tier;
            }
        }
        // User has enough for highest tier - still show Platinum
        return TICKET_TIERS[TICKET_TIERS.length - 1];
    };

    const nextTicket = getNextTicket();
    const shardsNeeded = Math.max(0, nextTicket.cost - currentShards);
    const progress = Math.min((currentShards / nextTicket.cost) * 100, 100);
    const isReady = currentShards >= nextTicket.cost;

    return (
        <div className={cn("bg-vanta-blue-medium p-6 shadow-lg text-vanta-text-light w-full rounded-[27px] flex flex-col relative overflow-hidden", className)}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4 z-10">
                <span className="text-lg font-semibold text-gray-400">REWARDS HUB</span>
                <div className="bg-[#3A3A3A] p-2 rounded-full">
                    <Gift size={16} className="text-yellow-400" />
                </div>
            </div>

            {/* Balance with Money Equivalent */}
            <div className="text-left mb-4 z-10">
                <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-4xl font-bold text-white">{currentShards.toFixed(2)}</p>
                    <span className="text-lg text-vanta-neon-blue font-bold">SHARDS</span>
                    <span className="text-sm text-gray-400">(${moneyEquivalent})</span>
                </div>
            </div>

            {/* Status Message */}
            <div className="mb-4 z-10">
                {isReady ? (
                    <p className="text-sm text-green-400 font-medium">
                        ✓ You can claim a <span className={nextTicket.color}>{nextTicket.name} Ticket</span>!
                    </p>
                ) : (
                    <p className="text-sm text-gray-400">
                        You need <span className="text-white font-bold">{shardsNeeded.toFixed(2)} more</span> to win a{' '}
                        <span className={`font-bold ${nextTicket.color}`}>{nextTicket.name} Ticket</span>
                    </p>
                )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6 z-10">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{nextTicket.name} Ticket Progress</span>
                    <span>{Math.floor(progress)}%</span>
                </div>
                <Progress
                    value={progress}
                    className="h-3 bg-gray-700"
                    indicatorClassName={isReady ? "bg-green-400" : nextTicket.indicatorClass}
                />
            </div>

            {/* Action Button */}
            <div className="w-full mt-auto z-10">
                <Button asChild variant="outline" className="w-full bg-transparent border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-[#016F8A] hover:text-vanta-neon-blue rounded-[14px] py-3 text-lg font-bold">
                    <Link to="/rewards">
                        View All Rewards <Grid size={20} className="ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default RewardsHubCard;
