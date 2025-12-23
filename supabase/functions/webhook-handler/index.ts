import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { createHmac } from "https://deno.land/std@0.190.0/node/crypto.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    try {
        const signature = req.headers.get('x-nowpayments-sig');
        const bodyText = await req.text();

        const ipnSecret = Deno.env.get('NOWPAYMENTS__IPN_SECRET');
        if (!ipnSecret) throw new Error('Missing IPN Secret');

        // Verify the signature for security
        const hmac = createHmac('sha512', ipnSecret);
        hmac.update(bodyText);
        const digest = hmac.digest('hex');

        if (digest !== signature) {
            console.warn('Invalid IPN signature received.');
            return new Response('Invalid signature', { status: 400 });
        }

        const body = JSON.parse(bodyText);

        // Process only successful payments
        if (body.payment_status === 'finished') {
            const supabaseClient = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            const userId = body.order_id; // This is the user's UUID
            const amount = body.price_amount;

            if (!userId || !amount) {
                throw new Error('Missing user_id or amount in webhook payload');
            }

            // Call the RPC function to safely increment the user's balance
            const { error } = await supabaseClient.rpc('increment_balance', {
                p_user_id: userId,
                p_amount: amount
            });

            if (error) {
                console.error('Failed to update balance via RPC:', error);
            }
        }

        return new Response('OK', { status: 200, headers: corsHeaders });

    } catch (error) {
        console.error('Webhook Handler Error:', error.message);
        return new Response(error.message, { status: 400, headers: corsHeaders });
    }
});