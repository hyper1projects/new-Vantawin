import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ImageDown, Save } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMetadata {
    team_name: string;
    logo_url: string | null;
    league_name: string | null;
}

const TeamRow = ({ team, onUpdate }: { team: TeamMetadata, onUpdate: () => void }) => {
    const [logoUrl, setLogoUrl] = useState(team.logo_url || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from('team_metadata')
            .update({ logo_url: logoUrl })
            .eq('team_name', team.team_name);

        if (error) {
            toast.error(`Failed to update ${team.team_name}: ${error.message}`);
        } else {
            toast.success(`${team.team_name} logo updated!`);
            onUpdate(); // Trigger refetch in parent
        }
        setIsSaving(false);
    };

    return (
        <tr className="border-b border-white/10 hover:bg-white/5">
            <td className="p-3 flex items-center gap-3">
                <img src={logoUrl || '/placeholder.svg'} alt={team.team_name} className="w-8 h-8 object-contain rounded-full bg-black/20 p-1" />
                <div>
                    <div className="font-medium">{team.team_name}</div>
                    <div className="text-xs text-gray-400">{team.league_name || 'N/A'}</div>
                </div>
            </td>
            <td className="p-3">
                <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="Paste logo URL here"
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 font-mono text-xs focus:border-vanta-neon-blue outline-none transition-colors"
                />
            </td>
            <td className="p-3 text-right">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="p-2 bg-vanta-neon-blue/10 text-vanta-neon-blue rounded-lg hover:bg-vanta-neon-blue/20 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
            </td>
        </tr>
    );
};

export default function AdminMetadata() {
    const [isFetchingLogos, setIsFetchingLogos] = useState(false);
    const [teams, setTeams] = useState<TeamMetadata[]>([]);
    const [isLoadingTeams, setIsLoadingTeams] = useState(true);

    const fetchTeams = async () => {
        setIsLoadingTeams(true);
        const { data, error } = await supabase
            .from('team_metadata')
            .select('*')
            .order('team_name', { ascending: true });

        if (error) {
            toast.error('Failed to load team metadata.');
        } else {
            setTeams(data || []);
        }
        setIsLoadingTeams(false);
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleFetchLogos = async () => {
        setIsFetchingLogos(true);
        toast.loading('Searching for missing team logos...');

        const { data, error } = await supabase.functions.invoke('populate-team-metadata');

        toast.dismiss();
        if (error) {
            toast.error('API function failed: ' + error.message);
        } else {
            toast.success(`Processed ${data.processed || 0} teams. Run again if more are missing.`);
            fetchTeams(); // Refresh the list
        }
        setIsFetchingLogos(false);
    };

    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-3">Automatic Logo Fetching</h2>
                <p className="text-sm text-gray-400 mb-4">
                    Use this tool to automatically find and update logos for teams that are missing them. The process runs in batches. If some logos are still missing after one run, simply run it again.
                </p>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Trigger the function to search for missing logos from the API.
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

            <div>
                <h2 className="text-xl font-semibold mb-3">Manual Logo Editor</h2>
                <p className="text-sm text-gray-400 mb-4">
                    Use this editor to manually correct or add a logo URL for any team.
                </p>
                <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-left">
                        <thead className="bg-white/10 text-xs uppercase text-gray-300">
                            <tr>
                                <th className="p-3">Team</th>
                                <th className="p-3">Logo URL</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingTeams ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td>
                                </tr>
                            ) : (
                                teams.map(team => <TeamRow key={team.team_name} team={team} onUpdate={fetchTeams} />)
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}