import React from 'react';
import AdminWithdrawals from './AdminWithdrawals';
import AdminMatches from './AdminMatches';
import AdminMetadata from './AdminMetadata';
import AdminPools from './AdminPools';
import AdminPayouts from './AdminPayouts';
import { triggerOddsFetch } from '@/utils/triggerFetch';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = React.useState<'operations' | 'withdrawals' | 'pools' | 'payouts'>('operations');
    const [isSyncing, setIsSyncing] = React.useState(false);
    const { toast } = useToast();

    const handleSync = async () => {
        setIsSyncing(true);
        toast({ title: "Syncing Odds...", description: "Fetching latest data from the API." });

        const result = await triggerOddsFetch();

        if (result) {
            toast({ title: "Sync Complete", description: "Latest odds have been updated." });
        } else {
            toast({ title: "Sync Failed", description: "Could not fetch data from the server.", variant: "destructive" });
        }
        setIsSyncing(false);
    };

    return (
        <div className="min-h-screen bg-vanta-dark text-white p-4 md:p-6 pb-20 md:pb-6 max-w-7xl mx-auto">{/* Removed ml-64, added max-width and auto margins for centering */}
            <header className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-vanta-neon-blue to-purple-500 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">Control center for Vantawin operations.</p>
                </div>
                <Button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="bg-vanta-neon-blue/20 text-vanta-neon-blue hover:bg-vanta-neon-blue/40 border border-vanta-neon-blue/50 w-full sm:w-auto"
                >
                    <RefreshCcw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Odds'}
                </Button>
            </header>

            <div className="flex gap-2 md:gap-4 mb-6 border-b border-white/10 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('operations')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'operations'
                        ? 'text-vanta-neon-blue border-b-2 border-vanta-neon-blue'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Operations
                </button>
                <button
                    onClick={() => setActiveTab('pools')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'pools'
                        ? 'text-vanta-neon-blue border-b-2 border-vanta-neon-blue'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Pools
                </button>
                <button
                    onClick={() => setActiveTab('payouts')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'payouts'
                        ? 'text-vanta-neon-blue border-b-2 border-vanta-neon-blue'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Payouts
                </button>
                <button
                    onClick={() => setActiveTab('withdrawals')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'withdrawals'
                        ? 'text-vanta-neon-blue border-b-2 border-vanta-neon-blue'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Withdrawals
                </button>
            </div>

            {activeTab === 'operations' && (
                <div className="space-y-8">
                    <AdminMetadata />
                    <AdminMatches />
                </div>
            )}
            {activeTab === 'pools' && <AdminPools />}
            {activeTab === 'payouts' && <AdminPayouts />}
            {activeTab === 'withdrawals' && <AdminWithdrawals />}
        </div>
    );
}