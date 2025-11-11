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
    const { pinId, otpCode } = await req.json();

    if (!pinId || !otpCode) {
      return new Response(JSON.stringify({ error: 'pinId and otpCode are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Replace with your actual Termii API Key from Supabase Secrets
    const TERMMII_API_KEY = Deno.env.get('TERMMII_API_KEY');
    if (!TERMMII_API_KEY) {
      throw new Error('TERMMII_API_KEY is not set in Supabase secrets.');
    }

    // Termii API endpoint for verifying OTP
    const termiiVerifyOtpUrl = 'https://api.ng.termii.com/api/sms/otp/verify';

    const response = await fetch(termiiVerifyOtpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        api_key: TERMMII_API_KEY,
        pin_id: pinId,
        pin: otpCode,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== 'success') {
      console.error('Termii API Error:', data);
      return new Response(JSON.stringify({ error: data.message || 'OTP verification failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ message: 'OTP verified successfully', verified: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});