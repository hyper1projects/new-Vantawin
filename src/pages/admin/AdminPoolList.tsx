import React, { useState } from 'react';
import { usePools } from '../../hooks/usePools';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Loader2, Merge, Eye, Edit, Save, X, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AdminLeaderboardModal } from '../../components/admin/AdminLeaderboardModal';

export default function AdminPoolList() {
    const { pools, loading, error } = usePools();
    const [consolidating, setConsolidating] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [editingPool, setEditingPool] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);
    const [viewingLeaderboardPoolId, setViewingLeaderboardPoolId] = useState<string | null>(null);

    const handleConsolidate = async (poolId: string) => {
        if (!confirm('Are you sure you want to consolidate this pool? This will attempt to move all users to another suitable pool.')) return;

        setConsolidating(poolId);
        setMessage(null);

        try {
            const { data, error } = await supabase.rpc('consolidate_pool', { p_pool_id: poolId });

            if (error) throw error;

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setMessage({ type: 'error', text: data.message });
            }

        } catch (err: any) {
            console.error('Consolidation failed:', err);
            setMessage({ type: 'error', text: err.message });
        } finally {
            setConsolidating(null);
        }
    };

    const handleEditSave = async () => {
        if (!editingPool) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('pools')
                .update({
                    name: editingPool.name,
                    status: editingPool.status,
                    start_time: editingPool.startTime,
                    end_time: editingPool.endTime,
                    tier: editingPool.tier,
                })
                .eq('id', editingPool.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Pool updated successfully' });
            setEditingPool(null);
            setTimeout(() => window.location.reload(), 1000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    // Sort by latest created/start
    const sortedPools = [...pools].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return (
        <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Manage Pools</CardTitle>
                    <CardDescription>Full control over all pools.</CardDescription>
                </CardHeader>
                <CardContent>
                    {message && (
                        <div className={`mb-4 p-3 rounded bg-opacity-20 ${message.type === 'success' ? 'bg-green-500 text-green-200' : 'bg-red-500 text-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        {sortedPools.map(pool => (
                            <div key={pool.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5 gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-lg">{pool.name}</span>
                                        <Badge variant="outline" className={pool.status === 'ongoing' ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
                                            {pool.status}
                                        </Badge>
                                        <Badge variant="secondary">{pool.tier}</Badge>
                                        <span className="text-xs text-gray-500 font-mono">{pool.id.slice(0, 8)}...</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Fee: ${pool.entryFee} • Pot: ${pool.prizePool}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Participants: <span className={pool.minParticipants && pool.participants < pool.minParticipants ? "text-red-400 font-bold" : "text-white"}>
                                            {pool.participants}
                                        </span>
                                        {pool.maxParticipants && ` / ${pool.maxParticipants}`}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Start: {format(new Date(pool.startTime), 'MMM d, HH:mm')} • End: {format(new Date(pool.endTime), 'MMM d, HH:mm')}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-blue-400 border-blue-400 hover:bg-blue-500/10"
                                        onClick={() => setEditingPool({ ...pool })}
                                    >
                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-yellow-400 border-yellow-400 hover:bg-yellow-500/10"
                                        onClick={() => window.open(`/pool/${pool.id}`, '_blank')}
                                    >
                                        <Eye className="h-4 w-4 mr-1" /> View Pool
                                    </Button>

                                    {/* Admin Embedded Leaderboard */}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-purple-400 border-purple-400 hover:bg-purple-500/10"
                                        onClick={() => setViewingLeaderboardPoolId(pool.id)}
                                    >
                                        <Trophy className="h-4 w-4 mr-1" /> Leaderboard
                                    </Button>


                                    {(pool.status === 'upcoming' || pool.status === 'ongoing') && pool.minParticipants && pool.participants < pool.minParticipants && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={consolidating === pool.id}
                                            onClick={() => handleConsolidate(pool.id)}
                                        >
                                            {consolidating === pool.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Merge className="h-4 w-4 mr-1" />}
                                            Consolidate
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Modal */}
            <Dialog open={!!editingPool} onOpenChange={(open) => !open && setEditingPool(null)}>
                <DialogContent className="bg-vanta-dark border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Edit Pool: {editingPool?.name}</DialogTitle>
                        <DialogDescription>Modify pool configuration directly.</DialogDescription>
                    </DialogHeader>

                    {editingPool && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Pool Name</Label>
                                <Input
                                    value={editingPool.name}
                                    onChange={(e) => setEditingPool({ ...editingPool, name: e.target.value })}
                                    className="bg-black/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={editingPool.status}
                                        onValueChange={(val) => setEditingPool({ ...editingPool, status: val })}
                                    >
                                        <SelectTrigger className="bg-black/20"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="upcoming">Upcoming</SelectItem>
                                            <SelectItem value="ongoing">Ongoing</SelectItem>
                                            <SelectItem value="ended">Ended</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tier</Label>
                                    <Select
                                        value={editingPool.tier}
                                        onValueChange={(val) => setEditingPool({ ...editingPool, tier: val })}
                                    >
                                        <SelectTrigger className="bg-black/20"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Bronze">Bronze</SelectItem>
                                            <SelectItem value="Silver">Silver</SelectItem>
                                            <SelectItem value="Gold">Gold</SelectItem>
                                            <SelectItem value="Platinum">Platinum</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Input
                                    type="datetime-local"
                                    value={editingPool.startTime ? new Date(editingPool.startTime).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setEditingPool({ ...editingPool, startTime: new Date(e.target.value).toISOString() })}
                                    className="bg-black/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>End Time</Label>
                                <Input
                                    type="datetime-local"
                                    value={editingPool.endTime ? new Date(editingPool.endTime).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setEditingPool({ ...editingPool, endTime: new Date(e.target.value).toISOString() })}
                                    className="bg-black/20"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingPool(null)}>Cancel</Button>
                        <Button onClick={handleEditSave} disabled={saving} className="bg-vanta-neon-blue text-black font-bold">
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Embedded Leaderboard Modal */}
            <AdminLeaderboardModal
                poolId={viewingLeaderboardPoolId}
                open={!!viewingLeaderboardPoolId}
                onOpenChange={(open) => !open && setViewingLeaderboardPoolId(null)}
            />
        </div>
    );
}
