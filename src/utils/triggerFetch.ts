import { supabase } from '@/integrations/supabase/client';

export const triggerOddsFetch = async () => {
    try {
        console.log("Triggering fetch-odds edge function...");
        const { data, error } = await supabase.functions.invoke('fetch-odds');

        if (error) {
            console.error("Error invoking function:", error);
            throw error;
        }

        console.log("Fetch success:", data);
        return data;
    } catch (e) {
        console.error("API Trigger Failed:", e);
        return null;
    }
};
