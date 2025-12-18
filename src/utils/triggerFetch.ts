import { supabase } from '@/integrations/supabase/client';

export const triggerOddsFetch = async () => {
    try {
        console.log("Triggering fetch-odds edge function...");
        const { data, error } = await supabase.functions.invoke('fetch-odds');

        if (error) {
            console.error('Error invoking fetch-odds:', error);
            return false;
        }

        console.log('Fetch-odds response:', data); // Log the full response
        if (data && data.error) {
            console.error('Fetch-odds internal error:', data.error);
            return false;
        }

        // Check if count is 0
        if (data && data.count === 0) {
            console.warn('Fetch-odds success but returned 0 games. Check API usage or League Keys.');
        }

        return true;
    } catch (err) {
        console.error('Unexpected error triggering fetch:', err);
        return false;
    }
};
