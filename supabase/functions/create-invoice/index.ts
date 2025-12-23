import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Authenticate the user to get their ID
        const authHeader = req.headers.get('Authorization')!
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )
        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        // 2. Parse request body
        const { tier, amount, success_url, cancel_url } = await req.json()

        // 3. Get secrets and determine environment
        const apiKey = Deno.env.get('NOWPAYMENTS__API_KEY')
        if (!apiKey) throw new Error('Missing NOWPayments API Key')

        const isSandbox = Deno.env.get('IS_SANDBOX') === 'true';
        const nowPaymentsUrl = isSandbox
            ? 'https://api-sandbox.nowpayments.io/v1/invoice'
            : 'https://api.nowpayments.io/v1/invoice';

        // 4. Prepare URLs
        const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:8080';
        const successUrl = success_url || `${siteUrl}/games`;
        const cancelUrl = cancel_url || `${siteUrl}/wallet`;

        // 5. Call NOWPayments API
        const response = await fetch(nowPaymentsUrl, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                price_amount: amount,
                price_currency: 'usd',
                order_id: user.id, // CRITICAL: Link invoice to the user
                order_description: `Vantawin Tier: ${tier}`,
                ipn_callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-handler`,
                success_url: successUrl,
                cancel_url: cancelUrl,
                is_fee_paid_by_user: true // Recommended setting
            })
        })

        const data = await response.json()
        if (!response.ok) {
            console.error("NOWPayments API Error:", data);
            throw new Error(data.message || JSON.stringify(data));
        }

        return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error("Create Invoice Error:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})