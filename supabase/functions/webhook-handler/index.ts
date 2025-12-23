import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { hmac } from 'https://esm.sh/js-sha512';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    try {
        const signature = req.headers.get('x-nowpayments-sig');
        const bodyText = await req.text();

        const ipnSecret = Deno.env.get('NOWPAYMENTS__IPN_SECRET');
        if (!ipnSecret) {
            console.error('Missing IPN Secret');
            return new Response('Server configuration error: Missing IPN Secret', { status: 500 });
        }

        // Verify the signature for security using js-sha512
        const digest = hmac.create(ipnSecret).update(bodyText).hex();

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
                // Even if DB update fails, we must return 200 to NOWPayments to prevent retries
            }
        }

        // Always return 200 OK to NOWPayments if the signature is valid
        return new Response('OK', { status: 200, headers: corsHeaders });

    } catch (error) {
        console.error('Webhook Handler Error:', error.message);
        // Return a generic error to the caller, but log the details
        return new Response('An internal error occurred', { status: 500, headers: corsHeaders });
    }
});