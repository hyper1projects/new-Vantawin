import { supabase } from '@/integrations/supabase/client';

export interface CreatePaymentResponse {
    id: string;
    order_id: string;
    order_description: string;
    price_amount: string;
    price_currency: string;
    pay_currency: string;
    ipn_callback_url: string;
    invoice_url: string;
    success_url: string;
    cancel_url: string;
    created_at: string;
    updated_at: string;
}

export const createPayment = async (tier: string, amount: number, poolId: string): Promise<CreatePaymentResponse> => {
    const { data, error } = await supabase.functions.invoke('create-invoice', {
        body: { tier, amount, pool_id: poolId }
    });

    if (error) throw new Error(error.message);
    return data;
};
