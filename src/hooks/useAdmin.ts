import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useAdmin() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function checkAdmin() {
            if (!user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single();

                if (error || !data) {
                    console.error('Error checking admin status:', error);
                    setIsAdmin(false);
                } else {
                    setIsAdmin(data.is_admin || false);
                }
            } catch (err) {
                console.error('Failed to check admin status', err);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        }

        checkAdmin();
    }, [user]);

    return { isAdmin, loading };
}