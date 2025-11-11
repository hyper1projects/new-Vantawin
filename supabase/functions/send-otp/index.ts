import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return new Response(JSON.stringify({ error: 'Phone number is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Replace with your actual Termii API Key from Supabase Secrets
    const TERMMII_API_KEY = Deno.env.get('TERMMII_API_KEY');
    if (!TERMMII_API_KEY) {
      throw new Error('TERMMII_API_KEY is not set in Supabase secrets.');
    }

    // Termii API endpoint for sending OTP
    const termiiSendOtpUrl = 'https://api.ng.termii.com/api/sms/otp/send';

    const response = await fetch(termiiSendOtpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        api_key: TERMMII_API_KEY,
        message_type: 'numeric',
        to: phoneNumber,
        from: 'VantaWin', // Your sender ID
        channel: 'dnd', // Use 'dnd' for Nigeria
        pin_attempts: 3,
        pin_time: 5, // OTP valid for 5 minutes
        pin_length: 5,
        pin_placeholder: '< 12345 >',
        message_text: 'Your VantaWin verification code is < 12345 >. It expires in 5 minutes.',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Termii API Error:', data);
      return new Response(JSON.stringify({ error: data.message || 'Failed to send OTP' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    // Termii returns a pinId which is crucial for verification
    return new Response(JSON.stringify({ message: 'OTP sent successfully', pinId: data.pinId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});