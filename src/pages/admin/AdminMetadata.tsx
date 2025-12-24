import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ImageDown } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMetadata() {
    const [isFetchingLogos, setIsFetchingLogos] = useState(false);

    const handleFetchLogos = async () => {
        setIsFetchingLogos(true);
        toast.loading('Searching for missing team logos...');

        const { data, error } = await supabase.functions.invoke('populate-team-metadata');

        toast.dismiss();
        if (error) {
            toast.error('Failed to fetch logos: ' + error.message);
        } else {
            toast.success(`Processed ${data.processed || 0} teams. Run again if more are missing.`);
        }
        setIsFetchingLogos(false);
    };

    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold mb-3">Data Enrichment</h2>
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                    Manually search for missing team logos from the external API. <br />
                    This process runs in batches of 10.
                </p>
                <button
                    onClick={handleFetchLogos}
                    disabled={isFetchingLogos}
                    className="px-4 py-2 bg-vanta-neon-blue/10 text-vanta-neon-blue rounded-lg hover:bg-vanta-neon-blue/20 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isFetchingLogos ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <ImageDown className="w-5 h-5" />
                    )}
                    <span>{isFetchingLogos ? 'Searching...' : 'Find Missing Logos'}</span>
                </button>
            </div>
        </div>
    );
}