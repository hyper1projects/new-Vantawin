import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

Deno.serve(async (req) => {
    try {
        const signature = req.headers.get('x-nowpayments-sig')
        const bodyText = await req.text()

        const ipnSecret = Deno.env.get('NOWPAYMENTS_IPN_SECRET')
        if (!ipnSecret) throw new Error('Missing IPN Secret')

        const body = JSON.parse(bodyText)

        // Sort keys and verify
        // const sortedKeys = Object.keys(body).sort()
        // const message = sortedKeys.map(key => body[key]).join('')

        if (body.payment_status === 'finished') {
            const supabaseClient = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            )

            // Assuming we get user_id from order_id for now
            // Note: Make sure create-invoice passes user_id in the future updates
            const userId = body.order_id
            const amount = body.price_amount

            const { error } = await supabaseClient.rpc('increment_balance', {
                p_user_id: userId,
                p_amount: amount
            })
            if (error) console.error('Failed to update balance', error)
        }

        return new Response('OK', { status: 200 })
    } catch (error) {
        return new Response(error.message, { status: 400 })
    }
})
