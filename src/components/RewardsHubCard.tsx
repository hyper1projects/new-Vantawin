"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';
import { ExternalLink, Gift, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/context/AuthContext';

interface RewardsHubCardProps {
    className?: string;
}

const RewardsHubCard: React.FC<RewardsHubCardProps> = ({ className }) => {
    const { shardsBalance } = useAuth();
    const currentShards = shardsBalance || 0;
    const shardsForTicket = 4;
    const progress = (currentShards / shardsForTicket) * 100;

    return (
        <div className={cn("bg-vanta-blue-medium p-6 shadow-lg text-vanta-text-light w-full rounded-[27px] flex flex-col relative overflow-hidden", className)}>
            {/* Background decoration/glow could go here */}

            {/* Header */}
            <div className="flex justify-between items-center mb-6 z-10">
                <span className="text-lg font-semibold text-gray-400">REWARDS HUB</span>
                <div className="bg-[#3A3A3A] p-2 rounded-full cursor-help relative group">
                    <Gift size={16} className="text-yellow-400" />
                    {/* Tooltip for context */}
                    <div className="absolute right-0 top-8 w-64 p-3 bg-black/90 border border-gray-700 rounded-lg text-xs text-gray-300 hidden group-hover:block z-50">
                        Shards are awarded to the mid 25% of players (26th-50th place). Collect 4 Shards for a Second Chance Ticket.
                    </div>
                </div>
            </div>

            {/* Main Content: Shards Balance */}
            <div className="text-left mb-6 flex-grow z-10">
                <div className="flex items-end gap-3 mb-2">
                    <p className="text-5xl font-bold text-white">{currentShards}</p>
                    <span className="text-xl text-vanta-neon-blue font-bold mb-2">SHARDS</span>
                </div>
                <p className="text-sm text-gray-400">Collect {shardsForTicket} to unlock a ticket.</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-6 z-10">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Progress to Ticket</span>
                    <span>{currentShards}/{shardsForTicket}</span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-700" indicatorClassName="bg-vanta-neon-blue" />
            </div>

            {/* Reward Tiers Info - Small text/grid */}
            <div className="bg-black/20 rounded-xl p-3 mb-6 z-10 text-xs text-gray-400 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col">
                    <span className="text-white font-bold">3 Shards</span>
                    <span>26th Place</span>
                </div>
                <div className="flex flex-col border-x border-gray-700">
                    <span className="text-white font-bold">2 Shards</span>
                    <span>27th-35th</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-bold">1.5 Shards</span>
                    <span>36th-50th</span>
                </div>
            </div>

            {/* Action Button */}
            <div className="w-full mt-auto z-10 flex flex-col gap-3">
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
