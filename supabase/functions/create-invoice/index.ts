const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { tier, amount } = await req.json()
        
        // Corrected API Key variable name from NOWPAYMENTS_API_KEY to NOWPAYMENTS__API_KEY
        const apiKey = Deno.env.get('NOWPAYMENTS__API_KEY')
        if (!apiKey) throw new Error('Missing NOWPayments API Key')

        // Use IS_SANDBOX to determine the correct API endpoint
        const isSandbox = Deno.env.get('IS_SANDBOX') === 'true';
        const nowPaymentsUrl = isSandbox
            ? 'https://api-sandbox.nowpayments.io/v1/invoice'
            : 'https://api.nowpayments.io/v1/invoice';

        // Use SITE_URL for redirects, with a fallback to SUPABASE_URL
        // The user should be advised to set SITE_URL to their frontend URL.
        const siteUrl = Deno.env.get('SITE_URL') || Deno.env.get('SUPABASE_URL');
        if (!siteUrl) {
            throw new Error('SITE_URL or SUPABASE_URL environment variable is not set.');
        }

        // Call NOWPayments
        const response = await fetch(nowPaymentsUrl, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                price_amount: amount,
                price_currency: 'usd',
                pay_currency: 'btc', // defaulting to BTC for display, user can change on NP
                order_description: `Tier: ${tier}`,
                ipn_callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-handler`,
                success_url: `${siteUrl}/games`, // Redirect back to games
                cancel_url: `${siteUrl}/wallet`
            })
        })

        const data = await response.json()
        if (!response.ok) {
            console.error("NOWPayments API Error:", data);
            throw new Error(JSON.stringify(data));
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