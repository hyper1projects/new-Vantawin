"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Gift, Info, Ticket, Shirt, Banknote, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/context/AuthContext';

const RewardsHub = () => {
    // Mock data - in a real app this would come from an API/Context
    const { shardsBalance } = useAuth();
    const currentShards = shardsBalance || 0;
    const shardsForTicket = 4;
    const progress = (currentShards / shardsForTicket) * 100;

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Status Card - Similar to the dashboard card but expanded */}
                <div className="bg-vanta-blue-medium p-8 rounded-[27px] shadow-lg relative overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-xl font-semibold text-gray-400">YOUR PROGRESS</span>
                        <div className="bg-[#3A3A3A] p-2 rounded-full">
                            <Gift size={24} className="text-yellow-400" />
                        </div>
                    </div>

                    {/* Shards Balance */}
                    <div className="mb-8">
                        <div className="flex items-end gap-3 mb-2">
                            <p className="text-6xl font-bold text-white">{currentShards}</p>
                            <span className="text-2xl text-vanta-neon-blue font-bold mb-3">SHARDS</span>
                        </div>
                        <p className="text-gray-400">Collect {shardsForTicket} shards to unlock a Second Chance Ticket.</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full mb-8">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Progress to Ticket</span>
                            <span>{currentShards}/{shardsForTicket}</span>
                        </div>
                        <Progress value={progress} className="h-4 bg-gray-700" indicatorClassName="bg-vanta-neon-blue" />
                    </div>

                    <Button asChild className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-4 text-xl font-bold">
                        <Link to="/second-chance">
                            View Second Chance Event <ExternalLink size={24} className="ml-2" />
                        </Link>
                    </Button>
                </div>

                {/* Rules / Info Side */}
                <div className="bg-vanta-blue-medium p-8 rounded-[27px] shadow-lg flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-white mb-6">How it Works</h2>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-vanta-neon-blue/10 p-3 rounded-xl border border-vanta-neon-blue/20">
                                <span className="text-vanta-neon-blue font-bold text-lg">1</span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">Rank in the Mid 25%</h3>
                                <p className="text-gray-400">Finish between 26th and 50th place in predictions to earn Shards.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-vanta-neon-blue/10 p-3 rounded-xl border border-vanta-neon-blue/20">
                                <span className="text-vanta-neon-blue font-bold text-lg">2</span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">Collect Shards</h3>
                                <ul className="text-gray-400 text-sm space-y-1 mt-1">
                                    <li>• 26th Place: <span className="text-white font-bold">3 Shards</span></li>
                                    <li>• 27th-35th: <span className="text-white font-bold">2 Shards</span></li>
                                    <li>• 36th-50th: <span className="text-white font-bold">1.5 Shards</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-vanta-neon-blue/10 p-3 rounded-xl border border-vanta-neon-blue/20">
                                <span className="text-vanta-neon-blue font-bold text-lg">3</span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">Unlock Second Chance</h3>
                                <p className="text-gray-400">Reach 4 Shards to get a free ticket to the exclusive Second Chance Event.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rewards Gallery Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-6">Rewards Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Key Reward: Ticket Voucher */}
                    <div className="bg-vanta-blue-medium p-6 rounded-[20px] shadow-lg border border-vanta-neon-blue/20 hover:border-vanta-neon-blue transition-colors group">
                        <div className="bg-[#3A3A3A] p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-vanta-neon-blue/20 transition-colors">
                            <Ticket size={32} className="text-vanta-neon-blue" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Ticket Voucher</h3>
                        <p className="text-gray-400 text-sm mb-4">Redeemable for entry into premium pools and special events.</p>
                        <Button variant="outline" className="w-full bg-transparent border-vanta-neon-blue text-vanta-neon-blue hover:bg-transparent hover:text-vanta-neon-blue/80">
                            Coming Soon
                        </Button>
                    </div>

                    {/* Merch */}
                    <div className="bg-vanta-blue-medium p-6 rounded-[20px] shadow-lg border border-transparent hover:border-gray-600 transition-colors opacity-80 decoration-slate-500">
                        <div className="bg-[#3A3A3A] p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Shirt size={32} className="text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Vanta Merch</h3>
                        <p className="text-gray-400 text-sm mb-4">Exclusive hoodies, caps, and jerseys for top performers.</p>
                        <div className="text-center text-xs text-gray-500 font-mono py-2 bg-black/20 rounded">
                            LOCKED
                        </div>
                    </div>

                    {/* Bonus Cash */}
                    <div className="bg-vanta-blue-medium p-6 rounded-[20px] shadow-lg border border-transparent hover:border-gray-600 transition-colors opacity-80">
                        <div className="bg-[#3A3A3A] p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Banknote size={32} className="text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Bonus Cash</h3>
                        <p className="text-gray-400 text-sm mb-4">Direct wallet top-ups to boost your betting power.</p>
                        <div className="text-center text-xs text-gray-500 font-mono py-2 bg-black/20 rounded">
                            LOCKED
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardsHub;
