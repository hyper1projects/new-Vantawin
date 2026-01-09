import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LiveLeaderboard from '../LiveLeaderboard';
import { Loader2 } from 'lucide-react';

interface AdminLeaderboardModalProps {
    poolId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AdminLeaderboardModal: React.FC<AdminLeaderboardModalProps> = ({ poolId, open, onOpenChange }) => {
    const [poolName, setPoolName] = useState('');

    useEffect(() => {
        if (open && poolId) {
            fetchPoolName();
        }
    }, [open, poolId]);

    const fetchPoolName = async () => {
        if (!poolId) return;
        try {
            const { data: poolData } = await supabase
                .from('pools')
                .select('name')
                .eq('id', poolId)
                .single();

            if (poolData) setPoolName(poolData.name);
        } catch (error) {
            console.error("Error fetching pool details:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl bg-vanta-dark border-white/10 text-white max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Leaderboard: {poolName}</DialogTitle>
                </DialogHeader>

                {poolId ? (
                    <LiveLeaderboard
                        poolId={poolId}
                        poolStatus="ongoing"
                    />
                ) : (
                    <div className="flex justify-center p-8">
                        <Loader2 className="animate-spin text-vanta-neon-blue w-8 h-8" />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
