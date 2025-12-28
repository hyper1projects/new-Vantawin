import React from 'react';
import AdminWithdrawals from './AdminWithdrawals';
import AdminMatches from './AdminMatches';
import AdminMetadata from './AdminMetadata';
import AdminPools from './AdminPools';
import AdminPayouts from './AdminPayouts';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = React.useState<'operations' | 'withdrawals' | 'pools' | 'payouts'>('operations');

    return (
        <div className="min-h-screen bg-vanta-dark text-white p-6 pb-20 md:pb-6 ml-0 md:ml-64">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-vanta-neon-blue to-purple-500 bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <p className="text-gray-400">Control center for Vantawin operations.</p>
            </header>

            <div className="flex gap-4 mb-6 border-b border-white/10 overflow-x-auto">
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