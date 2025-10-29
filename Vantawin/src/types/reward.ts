export interface Reward {
    id: string;
    date: string;
    type: 'bonus' | 'referral' | 'promotion';
    amount: number;
    status: 'claimed' | 'pending' | 'expired';
    description: string;
}