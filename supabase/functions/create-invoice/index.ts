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
        const apiKey = Deno.env.get('NOWPAYMENTS_API_KEY')
        if (!apiKey) throw new Error('Missing NOWPayments API Key')

        // Call NOWPayments
        const response = await fetch('https://api-sandbox.nowpayments.io/v1/invoice', {
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
                success_url: `${Deno.env.get('SITE_URL')}/games`, // Redirect back to games
                cancel_url: `${Deno.env.get('SITE_URL')}/wallet`
            })
        })

        const data = await response.json()
        if (!response.ok) throw new Error(JSON.stringify(data))

        return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
