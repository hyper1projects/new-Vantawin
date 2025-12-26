
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../context/AuthContext';

export interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'winning' | 'refund';
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'processed';
    date: string;
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
                const txs: Transaction[] = [];

                // 1. Fetch Withdrawals
                const { data: withdrawals, error: withdrawalsError } = await supabase
                    .from('withdrawals')
                    .select('*')
                    .eq('user_id', user.id);

                if (withdrawalsError) console.error('Error fetching withdrawals:', withdrawalsError);

                if (withdrawals) {
                    withdrawals.forEach((w: any) => {
                        txs.push({
                            id: w.id,
                            type: 'withdrawal',
                            amount: w.amount,
                            status: w.status,
                            date: w.created_at,
                            description: `Withdrawal to ${w.wallet_address?.substring(0, 6)}...`
                        });
                    });
                }

                // 2. Fetch Winnings (from settled tournament entries)
                const { data: winnings, error: winningsError } = await supabase
                    .from('tournament_entries')
                    .select(`
            id,
            prize_money,
            created_at, 
            pool:pools(tier, end_time)
          `)
                    .eq('user_id', user.id)
                    .gt('prize_money', 0); // Only entries with prize money

                if (winningsError) console.error('Error fetching winnings:', winningsError);

                if (winnings) {
                    winnings.forEach((win: any) => {
                        // Use pool end_time as date if available, else entry created_at (approx)
                        // But winnings usually happen at end_time.
                        const date = win.pool?.end_time || win.created_at;
                        txs.push({
                            id: win.id,
                            type: 'winning',
                            amount: win.prize_money,
                            status: 'completed',
                            date: date,
                            description: `Won in ${win.pool?.tier} Pool`
                        });
                    });
                }

                // 3. Mock Deposits (Since no table exists yet)
                // Check if user has real money balance > 0 and no winnings? 
                // Or just leave empty to avoid confusion.
                // User asked for "amount of vanta purchased".
                // If we want to mock it strictly for demo:
                // txs.push({ id: 'mock-1', type: 'deposit', amount: 1000, status: 'completed', date: new Date().toISOString(), description: 'Initial Deposit' });

                // Sort by date descending
                txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setTransactions(txs);
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
