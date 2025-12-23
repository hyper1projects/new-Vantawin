import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface GatekeeperStatus {
    hasEntry: boolean;
    vantaBalance: number;
    poolId: string | null;
    isLoading: boolean;
    checkEntryStatus: () => Promise<void>;
}

export const useGatekeeper = (): GatekeeperStatus => {
    const { user } = useAuth();
    const [hasEntry, setHasEntry] = useState<boolean>(false);
    const [vantaBalance, setVantaBalance] = useState<number>(0);
    const [poolId, setPoolId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkEntryStatus = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('check-entry');

            if (error) {
                console.error('Gatekeeper Check Failed:', error);
                // Fallback or handle error? For now, assume no entry if check fails.
            }

            if (data) {
                setHasEntry(data.has_entry);
                setVantaBalance(data.vanta_balance);
                setPoolId(data.pool_id);
            }
        } catch (err) {
            console.error('Gatekeeper Unexpected Error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        checkEntryStatus();
    }, [checkEntryStatus]);

    return {
        hasEntry,
        vantaBalance,
        poolId,
        isLoading,
        checkEntryStatus
    };
};