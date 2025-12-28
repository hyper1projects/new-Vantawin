
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../context/AuthContext';

export interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'payout' | 'entry_fee' | 'refund';
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'processed';
    created_at: string; // Changed from date to match DB
    description?: string;
}

export function useTransactions() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTransactions() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching transactions:', error);
                }

                if (data) {
                    // Map DB fields to Frontend interface if needed (mostly 1:1)
                    // We cast type to match the union type
                    setTransactions(data as unknown as Transaction[]);
                }
            } catch (err) {
                console.error('Error fetching transactions:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchTransactions();
    }, [user]);

    return { transactions, loading };
}
