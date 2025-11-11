import { supabase } from './client';

const SUPABASE_FUNCTIONS_URL = "https://znixyxfchxezwsyewath.supabase.co/functions/v1";

export const sendOtpFunction = async (phoneNumber: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-otp', {
      body: { phoneNumber },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (error) {
      console.error('Error invoking send-otp function:', error);
      throw new Error(error.message);
    }
    return data; // Should contain { message: 'OTP sent successfully', pinId: '...' }
  } catch (error: any) {
    console.error('Failed to send OTP:', error.message);
    throw error;
  }
};

export const verifyOtpFunction = async (pinId: string, otpCode: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-otp', {
      body: { pinId, otpCode },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (error) {
      console.error('Error invoking verify-otp function:', error);
      throw new Error(error.message);
    }
    return data; // Should contain { message: 'OTP verified successfully', verified: true }
  } catch (error: any) {
    console.error('Failed to verify OTP:', error.message);
    throw error;
  }
};